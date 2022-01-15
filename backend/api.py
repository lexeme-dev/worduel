from flask import Flask, jsonify, abort, request

from game import InvalidNameError, InvalidWordError, PlayerNotFoundError
from game_manager import GameManager, GameNotFoundError
from helpers import ORJSONEncoder, ORJSONDecoder

app = Flask(__name__)
app.json_encoder = ORJSONEncoder
app.json_decoder = ORJSONDecoder
game_manager = GameManager()


@app.route('/game', methods=['POST'])
def game_create():
    game = game_manager.create_game()
    return jsonify(game.get_basic_info())


# Poll this until utc_started is not null, then poll /state
@app.route('/game/<join_code>', methods=['GET'])
def game_info(join_code: str):
    try:
        game = game_manager.get_game(join_code)
        return jsonify(game.get_basic_info())
    except GameNotFoundError:
        abort(404)


@app.route('/game/<join_code>/join', methods=['POST'])
def game_join(join_code: str):
    name = request.args.get('name')
    word = request.args.get('word')
    try:
        game = game_manager.get_game(join_code)
        return jsonify(game.add_player(name, word))
    except (InvalidNameError, InvalidWordError):  # TODO: Add error messages
        abort(422)
    except GameNotFoundError:
        abort(404)


@app.route('/game/<join_code>/guess', methods=['POST'])
def game_guess(join_code: str):
    player_secret = request.args.get('player_secret')
    guess_word = request.args.get('guess_word')
    try:
        game = game_manager.get_game(join_code)
        game.make_guess(guess_word, player_secret)
        return jsonify(game.get_client_state(player_secret))
    except PlayerNotFoundError:
        abort(422)
    except GameNotFoundError:
        abort(404)


@app.route('/game/<join_code>/state', methods=['GET'])
def game_state(join_code: str):
    player_secret = request.args.get('player_secret')
    try:
        game = game_manager.get_game(join_code)
        return jsonify(game.get_client_state(player_secret))
    except PlayerNotFoundError:
        abort(422)
    except GameNotFoundError:
        abort(404)
