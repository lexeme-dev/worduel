import React, {Component, FormEventHandler} from 'react';
import Word from './Word';
import './WordTable.css';
import {Button, Container, Form, Row} from 'react-bootstrap';
import {GuessResult, LetterState, MAX_TURNS} from "../services/interfaces";
import GuessForm from "./GuessForm";

export type OnGuess = (guess: string) => void;

export type WordTableProps = {
  playerName: string;
  isPlayerOne: boolean;
  guesses: GuessResult[];
  onGuess: OnGuess;
  opponentSubmittedGuess: boolean;
  showInput: boolean;
}

export type WordTableState = {
  guess: string;
}

export interface GuessResultDisplay {
  guess_word: string;
  letter_results: LetterState[];
  opponent: boolean;
}

class WordTable extends Component<WordTableProps, WordTableState> {
  constructor(props: WordTableProps) {
    super(props);
    this.state = {guess: ""};
  }

  componentDidUpdate(prevProps: Readonly<WordTableProps>, prevState: Readonly<WordTableState>) {
    if (prevProps.guesses.length != this.props.guesses.length) {
      this.setState({guess: ""});
    }
  }

  render() {
    const turns: GuessResultDisplay[][] = this.props.guesses.map(gr => {
      return {
        guess_word: gr.guess_word,
        letter_results: gr.letter_results,
        opponent: gr.player_name !== this.props.playerName
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
    turns[guessNumber - 1][0].guess_word = this.state.guess.toUpperCase().padEnd(5, ' ');
    return (
      <Container className="word-table">
        {
          turns.map((guess_pair, idx: number) => {
              const isCurrentTurn = idx + 1 === guessNumber;
              const opponentGuess = guess_pair[0].opponent ? guess_pair[0] : guess_pair[1];
              return <Row className={"mx-auto pt-1 guess-row " + (((idx % 2) ? "words-primary" : "words-secondary"))}>
                <div className="guess pt-1">
                  TURN {idx + 1}
                </div>
                <Row className="guess-row" key={2 * idx}>
                  <Word guess={guess_pair[0]} key={idx}/>
                </Row>
                <Row className="guess-row" key={2 * idx + 1}>
                  <Word guess={guess_pair[1]} key={idx}/>
                </Row>
                {isCurrentTurn && this.props.showInput &&
                  <GuessForm key={-1} onSubmit={(e) => {
                    e.preventDefault();
                    this.props.onGuess(this.state.guess);
                  }} onChange={(e) =>
                    this.setState({guess: e.target.value})}/>
                }
              </Row>;
            }
          )
        }
      </Container>
    );
  }
}

export default WordTable;