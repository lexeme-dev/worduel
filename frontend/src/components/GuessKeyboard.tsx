import React from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import "./GuessKeyboard.css";
import {Knowledge, Letter, LetterState} from "../services/interfaces";
import {BackspaceFill} from "react-bootstrap-icons";

type LetterVariant = `letter-${'unknown' | 'wrong' | 'present' | 'right'}`
const stateVariantMap: Record<LetterState, LetterVariant> = {
  [LetterState.UNKNOWN]: 'letter-unknown',
  [LetterState.WRONG]: 'letter-wrong',
  [LetterState.PRESENT]: 'letter-present',
  [LetterState.RIGHT]: 'letter-right',
}

interface GuessKeyboardProps {
  knowledge: Knowledge;
  onChange: (newValue: string) => void;
  onSubmit: () => void;
}

function GuessKeyboard(props: GuessKeyboardProps) {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ]
  return (
    <div className="guess-keyboard pt-3">
      <Container>
        {keyboardLayout.map((keys, i) =>
          <Row className="justify-content-md-center" key={i}>
            {keys.map((key, j) => {
                if (key === "ENTER") {
                  return (
                    <Col className="enter-key" key={j}>
                      <Button className={stateVariantMap[props.knowledge[key.toLowerCase()]]} size="sm">
                        GUESS
                      </Button>
                    </Col>)
                } else if (key === "BACKSPACE") {
                  return (
                    <Col className="enter-key" key={j}>
                    <Button className={stateVariantMap[props.knowledge[key.toLowerCase()]]} size="sm">
                      <BackspaceFill />
                    </Button>
                  </Col>)
                } else {
                  return (
                    <Col className="key-col" key={j}>
                      <Button className={stateVariantMap[props.knowledge[key.toLowerCase()]]} size="sm">
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
