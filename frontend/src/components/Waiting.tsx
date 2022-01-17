import React, { Fragment } from 'react';
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

export type WaitingProps = {
  bodyText: string;
};

function Waiting(props: WaitingProps) {
  return (
      <Alert show={true} variant="success">
        <Alert.Heading> <Spinner animation="border" /> Waiting for Opponent</Alert.Heading>
        <p>
          { props.bodyText.toString() }
        </p>
      </Alert>
  );
}

export default Waiting;
