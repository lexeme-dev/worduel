import React from 'react';
import Tile, { TileVariant } from './Tile';
import './Word.css';
import logo from './logo.svg';
import Table from 'react-bootstrap/Table'


export type WordProps = {
  word: string;
  variants: TileVariant[];
}

function Word(props: WordProps) {
  return (
      <div className="word">
          { props.word.split("").map((letter, idx: number) =>
          <td key={idx}><Tile letter={letter} variant={props.variants[idx]} key={idx} /></td>
          ) }
      </div>
  );
}

export default Word;
