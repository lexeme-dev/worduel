import React, {Component} from 'react';
import './App.css';
import WordTable from "./WordTable";
import {ClientState, GameBasicInfo, GameStatus, Player} from "./services/interfaces"
import Create from "./Create";
import GameService from "./services/GameService";
import Waiting from "./Waiting";

interface AppState {
  gameId?: string;
  gameStatus?: GameStatus;
  clientState?: ClientState;
  playerInfo?: Player;
  isPlayerOne: boolean;
}

class App extends Component<{}, AppState> {
  private infoPollInterval?: NodeJS.Timer;
  private infoReqCounter: number = 0;

  private statePollInterval?: NodeJS.Timer;
  private stateReqCounter: number = 0;

  constructor(props: {}) {
    super(props);
    this.state = {gameId: undefined, clientState: undefined, isPlayerOne: false}
  }


  componentDidMount() {
  }

  onGameCreate = (name: string) => {
    this.setState({isPlayerOne: true});
    GameService.createGame().then(r => {
      this.onGameJoin(name, r.game_id);
    })
  }

  onGameJoin = (name: string, gameId: string) => {
    GameService.joinGame(gameId, name).then(r => {
      this.setState({gameId, playerInfo: r});
      this.infoPollInterval = setInterval(this.pollInfoUntilReady, 1000);
    })
  }

  pollInfoUntilReady = () => {
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
      if (r.status.utc_ready) {
        clearInterval(this.infoPollInterval!);
        this.infoPollInterval = undefined;
      }
      this.setState({gameStatus: r.status});
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.gameId && !this.state.gameStatus?.utc_ready &&
          <Waiting bodyText={`Game Code: ${this.state.gameId}`}/>}
        {this.state.playerInfo ?
          <WordTable guesses={this.state.clientState?.guesses!} isPlayerOne={this.state.isPlayerOne}
                     playerName={this.state.playerInfo.name}/> :
          <Create onCreate={this.onGameCreate} onJoin={this.onGameJoin}/>}
      </div>
    );
  }
}

export default App;
