export const MAX_TURNS = 5;

export interface ClientState {
    player: Player;
    word: string;

    letter_knowledge: Knowledge;
    guesses: GuessResult[];
    opponent_solve_state: SolveState;

    opponent_submitted_guess: boolean;
    end_state?: EndState;
}

export interface GameBasicInfo {
    game_id: string;
    status: GameStatus;
    player_names: string[];
}

export interface GameStatus {
    utc_ready?: number;
    utc_started?: number;
    utc_finished?: number;
}

export interface Player {
    name: string;
    secret_id: string;
    pending_guess?: Guess;
}

export interface Guess {
    guess_word: string;
    player_name: string;
}

export interface GuessResult {
    guess_word: string
    player_name: string;
    letter_results: SolveState;
}

export type EndState = {
    tie: true;
    winner_name: undefined;
} | {
    tie: false;
    winner_name: string;
}

export type Knowledge = Record<string, LetterState>;
export type SolveState = LetterState[];

export enum LetterState {
    UNKNOWN = 0,
    WRONG = 1,
    PRESENT = 2,
    RIGHT = 3
}

export type Letter =
    'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z';
