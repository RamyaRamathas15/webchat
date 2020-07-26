import json
import boto3
import uuid
from urllib.parse import unquote_plus
import re

s3_client = boto3.client('s3')
comprehend = boto3.client(service_name='comprehend', region_name='us-east-1')
unicode_chars = re.compile("[^\x00-\x7F]+")

def process_file(download_path, upload_path, fileName):
    data_obj = {}
    with open(download_path) as f:
        fileContent = f.read()
    if fileContent is None or fileContent.strip() == "":
        return
    data_content = json.loads(fileContent)
    data_content = data_content["content"]
    if data_content is None or data_content.strip() == "":
        return
    processed_data = unicode_chars.sub("", data_content)
    comprehend_json = comprehend.detect_sentiment(Text=unicode_chars.sub("", processed_data), LanguageCode='en')
    data_obj[fileContent] = comprehend_json["Sentiment"]
    with open(upload_path,"w") as f:
        f.write(json.dumps(data_obj))
    upload_fileName = fileName
    s3_client.upload_file(upload_path, "analyzedchatmessagegroup1", upload_fileName)

def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])
        tmpkey = key.replace('/', '')
        download_path = '/tmp/{}{}'.format(uuid.uuid4(), tmpkey)
        upload_path = '/tmp/processed-{}'.format(tmpkey)
        s3_client.download_file(bucket, key, download_path)
        fileName = key
        process_file(download_path, upload_path,fileName)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
