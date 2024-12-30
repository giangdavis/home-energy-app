import json
import boto3
import os

cognito = boto3.client('cognito-idp')

def lambda_handler(event, context):
    try:
        # Parse the request body
        body = json.loads(event['body'])
        username = body.get('username')
        email = body.get('email')
        password = body.get('password')

        if not username or not email or not password:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required field'})
            }

        response = cognito.sign_up(
            ClientId=os.environ['COGNITO_USER_POOL_CLIENT_ID'],
            Username=username,
            Password=password,
            UserAttributes=[{'Name': 'email', 'Value': email}]
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'message': 'User registration successful'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'error': str(e)})
        }
