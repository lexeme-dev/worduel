import {ClientState, GameBasicInfo} from "./interfaces";
import requester from "./requester";

class GameService {
    static createGame(): Promise<GameBasicInfo> {
        return requester.post('/game').then(r => r.data);
    }

    static getInfo(game_id: string) {
        return requester.get(`/game/${game_id}`, {params: {game_id}}).then(r => r.data);
    }

    static getState(game_id: string, player_secret: string): Promise<ClientState> {
        return requester.get(`/game/${game_id}/state`, {params: {player_secret}}).then(r => r.data);
    }

    static joinGame(game_id: string, name: string): Promise<GameBasicInfo> {
        return requester.post(`/game/${game_id}`, {}, {params: {name}}).then(r => r.data);
    }

    static pickWord(game_id: string, word: string, player_secret: string): Promise<GameBasicInfo> {
        return requester.post(`/game/${game_id}/pick_word`, {params: {word, player_secret}}).then(r => r.data);
    }

    static guessWord(game_id: string, guess_word: string, player_secret: string): Promise<ClientState> {
        return requester.post(`/game/${game_id}/guess`, {params: {guess_word, player_secret}}).then(r => r.data);
    }
}

export default GameService;