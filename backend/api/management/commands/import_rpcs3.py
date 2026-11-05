from dataclasses import asdict
import json
from pathlib import Path

from django.core.management.base import BaseCommand

from api.services.rpcs3_parser import RPCS3Parser


class Command(BaseCommand):
    help = "Decodes rpcs3 trophy data files into readable data"

    def add_arguments(self, parser):
        parser.add_argument(
            "trophy_folder",
            type=Path,
            help="Folder of game's trophy data"
        )

        parser.add_argument(
            "--destination",
            type=Path,
            help="file destination for rpcs3 trophy data json file"
        )

    def handle(self, *args, **options):
        game_path = options["trophy_folder"]

        data = RPCS3Parser().get_game_data(game_path)

        file_path = Path(data.title + ".json")

        if options["destination"]:
            file_path = options["destination"] / file_path

        with open(file_path, 'w') as f:
            json.dump(asdict(data), f, indent=2, default=str)
