from flask import Flask, Response
from flask_cors import CORS
import requests
import json
from tools import normalize

app = Flask("recoapi")
CORS(app)

@app.route("/")
def index():
    return '<h1>Hello World</h1>'

@app.route("/getReco/<email>")
def get_reco(email: str):
    response = requests.get(
        'http://localhost:3001/users/movies?email=' + email)
    if response.status_code != 200:
        message = {
            'status': 'Error ' + str(response.status_code),
            'message': json.loads(response.content.decode())['message'],
            'route': 'movies'
        }
        return Response(json.dumps(message), status=401, mimetype='application/json')
    userMovies = eval(response.content.decode())
    response = requests.get('http://localhost:3001/users/allMovies')
    if response.status_code != 200:
        message = {
            'status': 'Error ' + str(response.status_code),
            'message': json.loads(response.content.decode())['message'],
            'route': 'allMovies'
        }
        return Response(json.dumps(message), status=401, mimetype='application/json')
    allMovies = eval(response.content.decode())
    newMovies = [movie for movie in allMovies if movie not in userMovies]
    
    genres = set(genre for movie in userMovies for genre in movie['movie:genre'])
    favoriteGenre = [{'genre': genre, 'rating': 0} for genre in genres]

    for movie in userMovies:
        for genre in movie['movie:genre']:
            for item in favoriteGenre:
                if item["genre"] == genre:
                    item["rating"] = (
                        item["rating"] + movie['user:Rating']) * 0.5
                    break

    favoriteGenre.sort(key=lambda x: x['rating'], reverse=True)
    print(favoriteGenre)

    reco_scores = []
    for movie in newMovies:
        print(movie['dbo:title'])
        score = 0
        for item in favoriteGenre:
            if item['genre'] in movie['movie:genre']:
                score += 10 * item['rating']
        print(score)
        reco_scores.append(score)
    print(reco_scores)

    reco_scores = normalize(reco_scores, 50, 99)

    for movie, score in zip(newMovies, reco_scores):
        movie['user:Rating'] = score

    newMovies.sort(key=lambda x: x['user:Rating'], reverse=True)
    return Response(json.dumps(newMovies), status=200, mimetype='application/json')


app.run(debug=True, port=3002)
