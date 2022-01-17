import React, {Component} from 'react';
import './App.css';
import WordTable from "./WordTable";
import {ClientState, GameBasicInfo, GameStatus, Player} from "./services/interfaces"
import Create from "./Create";
import GameService from "./services/GameService";

interface AppState {
  gameId?: string;
  gameStatus?: GameStatus;
  clientState?: ClientState;
  playerInfo?: Player;
}

class App extends Component<{}, AppState> {
  private infoPollInterval?: NodeJS.Timer;
  private infoReqCounter: number = 0;

  constructor(props: {}) {
    super(props);
    this.state = {gameId: undefined, clientState: undefined}
  }


  componentDidMount() {
  }

  onGameCreate = (name: string) => {
    GameService.createGame().then(r => {
      this.onGameJoin(name, r.game_id);
    })
  }

  onGameJoin = (name: string, gameId: string) => {
    GameService.joinGame(gameId, name).then(r => {
      this.setState({gameId, playerInfo: r});
      this.infoPollInterval = setInterval(this.pollUntilReady, 1000);
    })
  }

  pollUntilReady = () => {
    this.infoReqCounter += 1;
    const reqNumber = this.infoReqCounter;
    GameService.getInfo(this.state.gameId!).then(r => {
      if (reqNumber < this.infoReqCounter) {
        return;
      }
      if (r.status.utc_ready) {
        clearInterval(this.infoPollInterval!);
        this.infoPollInterval = undefined;
      }
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.playerInfo ? <WordTable guesses={[]} isPlayerOne playerName={"Faiz"}/> :
          <Create onCreate={this.onGameCreate} onJoin={this.onGameJoin}/>}
      </div>
    );
  }
}

export default App;
