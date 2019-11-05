from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def ff():
    print(request.data)
    print(request.get_data())
    return ('yas')

app.run(host='0.0.0.0', debug=True, port='8484')