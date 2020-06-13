import pandas as pd
from flask import Blueprint
from flask_api import FlaskAPI
from flask import Flask, render_template, request, redirect
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


@app.route("/api")
def welcome():
    return(
        f'Welcome to our API!<br/>'
        f'Available Routes: <br/>'
        f'/api/v1.0/alltweets (returns all tweets as json) <br/>'

    )
@app.route("/")
def index():
    return render_template("index.html")
    

@app.route("/bar_chart")
def bar_chart():
    return render_template("bar_chart.html")


@app.route("/pie_chart")
def pie_chart():
    return render_template("pie_chart.html")


@app.route("/any_chart")
def any_chart():
    return render_template("any_chart.html")


@app.route("/comparison")
def comparison():
    return render_template("comparison.html")


@app.route("/data")
def data():
    return render_template("data.html")




if __name__ == '__main__':
    app.run(debug=True)
