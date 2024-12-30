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
    logger.info(f"Received event: {json.dumps(event)}")
    
    try:
        # Parse request body
        body = json.loads(event['body'])
        threshold = body.get('threshold')
        requested_user_id = body.get('userId')
        
        logger.info(f"Processing request for userId: {requested_user_id} with threshold: {threshold}")

        if not threshold or not requested_user_id:
            logger.error("Missing required fields")
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps({
                    'error': 'Missing required fields: threshold and userId are required'
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

        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb')
        logger.info("Storing threshold in DynamoDB")

        # Convert threshold to proper format
        threshold_value = str(Decimal(str(threshold)))
        
        # Store threshold
        response = dynamodb.put_item(
            TableName='EnergyAlerts',
            Item={
                'userId': {'S': requested_user_id},
                'threshold': {'N': threshold_value},
                'isActive': {'BOOL': True}
            }
        )
        
        logger.info(f"DynamoDB response: {json.dumps(response)}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': 'Alert threshold set successfully',
                'threshold': float(threshold_value)
            })
        }
        
    except ValueError as e:
        logger.error(f"ValueError occurred: {str(e)}")
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'error': 'Invalid threshold value'
            })
        }
        
    except Exception as e:
        logger.error(f"Unexpected error occurred: {str(e)}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'error': 'Internal server error'
            })
        }