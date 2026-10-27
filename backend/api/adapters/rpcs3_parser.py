from sre_parse import MAGIC
import struct
from pathlib import Path
from datetime import datetime, timedelta, UTC

class RPCS3Parser:
    """Read trophy progress from RPCS3 TROPUSR.DAT binary files.

    Uses big-endian layouts and expects the second table to contain fixed-size
    type-6 records. Records with a nonzero ``timestamp2`` are treated as unlocked;
    the trophy-state field is not used to determine unlock status.
    """

    def __init__(self) -> None:
        """Initialize the expected file signature and binary record layouts."""
        self.MAGIC = 2173654189
        self.HEADER = struct.Struct('>IIII32s')
        self.TABLE_HEADER = struct.Struct('>IIIIQQ')
        self.ENTRY6 = struct.Struct('>IIIIIIIIQQ64s')

    def timestamp_to_datetime(self, microseconds: int) -> datetime:
        """Convert microseconds since January 1, year 1 UTC to a datetime.

        Args:
            microseconds: Unsigned 64-bit integer already decoded from the file,
                not a hexadecimal string or raw bytes.

        Returns:
            A timezone-aware UTC datetime. Zero returns the epoch itself.

        Raises:
            ValueError: The value is outside the unsigned 64-bit range.
            OverflowError: The timestamp exceeds Python's supported datetime
                range, which ends in year 9999.
        """
        if not 0 <= microseconds <= 0xFFFFFFFFFFFFFFFF:
            raise ValueError("Timestamp must be an unsigned 64-bit integer")

        return (
            datetime(1,1,1, tzinfo=UTC)
            + timedelta(microseconds=microseconds)
        )

    def get_unlocked_achievements(self, file):
        """Extract trophy IDs and timestamps from the second TROPUSR table.

        Reads the entire file and checks the signature, table-header bounds,
        second table's type, and record bounds before decoding its entries.
        Records whose ``timestamp2`` is zero are skipped. Records with a 
        nonzero are treated as unlocked trophies. Timestamps are 
        interpreted as microseconds since January 1, year 1 UTC.

        Args:
            file: String or path-like object pointing to a TROPUSR.DAT file.

        Returns:
            A dictionary mapping trophy IDs to timezone-aware UTC datetimes.
            Returns an empty dictionary if all records have zero ``timestamp2``
            values or the table has no records. For duplicate trophy IDs, the
            last record with a nonzero ``timestamp2`` wins.

        Raises:
            OSError: The file cannot be opened or read.
            ValueError: The header is truncated, the signature is incorrect,
                fewer than two tables are declared, the declared table headers
                exceed the file bounds, the second table is not type 6, or its
                offset or records extend beyond the file.
            OverflowError: A nonzero timestamp exceeds Python's supported
                datetime range.
        """
        data = Path(file).read_bytes()

        if len(data) < self.HEADER.size:
            raise ValueError("Trunacated TROPUSR Header")

        magic, unk1, table_count, unk2, _reserved = self.HEADER.unpack_from(buffer=data)

        if magic != self.MAGIC:
            raise ValueError("Corrupted magic")

        if table_count < 2:
            raise ValueError("Missing second table header")

        if table_count > (len(data) - self.HEADER.size) // self.TABLE_HEADER.size:
            raise ValueError("Invalid table count")

        progress: dict[int,datetime] = {}

        entry_type, entries_size, unk1, entries_count, offset, _reserved = self.TABLE_HEADER.unpack_from(
            buffer=data, offset=self.HEADER.size + self.TABLE_HEADER.size
        )

        if entry_type != 0x00000006:
            raise ValueError(f"Wrong Entry: {entry_type}")

        if offset > len(data):
            raise ValueError("Trophy table offset is beyond the end of the file")

        table_end = offset + entries_count * self.ENTRY6.size

        if table_end > len(data):
            raise ValueError("Truncated trophy table: not enough data for all entries")

        for entry in range(entries_count):
            type_6, size, id, unk1, trophy_id, trophy_state, unk4, unk5, timestamp1, timestamp2, _unk6 = self.ENTRY6.unpack_from(
                buffer=data, offset=offset + (entry * self.ENTRY6.size)
            )

            if timestamp2 == 0:
                continue

            progress[trophy_id] = self.timestamp_to_datetime(timestamp2)

        return progress
