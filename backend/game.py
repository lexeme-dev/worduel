from __future__ import annotations
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List
from uuid import uuid4

import orjson

MAX_GUESSES = 10
WORDS = set(orjson.loads(open('data/words.json').read()))


class LetterState(int, Enum):
    UNKNOWN = 0
    WRONG = 1
    PRESENT = 2
    RIGHT = 3


# Helper types for readability on annotations
letter = str
Knowledge = Dict[letter, LetterState]
SolveState = List[LetterState]


@dataclass
class Guess:
    player_secret: str
    guess: str


@dataclass
class GuessResult:
    guess: Guess
    player_name: str
    letter_results: SolveState


@dataclass
class Word:
    word: str
    knowledge: Knowledge
    cumulative_solve_state: SolveState
    solved: bool
    guesses: List[GuessResult]

    def __init__(self, word: str):
        self.word = word
        self.knowledge = {}
        self.cumulative_solve_state = [LetterState.UNKNOWN for _ in self.word]
        self.guesses = []
        self.solved = False

    def apply_guess(self, guess: Guess):
        guess_result = self.__get_guess_result(guess)
        self.guesses.append(guess_result)
        for i, letter_result in enumerate(guess_result.letter_results):
            curr_letter = self.word[i]
            # The enum values represent ascending amounts of knowledge, so we can update the state with max()
            self.knowledge[curr_letter] = max(self.knowledge[curr_letter], letter_result)
            self.cumulative_solve_state[i] = max(self.cumulative_solve_state[i], letter_result)

    def __get_guess_result(self, guess: Guess) -> GuessResult:
        letter_results = []
        for i, c in enumerate(guess.guess):
            res: LetterState
            if self.word[i] == guess:
                res = LetterState.RIGHT
            elif c in self.word:
                res = LetterState.PRESENT
            else:
                res = LetterState.WRONG
            letter_results.append(res)
        if self.word == guess:
            self.solved = True
        return GuessResult(guess=guess, letter_results=letter_results)


@dataclass
class Player:
    name: str
    secret_id: str  # Do not expose this to the other client, it's the only auth we have


@dataclass
class ClientState:
    player: Player
    word: str

    letter_knowledge: Knowledge
    guesses: List[GuessResult]
    opponent_solve_state: SolveState  # What the opponent knows of the player's word

    currently_turn: bool
    end_state: EndState | None


@dataclass
class EndState:
    tie: bool
    winner_name: str | None


@dataclass
class GameBasicInfo:
    player_names: List[str]


@dataclass
class Game:
    p1: Player
    p2: Player

    word1: Word
    word2: Word

    def __init__(self):
        pass

    def get_basic_info(self) -> GameBasicInfo:
        return GameBasicInfo(player_names=[p.name for p in (self.p1, self.p2) if p is not None])

    def add_player(self, name: str, word: str) -> ClientState:
        if self.p1 and self.p2:
            raise GameFullError()
        if word not in WORDS:
            raise InvalidWordError()
        player = Player(name=name, secret_id=uuid4().hex)
        word = Word(word=word)
        if self.p1 is None:
            self.p1 = player
            self.word1 = word
        elif self.p2 is None:
            if self.p1.name == player.name:
                raise PlayerNameTakenError()
            # TODO: Handle duplicate word selection (if we want to)
            self.p2 = player
            self.word2 = word
        return self.get_client_state(player.secret_id)

    def make_guess(self, guess: Guess) -> bool:
        if not self.validate_guess(guess):
            return False
        for word in (self.word1, self.word2):
            word.apply_guess(guess)
        return True

    def validate_guess(self, guess: Guess) -> bool:
        if guess.player_secret not in (self.p1.secret_id, self.p2.secret_id):
            raise PlayerNotFoundError()
        guess_valid = isinstance(guess, str) and len(guess) == 5 and all(ord('a') <= ord(c) <= ord('z') for c in guess)
        return guess_valid

    def get_client_state(self, player_secret: str) -> ClientState:
        end_state = self.get_end_state()
        curr_turn_player = self.get_player_with_current_turn()
        if player_secret == self.p1.secret_id:
            return ClientState(player=self.p1, word=self.word1.word,
                               opponent_solve_state=self.word1.cumulative_solve_state,
                               letter_knowledge=self.word2.knowledge, guesses=self.word2.guesses,
                               end_state=end_state, currently_turn=self.p1 == curr_turn_player)
        elif player_secret == self.p2.secret_id:
            return ClientState(player=self.p2, word=self.word2.word,
                               opponent_solve_state=self.word2.cumulative_solve_state,
                               letter_knowledge=self.word1.knowledge, guesses=self.word1.guesses,
                               end_state=end_state, currently_turn=self.p2 == curr_turn_player)
        raise PlayerNotFoundError()

    def get_end_state(self) -> EndState | None:
        if not self.word1.solved and not self.word2.solved:
            if len(self.word1.guesses) == MAX_GUESSES:
                return EndState(tie=True, winner_name=None)
            return None
        winner = self.p1 if self.word2.solved else self.p2
        return EndState(tie=False, winner_name=winner.name)

    def get_player_with_current_turn(self) -> Player:
        if len(self.word1.guesses) == 0 or self.word1.guesses[-1].player_name == self.p1.name:
            return self.p1
        return self.p2


class GameFullError(Exception):
    pass


class PlayerNameTakenError(Exception):
    pass


class PlayerNotFoundError(Exception):
    pass


class NotPlayerTurnError(Exception):
    pass


class InvalidWordError(Exception):
    pass
