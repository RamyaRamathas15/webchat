import json
import boto3

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    # TODO implement
    request_params = json.loads(event["body"])
    tmpkey = request_params["fileName"]
    data = request_params["data"]
    upload_path = '/tmp/{}'.format(tmpkey)
    with open(upload_path,"w") as f:
        f.write(json.dumps(data))
    s3_client.upload_file(upload_path, "inputchatmessagegroup1", tmpkey + ".json")
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
