import React from 'react';
import Tile from './Tile';
import './Word.css';
import {GuessResultDisplay} from "./WordTable";


export type WordProps = {
  guess: GuessResultDisplay;
}

function Word(props: WordProps) {
  return (
    <table>
      <tr className="word">
          { props.guess.letter_results.map((state, idx: number) =>
          <td key={idx}><Tile letter={props.guess.guess_word[idx]} letterState={state} key={idx} opponent={props.guess.opponent}/></td>
          ) }
      </tr>
    </table>
  );
}

export default Word;
