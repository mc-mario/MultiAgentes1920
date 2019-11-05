from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST', 'GET'])
def echo():
    msg = request.data.decode('UTF-8')
    return (f'Back to you: {msg}')

app.run(host='0.0.0.0', debug=True, port='8484')