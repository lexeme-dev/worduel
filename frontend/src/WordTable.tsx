import React, {Component} from 'react';
import Word from './Word';
import './WordTable.css';
import {Container, Row, Form, Button} from 'react-bootstrap';
import {GuessResult, LetterState, MAX_TURNS} from "./services/interfaces";

export type OnGuess = (guess: string) => void;

export type WordTableProps = {
  playerName: string;
  isPlayerOne: boolean;
  guesses: GuessResult[];
  onGuess: OnGuess;
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
    const turnsToAdd = MAX_TURNS - turns.length;
    const guessNumber = turns.length + 1;
    for (let i = 0; i < turnsToAdd; i += 1) {
      turns.push([
        {
          guess_word: "     ",
          letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN],
          opponent: this.props.isPlayerOne
        },
        {
          guess_word: "     ",
          letter_results: [LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN, LetterState.UNKNOWN],
          opponent: !this.props.isPlayerOne
        }
      ])
    }
    turns[guessNumber - 1][this.props.isPlayerOne ? 1 : 0].guess_word = this.state.guess.toUpperCase().padEnd(5, ' ');
    return (
      <Container className="word-table">
        {
          turns.map((guess_pair, idx: number) =>
            <Row className={"mx-auto pt-1 " + (((idx % 2) ? "words-primary" : "words-secondary"))}>
              <div className="guess">
                GUESS {idx + 1}
              </div>
              <Row key={2 * idx}>
                <Word guess={guess_pair[0]} key={idx}/>
              </Row>
              <Row key={2 * idx + 1}>
                <Word guess={guess_pair[1]} key={idx}/>
              </Row>
              {(idx + 1 == guessNumber) ?
                (<Row key={-1}>
                  <Form className="join-form">
                    <Form.Group>
                      <Form.Control className="join-enter" type="text" size="lg" placeholder="guess"
                                    onChange={(e) => this.setState({guess: e.target.value})}/>
                      <div className="d-grid gap-2">
                        <Button variant="primary join-button"
                                onClick={() => {
                                  this.props.onGuess(this.state.guess);
                                }}> GUESS </Button>
                      </div>
                    </Form.Group>
                  </Form>
                </Row>) :
                ""
              }
            </Row>
          )
        }
      </Container>
    );
  }
}

export default WordTable;
