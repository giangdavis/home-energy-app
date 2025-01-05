import json
import boto3
import logging
from decimal import Decimal
from datetime import datetime, timedelta

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_user_id_from_authorizer(event):
    """Extract user ID from JWT claims"""
    return event.get('requestContext', {}).get('authorizer', {}).get('jwt', {}).get('claims', {}).get('username')

def lambda_handler(event, context):
    try:
        logger.info("Processing energy data input request")
        logger.info(f"Event: {json.dumps(event)}")  # Log the entire event
        
        # Parse request body
        body = json.loads(event['body'])
        requested_user_id = body.get('userId')
        date = body.get('date')
        usage = body.get('usage')
        
        logger.info(f"Requested user ID: {requested_user_id}")
        logger.info(f"Date: {date}")
        logger.info(f"Usage: {usage}")
        
        # Validate input
        if not all([requested_user_id, date, usage]):
            logger.error("Missing required fields")
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
        logger.info(f"Authenticated user ID: {auth_user_id}")
        
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
        table.put_item(
            Item={
                'userId': requested_user_id,
                'date': date,
                'usage': Decimal(str(usage))  # Convert to Decimal for DynamoDB
            }
        )
        
        logger.info("Energy data saved successfully")
        
        # Invoke the alert Lambda function
        lambda_client = boto3.client("lambda")
        alert_lambda_name = "CheckAndSendSNS"
        start_date = date
        end_date = (datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")
        payload = {"userId": requested_user_id, "startDate": start_date, "endDate": end_date}
        logger.info(f"Invoking alert Lambda function with payload: {json.dumps(payload)}")
        
        try:
            lambda_client.invoke(
                FunctionName=alert_lambda_name,
                InvocationType="Event",
                Payload=json.dumps(payload),
            )
        except Exception as alert_exception:
            # Log the error but don't fail the main function
            logger.error(f"Error invoking alert Lambda function: {str(alert_exception)}")
            # Continue with successful response since data was saved
        
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
        # Only return 500 if the DynamoDB operation fails
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