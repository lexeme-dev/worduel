import React from 'react';
import logo from './logo.svg';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.css';
import './Create.css';

export type CreateProps = {

}

function Create(props: CreateProps) {
  return (
    <div className="create-container">
      <Form className="join-form">
        <Form.Group className="mb-3">
            <Form.Control className="join-enter" type="text" size="lg" placeholder="GAME-CODE" />
            <div className="d-grid gap-2">
              <Button variant="primary join-button" size="lg">
                JOIN GAME
              </Button>
            </div>
        </Form.Group>
        OR
        <br />
        <Form.Group className="mb-3">
          <div className="d-grid gap-2">
            <Button variant="primary create-button" size="lg">
              CREATE GAME
            </Button>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Create;
