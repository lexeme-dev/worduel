import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.css';
import './Create.css';

export type OnCreate = (name: string) => void;
export type OnJoin = (name: string, game_id: string) => void;

export type CreateProps = {
  onCreate: OnCreate;
  onJoin: OnJoin
}

export type CreateState = {
  joinGameId: string;
  joinGameName: string;
  createGameId: string;
}

class Create extends Component<CreateProps, CreateState> {
  constructor(props: CreateProps) {
    super(props);
    this.state = {
      joinGameId: "",
      joinGameName: "",
      createGameId: ""
    };
  }

  render() {
    return (
      <div className="container-container">
        <div className="mx-auto create-container">
          Worduel is a 1v1 word-guessing game inspired by Wordle.
          Each player chooses a five-letter secret word.
          Each player has four guesses to name their opponent’s secret word.
          Each guess will reveal information about the letters in the opponent’s word, but also the guesser’s own word.
          Guess your opponent’s word first to win!

          <br/>

          <Form className="pt-3 pb-2 join-form" onSubmit={(e) => { e.preventDefault(); this.props.onCreate(this.state.joinGameName) }}>
            <Form.Group className="mb-3">
              <Form.Control className="join-enter" type="text" size="lg" placeholder="Player Name"
                            onChange={(e) => this.setState({joinGameName: e.target.value})}/>
              <div className="d-grid gap-2">
                <Button variant="primary join-button" size="lg" type="submit">
                  CREATE GAME
                </Button>
              </div>
            </Form.Group>
          </Form>
          <div className="text-center lead">OR</div>
          <Form className="pt-3 join-form" onSubmit={(e) => { e.preventDefault(); this.props.onJoin(this.state.joinGameName, this.state.joinGameId);}}>
            <Form.Group className="mb-3">
              <Form.Control className="join-enter" type="text" size="lg" placeholder="game-code"
                            onChange={(e) => this.setState({joinGameId: e.target.value})}/>
              <Form.Control className="join-enter" type="text" size="lg" placeholder="Player Name"
                            onChange={(e) => this.setState({joinGameName: e.target.value})}/>
              <div className="d-grid gap-2">
                <Button variant="primary join-button" size="lg" type="submit">
                  JOIN GAME
                </Button>
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default Create;
