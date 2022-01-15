from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Dict, List
from uuid import uuid4

import orjson

from backend.helpers import get_full_path

MAX_GUESSES = 10
WORDS = orjson.loads(open(get_full_path('data/words.json')).read())
WORD_SET = set(WORDS)


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
    player: Player
    guess_word: str


@dataclass
class GuessResult:
    guess_word: str
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
        self.knowledge = {chr(num): LetterState.UNKNOWN for num in range(ord('a'), ord('z') + 1)}
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
        for i, c in enumerate(guess.guess_word):
            res: LetterState
            if self.word[i] == c:
                res = LetterState.RIGHT
            elif c in self.word:
                res = LetterState.PRESENT
            else:
                res = LetterState.WRONG
            letter_results.append(res)
        if self.word == guess.guess_word:
            self.solved = True
        return GuessResult(guess_word=guess.guess_word, letter_results=letter_results, player_name=guess.player.name)


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
    join_code: str
    player_names: List[str]
    utc_started: int | None
    utc_finished: int | None


@dataclass
class Game:
    join_code: str

    p1: Player | None
    p2: Player | None

    word1: Word | None
    word2: Word | None

    utc_started: int | None
    utc_finished: int | None

    def __init__(self, join_code):
        self.join_code = join_code
        self.p1 = None
        self.p2 = None
        self.word1 = None
        self.word2 = None
        self.utc_started = None
        self.utc_finished = None

    def get_basic_info(self) -> GameBasicInfo:
        return GameBasicInfo(
            player_names=[p.name for p in (self.p1, self.p2) if p is not None],
            utc_started=self.utc_started,
            utc_finished=self.utc_finished,
            join_code=self.join_code
        )

    def add_player(self, name: str, word: str) -> Player:
        if self.p1 and self.p2:
            raise GameFullError()
        if not name:
            raise InvalidNameError()
        if word not in WORD_SET:
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
            self.utc_started = int(datetime.now().timestamp())
        return player

    def make_guess(self, guess_word: str, player_secret: str) -> bool:
        player = self.get_player(player_secret)
        guess = Guess(guess_word=guess_word, player=player)
        if not self.__validate_guess(guess):
            return False
        for word in (self.word1, self.word2):
            word.apply_guess(guess)
        if self.word1.solved or self.word2.solved:
            self.utc_finished = int(datetime.now().timestamp())
        return True

    def __validate_guess(self, guess: Guess) -> bool:
        if guess.player != self.__get_player_with_current_turn():
            raise NotPlayerTurnError()
        guess_valid = isinstance(guess.guess_word, str) and guess.guess_word in WORD_SET
        return guess_valid

    def get_client_state(self, player_secret: str) -> ClientState:
        end_state = self.__get_end_state()
        curr_turn_player = self.__get_player_with_current_turn()
        player = self.get_player(player_secret)
        if player == self.p1:
            return ClientState(player=self.p1, word=self.word1.word,
                               opponent_solve_state=self.word1.cumulative_solve_state,
                               letter_knowledge=self.word2.knowledge, guesses=self.word2.guesses,
                               end_state=end_state, currently_turn=self.p1 == curr_turn_player)
        else:
            return ClientState(player=self.p2, word=self.word2.word,
                               opponent_solve_state=self.word2.cumulative_solve_state,
                               letter_knowledge=self.word1.knowledge, guesses=self.word1.guesses,
                               end_state=end_state, currently_turn=self.p2 == curr_turn_player)

    def __get_end_state(self) -> EndState | None:
        if not self.word1.solved and not self.word2.solved:
            if len(self.word1.guesses) == MAX_GUESSES:
                return EndState(tie=True, winner_name=None)
            return None
        winner = self.p1 if self.word2.solved else self.p2
        return EndState(tie=False, winner_name=winner.name)

    def __get_player_with_current_turn(self) -> Player:
        if len(self.word1.guesses) % 2 == 0:
            return self.p1
        return self.p2

    def get_player(self, player_secret: str) -> Player:
        if self.p1.secret_id == player_secret:
            return self.p1
        elif self.p2.secret_id == player_secret:
            return self.p2
        raise PlayerNotFoundError()


class GameFullError(Exception):
    pass


class PlayerNameTakenError(Exception):
    pass


class PlayerNotFoundError(Exception):
    pass


class NotPlayerTurnError(Exception):
    pass


class InvalidNameError(Exception):
    pass


class InvalidWordError(Exception):
    pass
