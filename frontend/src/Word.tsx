import React from 'react';
import Tile, { TileVariant } from './Tile';
import './Word.css';
import logo from './logo.svg';
import Table from 'react-bootstrap/Table'


export type WordProps = {
  word: string
  variants: TileVariant[]
}

function Word(props: WordProps) {
  return (
    <Table>
      <thead></thead>
      <tbody>
        <tr>
          { props.word.split("").map((letter, idx: number) =>
            <td key={idx}><Tile letter={letter} variant={props.variants[idx]} key={idx} /></td>
          ) }
        </tr>
      </tbody>
    </Table>
  );
}

export default Word;
