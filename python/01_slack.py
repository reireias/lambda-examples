import json
import os
import urllib.request

def lambda_handler(event, context):
    notify('Hello World Python')
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def notify(text):
    data = json.dumps({'text': text}).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    req = urllib.request.Request(
        os.environ['WEBHOOK_URL'],
        data=data,
        method='POST',
        headers=headers)
    with urllib.request.urlopen(req) as res:
        print(res.read().decode('utf-8'))
