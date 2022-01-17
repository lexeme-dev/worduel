import React from 'react';
import logo from './logo.svg';
import './App.css';
import WordTable from "./WordTable";
import { GameBasicInfo } from "./services/interfaces"

function App() {
  return (
    <div className="App">
      <WordTable guesses={[]} isPlayerOne playerName={"Faiz"} />
    </div>
  );
}

export default App;
