import React from 'react';
import Alert from 'react-bootstrap/Alert'
import { EndState } from '../services/interfaces'

export type EndGameProps = {
  endState: EndState;
};

function EndGame(props: EndGameProps) {
  if (props.endState.tie) {
    return (
      <Alert show={true} variant="warning">
          <Alert.Heading> It’s a tie! </Alert.Heading>
        </Alert>
    );
  }
  return (
    <Alert show={true} variant="success">
        <Alert.Heading> { props.endState.winner_name } wins! </Alert.Heading>
    </Alert>
  );
}

export default EndGame;
