import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
from datetime import datetime, timedelta
import calendar
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
        period = query_params.get('period', 'monthly')

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

        # Calculate the start and end dates based on the period
        end_date = datetime.now().strftime('%Y-%m-%d')
        if period == 'daily':
            start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        elif period == 'weekly':
            start_date = (datetime.now() - timedelta(weeks=9)).strftime('%Y-%m-%d')
        else:  # monthly
            start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')

        # Query DynamoDB
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('EnergyData')
        response = table.query(
            KeyConditionExpression=Key('userId').eq(requested_user_id) &
            Key('date').between(start_date, end_date)
        )

        # Aggregate the data based on the period
        aggregated_data = aggregate_data(response['Items'], period)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps(aggregated_data, default=handle_decimal_type)
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

def aggregate_data(data, period):
    aggregated_data = {}

    for item in data:
        date = datetime.strptime(item['date'], '%Y-%m-%d')
        if period == 'daily':
            key = date.strftime('%Y-%m-%d')
        elif period == 'weekly':
            # Calculate the start of the week (Monday)
            start_of_week = (date - timedelta(days=date.weekday())).strftime('%Y-%m-%d')
            key = f"Week of {start_of_week}"
        else:  # monthly
            key = date.strftime('%Y-%m')

        if key not in aggregated_data:
            aggregated_data[key] = {
                'date': key,
                'usage': 0
            }

        aggregated_data[key]['usage'] += float(item['usage'])

    # Convert the aggregated data to a list and sort it by date
    aggregated_data_list = list(aggregated_data.values())
    aggregated_data_list.sort(key=lambda x: x['date'])

    return aggregated_data_list

def handle_decimal_type(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Object of type '{obj.__class__.__name__}' is not JSON serializable")