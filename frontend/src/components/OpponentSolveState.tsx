
import React, {Fragment} from 'react';
import {GuessResultDisplay} from "./WordTable";
import {SolveState} from "../services/interfaces";
import Word from "./Word";
import './OpponentSolveState.css';


export type OpponentSolveStateProps = {
  word: string;
  opponentSolveState: SolveState;
}

function OpponentSolveState(props: OpponentSolveStateProps) {
  const displayState: GuessResultDisplay = {
    guess_word: props.word,
    letter_results: props.opponentSolveState,
    opponent: true,
  }
  return (
    <div className="opponent-progress-container">
      <div className="opponent-progress">OPPONENT PROGRESS</div>
      <Word guess={displayState} small={true}/>
    </div>
  );
}

export default OpponentSolveState;
