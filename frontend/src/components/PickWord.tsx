import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.css';
import './PickWord.css';
import {GameBasicInfo, LetterState} from '../services/interfaces';
import {GuessResultDisplay} from './WordTable';
import Word from './Word';

export type OnWordPicked = (word: string) => void;

export type PickWordProps = {
  onWordPicked: OnWordPicked;
}

export type PickWordState = {
  word: string;
}

class PickWord extends Component<PickWordProps, PickWordState> {
  constructor(props: PickWordProps) {
    super(props);
    this.state = {
      word: "     "
    };
  }

  render() {
    const guess : GuessResultDisplay = {
        "guess_word": this.state.word.toUpperCase().padEnd(5, ' '),
        "letter_results": [
          LetterState.UNKNOWN,
          LetterState.UNKNOWN,
          LetterState.UNKNOWN,
          LetterState.UNKNOWN,
          LetterState.UNKNOWN
        ],
        "opponent": false
    };

    return (
      <div className="pick-word-wrapper">
        <Word guess={guess} small={true}/>
        <Form className="join-form" onSubmit={(e) => { e.preventDefault(); this.props.onWordPicked(this.state.word)} }>
          <Form.Group className="mb-3">
            <Form.Control className="join-enter" type="text" size="lg" placeholder="Pick your secret word"
                          onChange={(e) => this.setState({word: e.target.value})}/>
            <div className="d-grid gap-2">
              <Button type="submit" variant="primary join-button" size="lg">
                ENTER SECRET WORD
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default PickWord;
