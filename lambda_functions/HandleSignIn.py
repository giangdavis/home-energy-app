import json
import boto3
import os

cognito = boto3.client('cognito-idp')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        username = body.get('username')
        password = body.get('password')

        response = cognito.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            },
            ClientId=os.environ['COGNITO_USER_POOL_CLIENT_ID']
        )
        
        token = response['AuthenticationResult']['AccessToken']
        
        return {
            'statusCode': 200,
            'body': json.dumps({'token': token, 'userId': username})
        }
    except cognito.exceptions.NotAuthorizedException as e:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Invalid username or password'})
        }
    except Exception as e:
        error_message = str(e)
        print(f"Error signing in user: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'User sign-in failed', 'details': error_message})

        }