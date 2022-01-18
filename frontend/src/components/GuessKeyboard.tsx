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

function GuessKeyboard(props: GuessKeyboardProps) {

  const onBackspace = () => {
    const newWord = props.currentWord.slice(0, -1);
    props.onChange(newWord);
  }

  const onKeyPress = (key: string) => {
    const newWord = props.currentWord + key.toLowerCase();
    props.onChange(newWord);
  }

  const disabled = !props.enabled || props.currentWord.length >= 5;
  return (
    <div className="guess-keyboard pt-3">
      <Container>
        {KEYBOARD_LAYOUT.map((keys, i) =>
          <Row className="justify-content-md-center" key={i}>
            {keys.map((key, j) => {
                if (key === "ENTER") {
                  return (
                    <Col className="enter-key" key={j}>
                      <Button onClick={() => props.onSubmit()}
                              size="sm"
                              className={!props.enabled || props.currentWord.length < 5 ? "key-disabled" : ""}
                      >
                        GUESS
                      </Button>
                    </Col>)
                } else if (key === "BACKSPACE") {
                  return (
                    <Col className="enter-key" key={j}>
                      <Button
                        size="sm"
                        onClick={() => onBackspace()}
                        className={!props.enabled || props.currentWord.length === 0 ? "key-disabled" : ""}
                      >
                        <BackspaceFill/>
                      </Button>
                    </Col>)
                } else {
                  return (
                    <Col className="key-col" key={j}>
                      <Button
                        className={`${stateVariantMap[props.knowledge[key.toLowerCase()]]} ${disabled ? "key-disabled" : ""}`}
                        onClick={() => onKeyPress(key)}
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

export default GuessKeyboard;
