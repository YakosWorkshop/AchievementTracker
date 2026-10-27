

import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from pathlib import Path
from datetime import datetime

from api.adapters.rpcs3_parser import RPCS3Parser

_ACHIEVEMENT_GRADE = {
    "B": "bronze",
    "S": "silver",
    "G": "gold",
    "P": "platinum",
}

class InvalidGameConfigError(Exception):
    """Indicate a missing required XML value or a failed metadata validation."""

@dataclass
class ImportedTrophyData:
    """Hold one trophy's definition independently of user progress.

    Attributes:
        name: Trophy display name.
        external_id: Numeric trophy ID scoped to its collection.
        is_hidden: Whether the XML marks the trophy as hidden.
        grade: Lowercase bronze, silver, gold, or platinum grade.
        description: Trophy requirement text.
        icon: Local image path; existence is not guaranteed.
    """

    name: str
    external_id: int
    is_hidden: bool
    grade: str
    description: str
    icon: str

@dataclass
class ImportedGameData:
    """Hold metadata and one profile's progress for a trophy collection.

    Attributes:
        title: Collection title from ``title-name``.
        description: Collection description from ``title-detail``.
        external_id: Collection identifier from ``npcommid``, not a game title ID.
        icon: Path to the collection's ``ICON0.PNG``, not necessarily game artwork.
        achievements: All trophy definitions in game's trophy order.
        unlocked_achievements: Trophy IDs mapped to timezone-aware UTC unlock
            datetimes. IDs correspond to achievement ``external_id`` values.
    """

    title: str
    description: str
    external_id: str
    icon: str
    achievements: list[ImportedTrophyData] = field(default_factory=list)
    unlocked_achievements: dict[int, datetime] = field(default_factory=dict)

class RPCS3Adapter:
    """Import metadata and progress from one RPCS3 trophy directory.

    Reads definitions from ``TROPCONF.SFM`` and delegates binary progress
    decoding to ``RPCS3Parser``. Does not discover other collections, copy
    images, associate database users, or persist imported data.
    """

    def __init__(self) -> None:
        """Create the binary parser used to read user trophy progress."""
        self.parser = RPCS3Parser()

    def _get_text(self, element: ET.Element, tag) -> str:
        """Read tag text from the element.

        Args:
            element: Parent element to search.
            tag: Tag or relative search path accepted by ``Element.find``.

        Returns:
            The matched element's text.

        Raises:
            InvalidGameConfigError: No element matches or its text is None.
        """
        found = element.find(tag)

        if found is None or found.text is None:
            raise InvalidGameConfigError(f"Missing required field: {tag}")

        return found.text

    def _get_id(self, element: ET.Element) -> int:
        """Read trophy id from the element's attribute.

        Args:
            element: Trophy XML element containing the attribute.

        Returns:
            A nonnegative integer id.

        Raises:
            InvalidGameConfigError: The ID is missing, blank, not parseable
                as an integer, or negative.
        """
        value = element.attrib.get("id")

        if value is None or not value.strip():
            raise InvalidGameConfigError("Missing required field: id")

        try:
            trophy_id = int(value)
        except ValueError as exc:
            raise InvalidGameConfigError(
                f"Invalid integer for id: {value!r}"
            ) from exc

        if trophy_id < 0:
            raise InvalidGameConfigError(f"id must be nonnegative: {value!r}")

        return trophy_id

    def _get_grade(self, element: ET.Element)-> str:
        """Map a trophy's case-sensitive ``ttype`` code to its grade name.

        Args:
            element: Trophy XML element with a B, S, G, or P type code.

        Returns:
            The corresponding bronze, silver, gold, or platinum string.

        Raises:
            InvalidGameConfigError: The attribute is missing or blank.
            KeyError: The nonblank code is not in the grade mapping.
        """
        value = element.attrib.get("ttype")

        if value is None or not value.strip():
            raise InvalidGameConfigError("Missing required field: ttype")

        return _ACHIEVEMENT_GRADE[value]

    def get_achievements(self, trophy_folder: str | Path) -> list[ImportedTrophyData]:
        """Load trophy definitions.

        Processes direct ``trophy`` children of ``TROPCONF.SFM`` in document
        order. The ``hidden`` attribute must be exactly ``yes`` or ``no``.

        Args:
            trophy_folder: Directory containing the configuration and icons,

        Returns:
            Trophy definitions.

        Raises:
            FileNotFoundError: The configuration file does not exit in file path.
            OSError: Another filesystem error prevents reading the configuration.
            ET.ParseError: The configuration is not well-formed XML.
            InvalidGameConfigError: Required trophy text is missing, an ID is
                invalid, ``ttype`` is missing or blank, or ``hidden`` is not
                exactly ``yes`` or ``no``.
            KeyError: A nonblank trophy type code is unsupported.
        """
        directory = Path(trophy_folder)
        trophy_config = directory / "TROPCONF.SFM"

        if not trophy_config.is_file():
            raise FileNotFoundError(
                f"Missing trophy configuration file: {trophy_config}"
            )

        tree = ET.parse(trophy_config)
        root = tree.getroot()

        achievements: list[ImportedTrophyData] = []

        for child in root:
            if child.tag != "trophy":
                continue

            hidden = child.attrib.get("hidden")

            if hidden not in ("yes", "no"):
                raise InvalidGameConfigError(
                    f"Invalid or missing hidden attribute: {hidden!r}"
                )

            is_hidden = hidden == "yes"
            trophy_id = self._get_id(child)

            achievements.append(
                ImportedTrophyData(
                    name=self._get_text(element=child, tag="name"),
                    external_id=trophy_id,
                    is_hidden=is_hidden,
                    grade=self._get_grade(child),
                    description=self._get_text(element=child, tag="detail"),
                    icon=str(directory / f"TROP{trophy_id:03d}.PNG"),
                )
            )
        return achievements

    def get_unlocked_achievements(self, tropusr_file: str | Path) -> dict[int, datetime]:
        """Read one profile's unlock timestamps through the binary parser.

        Args:
            tropusr_file: Path to ``TROPUSR.DAT``, not its containing directory.

        Returns:
            Trophy IDs mapped to timezone-aware UTC datetimes. The parser
            includes records with nonzero ``timestamp2`` values; an empty
            dictionary means no records qualified, not that reading failed.

        Raises:
            FileNotFoundError: The progress file is missing. The error message
                includes the supplied path.
            OSError: Another filesystem error prevents reading the file.
            ValueError: The binary parser rejects the file's header or layout.
            OverflowError: A timestamp exceeds Python's datetime range.
        """
        try:
            unlocked = self.parser.get_unlocked_achievements(tropusr_file)
        except FileNotFoundError as exc:
            raise FileNotFoundError(
                f"Missing user's trophy data file: {tropusr_file}"
            ) from exc

        return unlocked

    def get_game_data(self, trophy_folder: str | Path) -> ImportedGameData:
        """Combine collection metadata, trophy definitions, and user progress.

        Reads ``TROPCONF.SFM`` for definitions and collection fields, and
        ``TROPUSR.DAT`` for unlock timestamps. Both files are required.
        The XML is parsed separately for definitions and collection metadata.

        Args:
            trophy_folder: One profile's trophy collection directory containing
                the configuration, progress file, and trophy images.

        Returns:
            An import result with required ``title-name``, ``title-detail``, and
            ``npcommid`` text, all definitions, and the parsed unlock mapping.
           

        Raises:
            FileNotFoundError: A required input file is missing or the
                configuration path is not a file.
            OSError: Another filesystem error prevents reading an input.
            ET.ParseError: The configuration is not well-formed XML.
            InvalidGameConfigError: Required XML text or trophy attributes fail
                validation, including empty collection descriptions.
            KeyError: A nonblank trophy type code is unsupported.
            ValueError: The binary parser rejects the progress file.
            OverflowError: An unlock timestamp exceeds Python's datetime range.
        """
        directory = Path(trophy_folder)
        tropconf_file = directory / "TROPCONF.SFM"
        tropusr_file = directory / "TROPUSR.DAT"


        achievements = self.get_achievements(directory)
        unlocked = self.get_unlocked_achievements(tropusr_file)

        tree = ET.parse(tropconf_file)
        root = tree.getroot()

        return (
            ImportedGameData(
                title=self._get_text(root, "title-name"),
                description=self._get_text(root, "title-detail"),
                external_id=self._get_text(root, "npcommid"),
                icon=str(directory / "ICON0.PNG"),
                achievements=achievements,
                unlocked_achievements=unlocked,
            )
        )
