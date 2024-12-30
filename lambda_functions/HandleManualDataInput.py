import json
import boto3
import logging
from decimal import Decimal

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_user_id_from_authorizer(event):
    """Extract user ID from JWT claims"""
    return event.get('requestContext', {}).get('authorizer', {}).get('jwt', {}).get('claims', {}).get('username')

def lambda_handler(event, context):
    try:
        logger.info("Processing energy data input request")
        
        # Parse request body
        body = json.loads(event['body'])
        requested_user_id = body.get('userId')
        date = body.get('date')
        usage = body.get('usage')

        # Validate input
        if not all([requested_user_id, date, usage]):
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps({
                    'error': 'Missing required fields: userId, date, and usage are required'
                })
            }

        # Get authenticated user from claims
        auth_user_id = get_user_id_from_authorizer(event)
        
        # Verify user authorization
        if auth_user_id and requested_user_id != auth_user_id:
            logger.warning(f"Unauthorized access attempt: Token user {auth_user_id} tried to access data for {requested_user_id}")
            return {
                'statusCode': 403,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps({
                    'error': 'Unauthorized access to requested user data'
                })
            }

        # Initialize DynamoDB
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('EnergyData')

        # Save data to DynamoDB
        response = table.put_item(
            Item={
                'userId': requested_user_id,
                'date': date,
                'usage': Decimal(str(usage))  # Convert to Decimal for DynamoDB
            }
        )

        logger.info("Energy data saved successfully")
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': 'Energy data saved successfully'
            })
        }

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'error': f'Invalid input: {str(e)}'
            })
        }

    except Exception as e:
        logger.error(f"Error saving energy data: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'error': 'Error saving energy data'
            })
        }