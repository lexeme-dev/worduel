import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import WordTable from "./WordTable";
import {ClientState, GameBasicInfo} from "./services/interfaces"

interface AppState {
  gameId?: string;
  clientState?: ClientState;
}

class App extends Component<{}, {}> {
  constructor(props: {}) {
    super(props);
    this.state = {gameId: undefined, clientState: undefined}
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <WordTable guesses={[]} isPlayerOne playerName={"Faiz"} />
      </div>
    );
  }
}

export default App;
