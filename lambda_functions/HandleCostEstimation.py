import json
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime

DEFAULT_COST_PER_KWH = 0.12  # Default cost per kWh in USD

def lambda_handler(event, context):
    try:
        # Extract query parameters
        query_params = event.get('queryStringParameters', {})
        user_id = query_params.get('userId')
        start_date = query_params.get('startDate')
        end_date = query_params.get('endDate')
        cost_per_kwh = float(query_params.get('costPerKwh', DEFAULT_COST_PER_KWH))
        
        # Validate inputs
        if not user_id or not start_date or not end_date:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing required parameters: userId, startDate, or endDate."})
            }

        # Connect to DynamoDB
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('EnergyData')

        # Query DynamoDB for usage data
        response = table.query(
            KeyConditionExpression=Key('userId').eq(user_id) &
                                   Key('date').between(start_date, end_date)
        )
        items = response.get('Items', [])
        
        # Calculate total usage
        total_usage = sum(float(item['usage']) for item in items)

        # Calculate total cost
        total_cost = round(total_usage * cost_per_kwh, 2)

        # Return the response
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "totalUsage": total_usage,
                "costPerKwh": cost_per_kwh,
                "totalCost": total_cost
            })
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Internal server error: {str(e)}"})
        }
