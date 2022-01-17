import React from 'react';
import logo from './logo.svg';
import './App.css';
import WordTable from "./WordTable";

function App() {
  return (
    <div className="App">
      <WordTable guesses={[]} />
    </div>
  );
}

export default App;
