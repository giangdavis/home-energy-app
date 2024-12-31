import json
import boto3
from boto3.dynamodb.conditions import Key
import os
from datetime import datetime
from decimal import Decimal
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info(f"Received event: {json.dumps(event)}")

    # Initialize clients
    dynamodb = boto3.resource('dynamodb')
    sns = boto3.client('sns')

    # Get the user ID, start date, and end date from the event
    user_id = event['userId']
    start_date = event['startDate']
    end_date = event['endDate']

    logger.info(f"Processing alert for user: {user_id}")
    logger.info(f"Date range: {start_date} to {end_date}")

    # Get the user's active alert
    alerts_table = dynamodb.Table('EnergyAlerts')
    energy_table = dynamodb.Table('EnergyData')

    response = alerts_table.get_item(
        Key={
            'userId': user_id
        }
    )

    if 'Item' not in response or not response['Item'].get('isActive', False):
        logger.info(f"No active alert found for user {user_id}")
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f'No active alert found for user {user_id}'
            })
        }

    alert = response['Item']
    threshold = alert['threshold']

    logger.info(f"Active alert found for user {user_id}. Threshold: {threshold}")

    logger.info(f"Querying energy usage from {start_date} to {end_date}")

    response = energy_table.query(
        KeyConditionExpression=Key('userId').eq(user_id) & Key('date').between(start_date, end_date)
    )

    usage_exceeded = False

    for item in response['Items']:
        date = item['date']
        usage = Decimal(item['usage'])

        logger.info(f"Usage on {date}: {usage}")

        if usage > threshold:
            logger.info(f"Usage on {date} exceeded threshold. Sending SNS notification.")

            # Send SNS notification
            message = {
                'userId': user_id,
                'date': date,
                'usage': float(usage),
                'threshold': float(threshold),
                'message': f'Energy usage on {date} ({usage} kWh) has exceeded your threshold ({threshold} kWh)'
            }

            sns.publish(
                TopicArn=os.environ['TOPIC_ARN'],
                Message=json.dumps(message),
                Subject='Energy Usage Alert'
            )

            logger.info("SNS notification sent successfully.")

            usage_exceeded = True

    if not usage_exceeded:
        logger.info("No usage exceeded the threshold in the specified date range.")

    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': f'Alert processing completed for user {user_id}'
        })
    }
