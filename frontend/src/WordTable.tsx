import React from 'react';
import Tile, { TileVariant } from './Tile';
import logo from './logo.svg';
import Word  from './Word';
import './WordTable.css';
import Table from 'react-bootstrap/Table';
import { Container, Row, Col } from 'react-bootstrap';
import { PersonCircle, Person } from 'react-bootstrap-icons';


export type WordTableProps = {
  words: string[]
  words_variants: TileVariant[][]
}

function WordTable(props: WordTableProps) {
  return (
    <Container className="word-table">
      {
        props.words
        .reduce(
           (accumulator: string[][], currentValue, currentIndex, array) => {
            if (currentIndex % 2 === 0)
              accumulator.push(array.slice(currentIndex, currentIndex + 2));
            return accumulator;
          }, [])
        .map((word_pair: string[], idx: number) =>
          <Row className={((idx % 2) ? "words-primary" : "words-secondary")}>
            <div className="guess">
              GUESS { idx + 1 }
            </div>
            <Row key={2*idx}>
              <Word word={word_pair[0]} variants={props.words_variants[idx]} key={idx} />
              <Person size={30}/>
            </Row>
            <Row className="p-2" key={2*idx + 1}>
              <Word word={word_pair[1]} variants={props.words_variants[idx]} key={idx}/>
              <PersonCircle size={30}/>
            </Row>
          </Row>
        )
      }
    </Container>
  );
}

export default WordTable;
