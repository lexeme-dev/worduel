from random import choices
from threading import Thread
from typing import Dict

from game import Game, WORDS


class GameManager:
    current_games: Dict[str, Game]

    def __init__(self):
        self.current_games = {}

    def create_game(self) -> Game:
        join_code = self.get_join_code()
        new_game = Game(join_code=join_code)
        self.current_games[join_code] = new_game
        return new_game

    def get_game(self, join_code: str) -> Game:
        if join_code not in self.current_games:
            raise GameNotFoundError()
        return self.current_games[join_code]

    def cleanup_finished_games(self):
        cleanup_list = []
        for join_code, game in self.current_games.items():
            if game.utc_finished:
                cleanup_list.append(join_code)
        for join_code in cleanup_list:
            self.current_games.pop(join_code)

    def get_join_code(self) -> str:
        code = "-".join(choices(WORDS, k=2))
        if code in self.current_games:
            Thread(target=self.cleanup_finished_games).start()
            return self.get_join_code()
        return code


class GameNotFoundError(Exception):
    pass
