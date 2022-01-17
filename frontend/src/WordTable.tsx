import React from 'react';
import Word  from './Word';
import './WordTable.css';
import { Container, Row, Col } from 'react-bootstrap';
import { PersonFill, Person } from 'react-bootstrap-icons';
import {Guess, GuessResult} from "./services/interfaces";


export type WordTableProps = {
  guesses: GuessResult[];
}

function WordTable(props: WordTableProps) {
  return (
    <Container className="word-table">
      {
        props.guesses
        .reduce(
           (accumulator: GuessResult[][], currentValue, currentIndex, array) => {
            if (currentIndex % 2 === 0)
              accumulator.push(array.slice(currentIndex, currentIndex + 2));
            return accumulator;
          }, [])
        .map((guess_pair: GuessResult[], idx: number) =>
          <Row className={((idx % 2) ? "words-primary" : "words-secondary")}>
            <div className="guess">
              GUESS { idx + 1 }
            </div>
            <Row key={2*idx}>
              <Word guess={guess_pair[0]} key={idx} />
              <Person className="align-middle" size={30}/>
            </Row>
            <Row className="p-2" key={2*idx + 1}>
              <Word guess={guess_pair[1]} key={idx}/>
              <PersonFill size={30}/>
            </Row>
          </Row>
        )
      }
    </Container>
  );
}

export default WordTable;
