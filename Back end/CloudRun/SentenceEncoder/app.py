from flask import Flask, request
import json
import os
from flask_cors import CORS
import joblib
import pandas as pd
sentence_encoder = joblib.load("sentence_encoder.joblib")

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route("/encode",methods=["GET"])
def enter_data():
    response_json = {}
    response_json["response"] = "error"
    try:
        app.logger.debug(request)
        fileName = request.args.get("fileName")
        print(fileName)
        response_json["response"] = "success"
        encoded_value = sentence_encoder.encode([fileName])
        response_json["value"] = pd.Series(encoded_value).to_json(orient='values')
    except Exception as e:
        print(e)
    return json.dumps(response_json)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(port=port, host="0.0.0.0")
