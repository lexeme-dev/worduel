import React, { Fragment } from 'react';
import Alert from 'react-bootstrap/Alert'

export type InvalidWordProps = {
  bodyText: string;
};

function InvalidWord(props: InvalidWordProps) {
  return (
      <Alert show={true} variant="danger">
        <Alert.Heading>  Invalid word! </Alert.Heading>
      </Alert>
  );
}

export default InvalidWord;
