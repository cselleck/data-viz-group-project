import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_restful import Resource, Api


data_points = []
keywords = []

app = Flask(__name__)

engine = create_engine()
Base = automap_base()
Base.prepare(engine, reflect=True)
Mistruth = Base.classes.mistruth

@app.route ('/api/v1.0/trump_mistruths')

'''
return data as json
'''
def mistruths():
    return jsonify(data_points)

@app.route("/")
def welcome():
    return(
        f'Welcome to our API!<br/>'
        f'Available Routes: <br/>'
        f'/api/v1.0/trump_mistruths (returns all mistruths)'
        f'/api/v1.0/trump_mistruths/keyword (returns all mistruths with associated keyword'
        f'Keywords include: {}{}{}{}{}'
    )

@app.route('/api/v1.0/trump_mistruths/<keyword>')

def find_keyword_mistruths(keyword):
    canonicalized = keyword.lower()
    for word in keywords:
        search_term = word.lower()
        if search_term == canonicalized:
            return jsonify(keyword)
    return jsonify({'error': f'{keyword} not found in keywords'}), 404


if __name__ == '__main__':
    app.run(debug=True)

