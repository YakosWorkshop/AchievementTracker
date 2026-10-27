import json
from dataclasses import asdict
from pathlib import Path

from django.test import SimpleTestCase

from api.adapters.rpcs3 import ImportedGameData, RPCS3Adapter
from api.adapters.rpcs3_parser import RPCS3Parser


class RPCS3ParserTestCase(SimpleTestCase):
    def test_get_unlocked_achievements_returns_one_item(self):
        parser = RPCS3Parser()
        file_path = (
            "/home/jacobv/.config/rpcs3/dev_hdd0/home/00000001/trophy/NPWR00900_00/TROPUSR.DAT"
        )

        result = parser.get_unlocked_achievements(file_path)
        print(f"Unlocked achievements: {result}")

        self.assertIsInstance(result, dict)


class RPCS3AdapterTestCase(SimpleTestCase):
    def test_get_game_data_exports_json(self):
        trophy_directory = Path(
            "/home/jacobv/.config/rpcs3/dev_hdd0/home/00000001/"
            "trophy/NPWR00900_00"
        )
        result = RPCS3Adapter().get_game_data(trophy_directory)

        self.assertIsInstance(result, ImportedGameData)
        self.assertTrue(result.title)
        self.assertTrue(result.achievements)
        self.assertIsInstance(result.unlocked_achievements, dict)

        payload = asdict(result)
        payload["unlocked_achievements"] = {
            str(trophy_id): timestamp.isoformat()
            for trophy_id, timestamp in result.unlocked_achievements.items()
        }
        output_path = (
            Path(__file__).resolve().parent.parent / "NPWR00900_00_import.json"
        )
        output_path.write_text(
            json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        self.assertEqual(
            json.loads(output_path.read_text(encoding="utf-8")), payload
        )
        print(f"Imported game data saved to: {output_path}")
