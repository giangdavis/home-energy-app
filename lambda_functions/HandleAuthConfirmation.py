import json
import boto3
import os

cognito = boto3.client('cognito-idp')

def lambda_handler(event, context):
    try:
        # Parse the request body
        body = json.loads(event['body'])
        username = body.get('username')
        confirmation_code = body.get('confirmationCode')

        if not username or not confirmation_code:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required fields'})
            }

        # Confirm the user's signup
        response = cognito.confirm_sign_up(
            ClientId=os.environ['COGNITO_USER_POOL_CLIENT_ID'],
            Username=username,
            ConfirmationCode=confirmation_code
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'message': 'Account confirmed successfully'})
        }

    except cognito.exceptions.CodeMismatchException:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'error': 'Invalid confirmation code'})
        }
    except cognito.exceptions.ExpiredCodeException:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'error': 'Confirmation code has expired'})
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