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
    <div className="container-container">
      <div className="create-container">
        <h1> BattleWord </h1>
        BattleWord is a 1v1 word-guessing game inspired by Wordle.
        Each player chooses a five-letter secret word.
        Each player has four guesses to name their opponent’s secret word.
        Each guess will reveal information about the letters in the opponent’s word, but also the guesser’s own word.
        Guess your opponent’s word first to win!

        <br />

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
    </div>
  );
}

export default Create;
