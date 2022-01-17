import React from 'react';
import Word from './Word';
import './WordTable.css';
import {Container, Row} from 'react-bootstrap';
import {GuessResult, LetterState, MAX_TURNS} from "./services/interfaces";


export type WordTableProps = {
  playerName: string;
  isPlayerOne: boolean;
  guesses: GuessResult[];
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
  const turnsToAdd = MAX_TURNS - turns.length;
  for (let i = 0; i < turnsToAdd; i += 1) {
    turns.push([
      {
        guess_word: "     ",
        letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN],
        opponent: props.isPlayerOne
      },
      {
        guess_word: "     ",
        letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN],
        opponent: !props.isPlayerOne
      }
    ])
  }
  return (
    <Container className="word-table">
      {
          turns.map((guess_pair, idx: number) =>
            <Row className={"pt-1 " + (((idx % 2) ? "words-primary" : "words-secondary"))}>
              <div className="guess">
                GUESS {idx + 1}
              </div>
              <Row key={2 * idx}>
                <Word guess={guess_pair[0]} key={idx} />
              </Row>
              <Row key={2 * idx + 1}>
                <Word guess={guess_pair[1]} key={idx} />
              </Row>
            </Row>
          )
      }
    </Container>
  );
}

export default WordTable;
