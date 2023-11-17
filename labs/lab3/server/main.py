from flask import Flask, send_from_directory
from flask_cors import CORS


app = Flask(__name__,
            static_url_path='',
            static_folder='../static')
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/static/<path:path>")
def webglfun(path):
    #print(path)
    return send_from_directory('static',path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8020)
