import React from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import "./GuessKeyboard.css";
import {Knowledge, Letter, LetterState} from "../services/interfaces";

type LetterVariant = `letter-${'unknown' | 'wrong' | 'present' | 'right'}`
const stateVariantMap: Record<LetterState, LetterVariant> = {
  [LetterState.UNKNOWN]: 'letter-unknown',
  [LetterState.WRONG]: 'letter-wrong',
  [LetterState.PRESENT]: 'letter-present',
  [LetterState.RIGHT]: 'letter-right',
}

interface GuessKeyboardProps {
  knowledge: Knowledge;
}

function GuessKeyboard(props: GuessKeyboardProps) {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ]
  return (
    <div className="guess-keyboard pt-3">
      <Container>
        {keyboardLayout.map((keys, i) =>
          <Row className="justify-content-md-center" key={i}>
            {keys.map((key, j) =>
              <Col className="key-col" key={j}>
                <Button className={stateVariantMap[props.knowledge[key.toLowerCase()]] } size="sm">
                  {key}
                </Button>
              </Col>
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
