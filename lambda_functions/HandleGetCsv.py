import csv
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime, timedelta
import io
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # Extract parameters
        query_params = event.get('queryStringParameters', {})
        user_id = query_params.get('userId')
        start_date = query_params.get('startDate', (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d'))
        end_date = query_params.get('endDate', datetime.now().strftime('%Y-%m-%d'))

        # Validate required parameters
        if not user_id:
            return {
                "statusCode": 400,
                "body": "Missing required parameter: userId"
            }

        # Authenticate user
        auth_user_id = event.get('requestContext', {}).get('authorizer', {}).get('jwt', {}).get('claims', {}).get('username')
        if auth_user_id and auth_user_id != user_id:
            return {
                "statusCode": 403,
                "body": "Unauthorized access to requested data"
            }

        # Query DynamoDB for user data
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('EnergyData')
        response = table.query(
            KeyConditionExpression=Key('userId').eq(user_id) &
                                   Key('date').between(start_date, end_date)
        )

        items = response['Items']

        # Create a CSV
        csv_buffer = io.StringIO()
        writer = csv.writer(csv_buffer)
        writer.writerow(['Date', 'Usage (kWh)'])
        for item in items:
            writer.writerow([item['date'], float(item['usage'])])

        csv_data = csv_buffer.getvalue()

        # Return CSV as response
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "text/csv",
                "Content-Disposition": f"attachment; filename=energy_data_{user_id}.csv",
                "Access-Control-Allow-Origin": "*"
            },
            "body": csv_data,
            "isBase64Encoded": False
        }
    except Exception as e:
        logger.error(f"Error exporting data: {e}")
        return {
            "statusCode": 500,
            "body": "Internal server error"
        }
