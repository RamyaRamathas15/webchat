from flask import Flask, request, jsonify, make_response, render_template
import os
from google.cloud import storage
from wordcloud import WordCloud, STOPWORDS
import io
import base64
import spacy


app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

storage_client = storage.Client()

def read_blob_as_str(bucket_name, source_blob_name):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    downloaded_blob = blob.download_as_string()
    return downloaded_blob.decode("utf-8")


@app.route("/home")
def download_blobs():
    bucket_name = "test_bucket_575"
    organization = request.args.get('organization')
    corpusData = ""
    clouds = []

    blobs = storage_client.list_blobs(bucket_name, prefix=organization)
    for blob in blobs:
        print(blob.name)
        corpusData = corpusData + read_blob_as_str(bucket_name, blob.name)

    print(corpusData)
    doc = nlp(corpusData)
    properNounList = [token.text for token in doc if token.pos_ == "PROPN"]
    cloud = get_wordcloud(", ".join(properNounList))
    clouds.append(cloud)
    return render_template('home.html', articles=clouds)
    # data = {'message': 'SUCCESS'}
    # return  make_response(jsonify(data), 201)

def get_wordcloud(text):
    stopwords = set(STOPWORDS)
    pil_img = WordCloud().generate(text=text).to_image()
    img = io.BytesIO()
    pil_img.save(img, "PNG")
    img.seek(0)
    img_b64 = base64.b64encode(img.getvalue()).decode()
    return img_b64


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(port=port,host="0.0.0.0", debug=True)
