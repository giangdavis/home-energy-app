import json
import boto3
from boto3.dynamodb.conditions import Key
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_user_id_from_authorizer(event):
    """Extract user ID from JWT claims"""
    return event.get('requestContext', {}).get('authorizer', {}).get('jwt', {}).get('claims', {}).get('username')

def lambda_handler(event, context):
    try:
        # Get parameters from API Gateway or direct test
        query_params = event.get('queryStringParameters', event)
        requested_user_id = query_params.get('userId')
        start_date = query_params.get('startDate')
        end_date = query_params.get('endDate')

        if not all([requested_user_id, start_date, end_date]):
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps({'error': 'Missing required parameters: userId, startDate, and endDate'})
            }

        # Verify user authentication if coming from API Gateway
        if 'requestContext' in event:
            auth_user_id = get_user_id_from_authorizer(event)
            if auth_user_id and requested_user_id != auth_user_id:
                return {
                    'statusCode': 403,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True
                    },
                    'body': json.dumps({'error': 'Unauthorized access to requested user data'})
                }

        # Query DynamoDB
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('EnergyData')
        response = table.query(
            KeyConditionExpression=Key('userId').eq(requested_user_id) & 
                                 Key('date').between(start_date, end_date)
        )
        
        # Format and return response
        items = [{
            'date': item['date'],
            'usage': float(item['usage'])
        } for item in response['Items']]
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps(items)
        }
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'error': 'Internal server error'})
        }