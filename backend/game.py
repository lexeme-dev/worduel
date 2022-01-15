from __future__ import annotations
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List
from uuid import uuid4


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
    correct: bool
    letter_results: SolveState


@dataclass
class Word:
    word: str
    knowledge: Knowledge
    cumulative_solve_state: SolveState
    guesses: List[GuessResult]

    def __init__(self, word: str):
        self.word = word
        self.knowledge = {}
        self.cumulative_solve_state = [LetterState.UNKNOWN for _ in self.word]
        self.guesses = []

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
        correct = self.word == guess
        return GuessResult(guess=guess, letter_results=letter_results, correct=correct)


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


@dataclass
class Game:
    p1: Player
    p2: Player

    word1: Word
    word2: Word

    def __init__(self):
        pass

    def add_player(self, name: str) -> ClientState:
        if self.p1 and self.p2:
            raise GameFullError()
        player = Player(name=name, secret_id=uuid4().hex)
        if self.p1 is None:
            self.p1 = player
        elif self.p2 is None:
            if self.p1.name == player.name:
                raise PlayerNameTakenError()
            self.p2 = player
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
        if player_secret == self.p1.secret_id:
            return ClientState(player=self.p2, word=self.word1.word, opponent_solve_state=self.word1.cumulative_solve_state,
                               letter_knowledge=self.word2.knowledge, guesses=self.word2.guesses)
        elif player_secret == self.p2.secret_id:
            return ClientState(player=self.p2, word=self.word2.word, opponent_solve_state=self.word2.cumulative_solve_state,
                               letter_knowledge=self.word1.knowledge, guesses=self.word1.guesses)
        raise PlayerNotFoundError()


class GameFullError(Exception):
    pass


class PlayerNameTakenError(Exception):
    pass


class PlayerNotFoundError(Exception):
    pass
