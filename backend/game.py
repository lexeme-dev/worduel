from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Dict, List
from uuid import uuid4

import orjson

from helpers import get_full_path

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
    guess_word: str
    player_name: str


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
            # The enum values represent ascending amounts of knowledge, so we can update the state with max()
            self.knowledge[guess.guess_word[i]] = max(self.knowledge[guess.guess_word[i]], letter_result)

        converse_results = Word._get_letter_matches(guess.guess_word, self.word)
        for i, letter_state in enumerate(converse_results):
            if letter_state == LetterState.WRONG:
                continue
            self.cumulative_solve_state[i] = max(self.cumulative_solve_state[i], letter_state)

    @staticmethod
    def _get_letter_matches(word_str: str, guess_str: str):
        letter_results = [LetterState.WRONG] * 5
        count_dict = {}
        for w in word_str:
            count_dict[w] = count_dict.get(w, 0) + 1
        for i, c in enumerate(guess_str):
            if word_str[i] == c:
                letter_results[i] = LetterState.RIGHT
                count_dict[c] -= 1
        for i, c in enumerate(guess_str):
            if letter_results[i] == LetterState.RIGHT:
                continue
            if count_dict.get(c, 0):
                letter_results[i] = LetterState.PRESENT
                count_dict[c] -= 1
        return letter_results

    def __get_guess_result(self, guess: Guess) -> GuessResult:
        letter_results = Word._get_letter_matches(self.word, guess.guess_word)
        if self.word == guess.guess_word:
            self.solved = True
        return GuessResult(guess_word=guess.guess_word, letter_results=letter_results, player_name=guess.player_name)


@dataclass
class Player:
    name: str
    secret_id: str  # Do not expose this to the other client, it's the only auth we have
    pending_guess: Guess | None


@dataclass
class ClientState:
    player: Player
    word: str

    letter_knowledge: Knowledge
    guesses: List[GuessResult]
    opponent_solve_state: SolveState  # What the opponent knows of the player's word

    opponent_submitted_guess: bool
    end_state: EndState | None


@dataclass
class EndState:
    tie: bool
    winner_name: str | None


@dataclass
class GameBasicInfo:
    game_id: str
    status: GameStatus
    player_names: List[str]


@dataclass
class GameStatus:
    utc_ready: int | None
    utc_started: int | None
    utc_finished: int | None


@dataclass
class Game:
    game_id: str

    p1: Player | None
    p2: Player | None

    word1: Word | None
    word2: Word | None

    status: GameStatus

    def __init__(self, game_id):
        self.game_id = game_id
        self.p1 = None
        self.p2 = None
        self.word1 = None
        self.word2 = None
        self.status = GameStatus(utc_ready=None, utc_started=None, utc_finished=None)

    def get_basic_info(self) -> GameBasicInfo:
        return GameBasicInfo(
            player_names=[p.name for p in (self.p1, self.p2) if p is not None],
            status=self.status,
            game_id=self.game_id
        )

    def add_player(self, name: str) -> Player:
        if self.p1 and self.p2:
            raise GameFullError()
        if not isinstance(name, str) or len(name) > 10:
            raise InvalidNameError()
        player = Player(name=name, secret_id=uuid4().hex, pending_guess=None)
        if self.p1 is None:
            self.p1 = player
        elif self.p2 is None:
            if self.p1.name == player.name:
                raise PlayerNameTakenError()
            # TODO: Handle duplicate word selection (if we want to)
            self.p2 = player
            self.status.utc_ready = int(datetime.now().timestamp())
        return player

    def select_word(self, word: str, player_secret: str):
        if word not in WORD_SET:
            raise InvalidWordError()
        word = Word(word=word)
        if self.get_player(player_secret) == self.p1 and self.word1 is None:
            self.word1 = word
        elif self.get_player(player_secret) == self.p2 and self.word2 is None:
            self.word2 = word
        if self.word1 and self.word2:
            self.status.utc_started = int(datetime.now().timestamp())

    def make_guess(self, guess_word: str, player_secret: str) -> bool:
        player = self.get_player(player_secret)
        guess = Guess(guess_word=guess_word, player_name=player.name)
        if not self.__validate_guess(guess):
            return False
        player.pending_guess = guess
        if self.p1.pending_guess and self.p2.pending_guess:
            self.apply_pending_guesses()
        return True

    def apply_pending_guesses(self):
        for player in (self.p1, self.p2):
            for word in (self.word1, self.word2):
                word.apply_guess(player.pending_guess)
            player.pending_guess = None
        if self.word1.solved or self.word2.solved:
            self.status.utc_finished = int(datetime.now().timestamp())

    def get_player(self, player_secret: str) -> Player:
        if self.p1 and self.p1.secret_id == player_secret:
            return self.p1
        elif self.p2 and self.p2.secret_id == player_secret:
            return self.p2
        raise PlayerNotFoundError()

    def __validate_guess(self, guess: Guess) -> bool:
        if self.status.utc_finished is not None:
            raise GameOverError()
        guess_valid = isinstance(guess.guess_word, str) and guess.guess_word in WORD_SET
        return guess_valid

    def get_client_state(self, player_secret: str) -> ClientState:
        end_state = self.__get_end_state()
        player = self.get_player(player_secret)
        if player == self.p1:
            return ClientState(player=self.p1, word=self.word1.word,
                               opponent_solve_state=self.word1.cumulative_solve_state,
                               letter_knowledge=self.word2.knowledge, guesses=self.word2.guesses,
                               end_state=end_state, opponent_submitted_guess=(self.p2.pending_guess is not None))
        else:
            return ClientState(player=self.p2, word=self.word2.word,
                               opponent_solve_state=self.word2.cumulative_solve_state,
                               letter_knowledge=self.word1.knowledge, guesses=self.word1.guesses,
                               end_state=end_state, opponent_submitted_guess=(self.p1.pending_guess is not None))

    def __get_end_state(self) -> EndState | None:
        if self.word1.solved == self.word2.solved:
            if len(self.word1.guesses) == MAX_GUESSES or self.word1.solved:
                return EndState(tie=True, winner_name=None)
            return None
        winner = self.p1 if self.word2.solved else self.p2
        return EndState(tie=False, winner_name=winner.name)


class GameFullError(Exception):
    pass


class GameOverError(Exception):
    pass


class PlayerNameTakenError(Exception):
    pass


class PlayerNotFoundError(Exception):
    pass


class InvalidNameError(Exception):
    pass


class InvalidWordError(Exception):
    pass
