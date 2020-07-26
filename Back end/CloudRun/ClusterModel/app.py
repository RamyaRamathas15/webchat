from flask import Flask, request
import json
import os
from sklearn.externals import joblib
from flask_cors import CORS
import numpy as np
from sklearn.cluster import KMeans

kmeans = joblib.load("model.joblib")

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route("/predict",methods=["POST"])
def enter_data():
    response_json = {}
    response_json["response"] = "error"

    try:
        request_json = request.get_json()
        instances = request_json["instances"]
        result_list = []
        for eachItem in instances:
            result_list.append(int(kmeans.predict(np.array(eachItem).reshape(1, -1))[0]))
        print(result_list)
        if len(result_list) > 0:
                response_json["predictions"] = result_list
                response_json["response"] = "success"
    except Exception as e:
        print(e)
    return json.dumps(response_json)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(port=port, host="0.0.0.0")
