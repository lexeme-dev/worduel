import React, {Component} from 'react';
import './App.css';
import WordTable from "./WordTable";
import {ClientState, GameStatus, Player} from "../services/interfaces"
import Create from "./Create";
import GameService from "../services/GameService";
import Waiting from "./Waiting";
import InvalidWord from "./InvalidWord";
import PickWord from "./PickWord";
import EndGame from "./EndGame";
import OpponentSolveState from "./OpponentSolveState";
import GuessKeyboard from "./GuessKeyboard";

interface AppState {
  gameId?: string;
  gameStatus?: GameStatus;
  clientState?: ClientState;
  playerInfo?: Player;
  isPlayerOne: boolean;
  waitingOpponent: string;
  invalidWord: boolean;
  currentGuess: string;
}

class App extends Component<{}, AppState> {
  private infoPollInterval?: NodeJS.Timer;
  private infoReqCounter: number = 0;

  private statePollInterval?: NodeJS.Timer;
  private stateReqCounter: number = 0;

  constructor(props: {}) {
    super(props);
    this.state = {
      gameId: undefined,
      clientState: undefined,
      isPlayerOne: false,
      waitingOpponent: "",
      invalidWord: false,
      currentGuess: "",
    }
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<AppState>) {
    if (prevState.clientState?.guesses.length !== this.state.clientState?.guesses.length) {
      this.setState({currentGuess: ""});
    }
  }

  onGameCreate = (name: string) => {
    this.setState({isPlayerOne: true});
    GameService.createGame().then(r => {
      this.onGameJoin(name, r.game_id);
    });
  }

  onGameJoin = (name: string, gameId: string) => {
    GameService.joinGame(gameId, name).then(r => {
      this.setState({gameId, playerInfo: r});
      this.infoPollInterval = setInterval(this.pollInfoUntilReady, 1000);
      this.setState({waitingOpponent: `Game Code: ${this.state.gameId}`});
    })
  }

  onWordPicked = (word: string) => {
    GameService.pickWord(this.state.gameId!, word, this.state.playerInfo?.secret_id!).then(r => {
      if (!r.status.utc_started) {
        this.setState({invalidWord: false});
        this.setState({waitingOpponent: "Opponent is choosing their secret word..."});
        this.infoPollInterval = setInterval(this.pollInfoUntilStarted, 1000);
      } else {
        this.setState({waitingOpponent: "", invalidWord: false});
        this.statePollInterval = setInterval(this.pollClientState, 1000);
      }
      this.setState({gameStatus: r.status});
    }).catch((error) => {
      this.setState({invalidWord: true});
    });
  }

  pollInfoUntilReady = () => {
    this.infoReqCounter += 1;
    const reqNumber = this.infoReqCounter;
    GameService.getInfo(this.state.gameId!).then(r => {
      if (reqNumber < this.infoReqCounter) {
        return;
      }
      if (r.status.utc_ready || this.infoReqCounter > 10_000) {
        clearInterval(this.infoPollInterval!);
        this.infoPollInterval = undefined;
        this.setState({waitingOpponent: ""});
      }
      this.setState({gameStatus: r.status});
    })
  }

  pollInfoUntilStarted = () => {
    this.infoReqCounter += 1;
    const reqNumber = this.infoReqCounter;
    GameService.getInfo(this.state.gameId!).then(r => {
      if (reqNumber < this.infoReqCounter) {
        return;
      }
      if (r.status.utc_started || this.infoReqCounter > 10_000) {
        clearInterval(this.infoPollInterval!);
        this.infoPollInterval = undefined;
        if (r.status.utc_started) {
          this.statePollInterval = setInterval(this.pollClientState, 1000);
        }
        this.setState({waitingOpponent: ""});
      }
      this.setState({gameStatus: r.status});
    });
  }

  pollClientState = () => {
    this.stateReqCounter += 1;
    const reqNumber = this.stateReqCounter;
    GameService.getState(this.state.gameId!, this.state.playerInfo!.secret_id).then(r => {
      if (reqNumber < this.stateReqCounter) {
        return;
      }
      if (!r.player.pending_guess) {
        this.setState({waitingOpponent: ""});
      }
      this.setState({clientState: r});
      if (r.end_state) {
        clearInterval(this.statePollInterval! || this.stateReqCounter > 10_000);
        this.statePollInterval = undefined;
      }
    })
  }

  onGuess = (guessWord: string) => {
    this.stateReqCounter += 1;
    GameService.guessWord(this.state.gameId!, guessWord, this.state.playerInfo?.secret_id!).then(r => {
      this.setState({invalidWord: false, clientState: r});
      if (r.player.pending_guess) {
        this.setState({waitingOpponent: "Waiting for opponent guess..."})
      }
      if (r.end_state) {
        this.setState({invalidWord: false, waitingOpponent: ""});
        clearInterval(this.statePollInterval!);
        this.statePollInterval = undefined;
      }
    }).catch((e) => {
      this.setState({invalidWord: true})
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header pt-3 pb-1">
          <h1>BattleWord</h1>
          {this.state.clientState &&
            <OpponentSolveState word={this.state.clientState.word}
                                opponentSolveState={this.state.clientState.opponent_solve_state}/>
          }
          {this.state.clientState?.end_state &&
            <EndGame endState={this.state.clientState?.end_state}/>}
          {this.state.invalidWord &&
            <InvalidWord/>}
          {!!this.state.waitingOpponent &&
            <Waiting bodyText={this.state.waitingOpponent}/>}
        </header>
        <div className="App-body">
          {!this.state.gameId &&
            <Create onCreate={this.onGameCreate} onJoin={this.onGameJoin}/>}
          {this.state.gameId && this.state.gameStatus?.utc_ready && !this.state.gameStatus?.utc_started && !this.state.waitingOpponent &&
            <PickWord onWordPicked={this.onWordPicked}/>}
          {this.state.clientState &&
            <WordTable guesses={this.state.clientState?.guesses!} isPlayerOne={this.state.isPlayerOne}
                       playerName={this.state.playerInfo!.name}
                       currentGuess={this.state.currentGuess}
                       opponentSubmittedGuess={this.state.clientState.opponent_submitted_guess}/>}
        </div>
        <footer className="App-footer">
          {this.state.clientState &&
            <GuessKeyboard onChange={(newGuess) => this.setState({currentGuess: newGuess})}
                           onSubmit={() => this.onGuess(this.state.currentGuess)}
                           enabled={!this.state.waitingOpponent}
                           currentWord={this.state.currentGuess}
                           knowledge={this.state.clientState.letter_knowledge}/>}
        </footer>
      </div>
    );
  }
}

export default App;
