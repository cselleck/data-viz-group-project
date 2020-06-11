import pandas as pd
from flask import Blueprint, render_template
from flask_api import FlaskAPI
import os

os.chdir('../data-viz-group-project')
path = os.getcwd() + '/trumpTweets.csv'
api_data = pd.read_csv(path)
api_data = api_data.to_json()

path = os.getcwd() + '/claimsmonth.csv'
claims_data = pd.read_csv(path)
claims_data = claims_data.to_json()


app = FlaskAPI(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

@app.route ('/api/v1.0/alltweets')
def tweets():
    return api_data

@app.route('/api/v1.0/breakdown')
def breakdown():
    return claims_data


@app.route("/")
def welcome():
    return render_template('home.html')


if __name__ == '__main__':
    app.run(debug=True)