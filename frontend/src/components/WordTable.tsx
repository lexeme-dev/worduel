import React from 'react';
import Word from './Word';
import './WordTable.css';
import {Container, Row} from 'react-bootstrap';
import {GuessResult, LetterState, MAX_TURNS} from "../services/interfaces";

export type WordTableProps = {
  playerName: string;
  isPlayerOne: boolean;
  guesses: GuessResult[];
  currentGuess: string;
  opponentSubmittedGuess: boolean;
}

export interface GuessResultDisplay {
  guess_word: string;
  letter_results: LetterState[];
  opponent: boolean;
}

function WordTable(props: WordTableProps) {
  const turns: GuessResultDisplay[][] = props.guesses.map(gr => {
    return {
      guess_word: gr.guess_word,
      letter_results: gr.letter_results,
      opponent: gr.player_name !== props.playerName
    }
  }).reduce(
    (accumulator: GuessResultDisplay[][], currentValue, currentIndex, array) => {
      if (currentIndex % 2 === 0)
        accumulator.push(array.slice(currentIndex, currentIndex + 2));
      return accumulator;
    }, []);
  turns.forEach(turn => turn.sort((a, b) => a.opponent ? 1 : -1))
  const turnsToAdd = MAX_TURNS - turns.length;
  const guessNumber = turns.length + 1;
  for (let i = 0; i < turnsToAdd; i += 1) {
    turns.push([
      {
        guess_word: "     ",
        letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN],
        opponent: false
      },
      {
        guess_word: "     ",
        letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN],
        opponent: true
      }
    ])
  }
  turns[guessNumber - 1][0].guess_word = props.currentGuess.toUpperCase().padEnd(5, ' ');
  return (
    <Container className="word-table">
      {
        turns.map((guess_pair, idx: number) => {
            return <Row className={"mx-auto pt-1 guess-row " + (((idx % 2) ? "words-primary" : "words-secondary"))}>
              <div className="guess pt-1">
                TURN {idx + 1}
              </div>
              <Row className="guess-row" key={2 * idx}>
                <Word guess={guess_pair[0]} key={idx} small={false}/>
              </Row>
              <Row className="guess-row" key={2 * idx + 1}>
                <Word guess={guess_pair[1]} key={idx} small={false}/>
              </Row>
            </Row>;
          }
        )
      }
    </Container>
  );
}

export default WordTable;
