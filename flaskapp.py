import pandas as pd
from flask import Blueprint
from flask_api import FlaskAPI
import os

os.chdir('../data-viz-group-project')
path = os.getcwd() + '/trumpTweets.csv'
api_data = pd.read_csv(path)
api_data = api_data.to_json()

theme = Blueprint(
    'flask-api', __name__,
    url_prefix='/flask-api',
    template_folder = 'templates', static_folder='static'
)

app = FlaskAPI(__name__)
app.blueprints['flask-api'] = theme

@app.route ('/api/v1.0/alltweets')
def untruths():
    return api_data


@app.route("/")
def welcome():
    return(
        f'Welcome to our API!<br/>'
        f'Available Routes: <br/>'
        f'/api/v1.0/alltweets (returns all tweets as json) <br/>'
    )


if __name__ == '__main__':
    app.run(debug=True)
