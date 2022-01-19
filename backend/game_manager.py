from random import choices
from threading import Thread
from typing import Dict

from game import Game, WORDS


class GameManager:
    current_games: Dict[str, Game]

    def __init__(self):
        self.current_games = {}

    def create_game(self) -> Game:
        game_id = self.get_game_id()
        new_game = Game(game_id=game_id)
        self.current_games[game_id] = new_game
        return new_game

    def get_game(self, game_id: str) -> Game:
        game_id = game_id.lower()
        if game_id not in self.current_games:
            raise GameNotFoundError()
        return self.current_games[game_id]

    def cleanup_finished_games(self):
        cleanup_list = []
        for game_id, game in self.current_games.items():
            if game.status.utc_finished:
                cleanup_list.append(game_id)
        for game_id in cleanup_list:
            self.current_games.pop(game_id)

    def get_game_id(self) -> str:
        game_id = "-".join(choices(WORDS, k=2))
        if game_id in self.current_games:
            Thread(target=self.cleanup_finished_games).start()
            return self.get_game_id()
        return game_id


class GameNotFoundError(Exception):
    pass
