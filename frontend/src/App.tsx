import React from 'react';
import logo from './logo.svg';
import './App.css';
import WordTable from "./WordTable";
import { GameBasicInfo } from "./services/interfaces"

export type AppState = {
  gameBasicInfo: GameBasicInfo
}

class App {
  render () {
    return (
      <div className="App">
        <WordTable guesses={[]} />
      </div>
    );
  };
}

export default App;
