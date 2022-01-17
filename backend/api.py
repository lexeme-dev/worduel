from flask import Flask, jsonify, abort, request
from flask_cors import CORS

from game import InvalidNameError, InvalidWordError, PlayerNotFoundError
from game_manager import GameManager, GameNotFoundError
from helpers import ORJSONEncoder, ORJSONDecoder

app = Flask(__name__)
CORS(app)
app.json_encoder = ORJSONEncoder
app.json_decoder = ORJSONDecoder
game_manager = GameManager()


@app.route('/game', methods=['POST'])
def game_create():
    game = game_manager.create_game()
    return jsonify(game.get_basic_info())


# Poll this until status.utc_started is not null, then poll /state
@app.route('/game/<game_id>', methods=['GET'])
def game_info(game_id: str):
    try:
        game = game_manager.get_game(game_id)
        return jsonify(game.get_basic_info())
    except GameNotFoundError:
        abort(404)


@app.route('/game/<game_id>/join', methods=['POST'])
def game_join(game_id: str):
    name = request.args.get('name')
    try:
        game = game_manager.get_game(game_id)
        return jsonify(game.add_player(name))
    except InvalidNameError:  # TODO: Add error messages
        abort(422)
    except GameNotFoundError:
        abort(404)


@app.route('/game/<game_id>/pick_word', methods=['POST'])
def game_pick_word(game_id: str):
    player_secret = request.args.get('player_secret')
    word = request.args.get('word')
    try:
        game = game_manager.get_game(game_id)
        game.select_word(word, player_secret)
        return jsonify(game.get_basic_info())
    except (PlayerNotFoundError, InvalidWordError):
        abort(422)
    except GameNotFoundError:
        abort(404)


@app.route('/game/<game_id>/guess', methods=['POST'])
def game_guess(game_id: str):
    player_secret = request.args.get('player_secret')
    guess_word = request.args.get('guess_word')
    try:
        game = game_manager.get_game(game_id)
        game.make_guess(guess_word, player_secret)
        return jsonify(game.get_client_state(player_secret))
    except PlayerNotFoundError:
        abort(422)
    except GameNotFoundError:
        abort(404)


@app.route('/game/<game_id>/state', methods=['GET'])
def game_state(game_id: str):
    player_secret = request.args.get('player_secret')
    try:
        game = game_manager.get_game(game_id)
        return jsonify(game.get_client_state(player_secret))
    except PlayerNotFoundError:
        abort(422)
    except GameNotFoundError:
        abort(404)
