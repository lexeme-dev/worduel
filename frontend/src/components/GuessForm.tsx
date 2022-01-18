import React, {ChangeEventHandler, FormEventHandler} from "react";
import {Button, Form, Row} from "react-bootstrap";

function GuessForm(props: { onSubmit: FormEventHandler, onChange: ChangeEventHandler<HTMLInputElement> }) {
  return (
    <Row className="guess-row guess-form">
      <Form className="join-form pt-1 pb-1" onSubmit={props.onSubmit} action="#">
        <Form.Group>
          <Form.Control className="guess-enter mb-1" type="text" size="lg" placeholder="Enter your guess"
                        onChange={props.onChange}/>
          <div className="d-grid gap-2">
            <Button variant="primary" className="join-button" type="submit"> GUESS </Button>
          </div>
        </Form.Group>
      </Form>
    </Row>
  );
}

export default GuessForm;
