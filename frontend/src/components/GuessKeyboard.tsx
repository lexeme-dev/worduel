import React from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import "./GuessKeyboard.css";
import {Knowledge, LetterState} from "../services/interfaces";
import {BackspaceFill} from "react-bootstrap-icons";

type LetterVariant = `letter-${'unknown' | 'wrong' | 'present' | 'right'}`
const stateVariantMap: Record<LetterState, LetterVariant> = {
  [LetterState.UNKNOWN]: 'letter-unknown',
  [LetterState.WRONG]: 'letter-wrong',
  [LetterState.PRESENT]: 'letter-present',
  [LetterState.RIGHT]: 'letter-right',
}

interface GuessKeyboardProps {
  currentWord: string;
  knowledge: Knowledge;
  enabled: boolean;
  onChange: (newValue: string) => void;
  onSubmit: () => void;
}

interface GuessKeyboardState {
  currentWord: string;
}

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

class GuessKeyboard extends React.Component<GuessKeyboardProps> {
  componentWillMount() {
    window.addEventListener('keyup', this.handleKeyInput);
  }


  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyInput);
  }

  handleKeyInput = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !this.enterDisabled()) {
      this.props.onSubmit();
    } else if (event.key === "Backspace" && !this.backspaceDisabled()) {
      this.onBackspace();
    } else if (/^[a-zA-z]$/.test(event.key) && !this.lettersDisabled()) {
      this.onKeyPress(event.key);
    }
  }

  onBackspace = () => {
    const newWord = this.props.currentWord.slice(0, -1);
    this.props.onChange(newWord);
  }

  onKeyPress = (key: string) => {
    const newWord = this.props.currentWord + key.toLowerCase();
    this.props.onChange(newWord);
  }

  private backspaceDisabled() {
    return !this.props.enabled || this.props.currentWord.length === 0;
  }

  private lettersDisabled() {
    return !this.props.enabled || this.props.currentWord.length >= 5;
  }

  private enterDisabled() {
    return !this.props.enabled || this.props.currentWord.length < 5;
  }

  render() {
    const disabled = this.lettersDisabled();
    return (
      <div className="guess-keyboard pt-3">
        <Container>
          {KEYBOARD_LAYOUT.map((keys, i) =>
            <Row className="justify-content-md-center" key={i}>
              {keys.map((key, j) => {
                  if (key === "ENTER") {
                    return (
                      <Col className="enter-key" key={j}>
                        <Button onClick={() => this.props.onSubmit()}
                                size="sm"
                                className={this.enterDisabled() ? "key-disabled" : ""}
                        >
                          GUESS
                        </Button>
                      </Col>)
                  } else if (key === "BACKSPACE") {
                    return (
                      <Col className="enter-key" key={j}>
                        <Button
                          size="sm"
                          onClick={() => this.onBackspace()}
                          className={this.backspaceDisabled() ? "key-disabled" : ""}
                        >
                          <BackspaceFill/>
                        </Button>
                      </Col>)
                  } else {
                    return (
                      <Col className="key-col" key={j}>
                        <Button
                          className={`${stateVariantMap[this.props.knowledge[key.toLowerCase()]]} ${disabled ? "key-disabled" : ""}`}
                          onClick={() => this.onKeyPress(key)}
                          size="sm">
                          {key}
                        </Button>
                      </Col>
                    );
                  }
                }
              )}
            </Row>
          )}
          <Row>
          </Row>
        </Container>
      </div>
    );
  }
}

export default GuessKeyboard;
