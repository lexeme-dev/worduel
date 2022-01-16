from flask.testing import FlaskClient
import unittest
from api import app


class ApiTest(unittest.TestCase):
    client: FlaskClient

    def setUp(self):
        self.client = app.test_client()

    def tearDown(self):
        pass

    def test_create_game(self):
        res = self.client.post('/game')
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(res.json['game_id'])
        self.assertIsNone(res.json['status']['utc_ready'])

    def test_join_game(self):
        game_id = self.client.post('/game').json['game_id']
        res = self.client.post(f'/game/{game_id}/join?name=Faiz')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json['name'], 'Faiz')
        self.assertIsNotNone(res.json['secret_id'])
        res = self.client.get(f'/game/{game_id}')
        self.assertEqual(len(res.json['player_names']), 1)

    def test_join_game_invalid_name(self):
        game_id = self.client.post('/game').json['game_id']
        res = self.client.post(f'/game/{game_id}/join')
        self.assertEqual(res.status_code, 422)
        res = self.client.post(f'/game/{game_id}/join?name=namethatiswaytoolongtobeallowed')
        self.assertEqual(res.status_code, 422)
        res = self.client.get(f'/game/{game_id}')
        self.assertEqual(len(res.json['player_names']), 0)

    def test_game_info(self):
        game_id = self.client.post('/game').json['game_id']
        res = self.client.get(f'/game/{game_id}')
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(res.json['status'])
        self.assertEqual(len(res.json['player_names']), 0)
        self.client.post(f'/game/{game_id}/join?name=Faiz')

    def test_game_info_not_found(self):
        res = self.client.get(f'/game/hello-world')
        self.assertEqual(res.status_code, 404)

    def test_pick_word(self):
        game_id = self.client.post('/game').json['game_id']
        p1_secret = self.client.post(f'/game/{game_id}/join?name=Faiz').json['secret_id']
        p2_secret = self.client.post(f'/game/{game_id}/join?name=Varun').json['secret_id']
        res = self.client.post(f'/game/{game_id}/pick_word?word=angst&player_secret={p1_secret}')
        self.assertEqual(res.status_code, 200)
        res = self.client.post(f'/game/{game_id}/pick_word?word=price&player_secret={p2_secret}')
        self.assertEqual(res.status_code, 200)

    def test_pick_word_invalid(self):
        game_id = self.client.post('/game').json['game_id']
        p1_secret = self.client.post(f'/game/{game_id}/join?name=Faiz').json['secret_id']
        self.client.post(f'/game/{game_id}/join?name=Varun')
        res = self.client.post(f'/game/{game_id}/pick_word?word=notaword&player_secret={p1_secret}')
        self.assertEqual(res.status_code, 422)
        res = self.client.post(f'/game/{game_id}/pick_word?word=price&player_secret={p1_secret}')
        self.assertEqual(res.status_code, 200)

    def test_guess_word(self):
        game_id = self.client.post('/game').json['game_id']
        p1_secret = self.client.post(f'/game/{game_id}/join?name=Faiz').json['secret_id']
        p2_secret = self.client.post(f'/game/{game_id}/join?name=Varun').json['secret_id']
        self.client.post(f'/game/{game_id}/pick_word?word=angst&player_secret={p1_secret}')
        self.client.post(f'/game/{game_id}/pick_word?word=price&player_secret={p2_secret}')
        res = self.client.post(f'/game/{game_id}/guess?guess_word=prone&player_secret={p1_secret}')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json['player']['pending_guess']['guess_word'], 'prone')
        res = self.client.post(f'/game/{game_id}/guess?guess_word=anger&player_secret={p2_secret}')
        self.assertEqual(res.status_code, 200)
        self.assertIsNone(res.json['player']['pending_guess'])
        self.assertIsNone(res.json['end_state'])
        res = self.client.get(f'/game/{game_id}/state?player_secret={p1_secret}')
        self.assertIsNone(res.json['player']['pending_guess'])

    def test_guess_word_correct(self):
        game_id = self.client.post('/game').json['game_id']
        p1_secret = self.client.post(f'/game/{game_id}/join?name=Faiz').json['secret_id']
        p2_secret = self.client.post(f'/game/{game_id}/join?name=Varun').json['secret_id']
        self.client.post(f'/game/{game_id}/pick_word?word=angst&player_secret={p1_secret}')
        self.client.post(f'/game/{game_id}/pick_word?word=price&player_secret={p2_secret}')
        self.client.post(f'/game/{game_id}/guess?guess_word=prone&player_secret={p1_secret}')
        res = self.client.post(f'/game/{game_id}/guess?guess_word=angst&player_secret={p2_secret}')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json['end_state']['winner_name'], 'Varun')
        res = self.client.get(f'/game/{game_id}/state?player_secret={p1_secret}')
        self.assertIsNone(res.json['player']['pending_guess'])

    def test_guess_word_tie(self):
        game_id = self.client.post('/game').json['game_id']
        p1_secret = self.client.post(f'/game/{game_id}/join?name=Faiz').json['secret_id']
        p2_secret = self.client.post(f'/game/{game_id}/join?name=Varun').json['secret_id']
        self.client.post(f'/game/{game_id}/pick_word?word=angst&player_secret={p1_secret}')
        self.client.post(f'/game/{game_id}/pick_word?word=price&player_secret={p2_secret}')
        self.client.post(f'/game/{game_id}/guess?guess_word=price&player_secret={p1_secret}')
        res = self.client.post(f'/game/{game_id}/guess?guess_word=angst&player_secret={p2_secret}')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json['end_state']['tie'])
        self.assertIsNone(res.json['end_state']['winner_name'])
