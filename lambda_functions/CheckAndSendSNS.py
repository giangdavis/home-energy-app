import json
import boto3
import os
from datetime import datetime, timedelta
from decimal import Decimal

def lambda_handler(event, context):
    # Initialize clients
    dynamodb = boto3.resource('dynamodb')
    sns = boto3.client('sns')
    
    # Get all active alerts
    alerts_table = dynamodb.Table('EnergyAlerts')
    energy_table = dynamodb.Table('EnergyData')
    
    # Get all active alerts
    alerts = alerts_table.scan(
        FilterExpression='isActive = :true',
        ExpressionAttributeValues={':true': True}
    )['Items']
    
    # Get today's date
    today = datetime.now().strftime('%Y-%m-%d')
    print(f"Today: {today} ")
    notifications_sent = 0
    
    for alert in alerts:
        try:
            # Get today's energy usage for user
            response = energy_table.get_item(
                Key={
                    'userId': alert['userId'],
                    'date': today
                }
            )
            
            if 'Item' in response:
                usage = Decimal(response['Item']['usage'])
                threshold = alert['threshold']

                print(f"Usage: {usage}, Threshold: {threshold}")

                if usage > threshold:
                    # Send SNS notification
                    print("Energy usage ({usage} kWh) has exceeded your threshold ({threshold} kWh")
                    message = {
                        'userId': alert['userId'],
                        'date': today,
                        'usage': float(usage),
                        'threshold': float(threshold),
                        'message': f'Energy usage ({usage} kWh) has exceeded your threshold ({threshold} kWh)'
                    }
                    
                    sns.publish(
                        TopicArn=os.environ['TOPIC_ARN'],  
                        Message=json.dumps(message),
                        Subject='Energy Usage Alert'
                    )
                    
                    notifications_sent += 1
                    
        except Exception as e:
            print(f"Error processing alert for user {alert['userId']}: {str(e)}")
            continue
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': f'Processed {len(alerts)} alerts, sent {notifications_sent} notifications'
        })
    }