import json
import boto3
import csv
import io
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_user_id_from_authorizer(event):
    """Extract user ID from JWT claims"""
    return event.get('requestContext', {}).get('authorizer', {}).get('jwt', {}).get('claims', {}).get('username')

def lambda_handler(event, context):
    try:
        # Get S3 file info from event
        bucket = event['Records'][0]['s3']['bucket']['name']
        file_key = event['Records'][0]['s3']['object']['key']
        user_id_from_path = file_key.split('/')[1]
        
        # Get authenticated user ID from event context
        auth_user_id = get_user_id_from_authorizer(event)
        
        # Verify user authorization
        if auth_user_id and user_id_from_path != auth_user_id:
            raise ValueError("Unauthorized: File upload user ID doesn't match authenticated user")

        # Read file from S3
        s3 = boto3.client('s3')
        response = s3.get_object(Bucket=bucket, Key=file_key)
        file_content = response['Body'].read().decode('utf-8')

        # Parse CSV
        csv_content = io.StringIO(file_content)
        csv_reader = csv.DictReader(csv_content)
        headers = csv_reader.fieldnames
        date_header = next(h for h in headers if h.lower() == 'date')
        usage_header = next(h for h in headers if h.lower().startswith('usage'))

        # Initialize DynamoDB client and batch items
        dynamodb = boto3.client('dynamodb')
        batch_items = []
        count = 0

        # Process rows in batches
        for row in csv_reader:
            batch_items.append({
                'PutRequest': {
                    'Item': {
                        'userId': {'S': user_id_from_path},
                        'date': {'S': row[date_header]},
                        'usage': {'N': str(int(float(row[usage_header])))}
                    }
                }
            })
            count += 1

            # Write batch when we hit 25 items
            if len(batch_items) == 25:
                dynamodb.batch_write_item(RequestItems={'EnergyData': batch_items})
                batch_items = []

        # Write any remaining items
        if batch_items:
            dynamodb.batch_write_item(RequestItems={'EnergyData': batch_items})

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': 'Success',
                'recordsProcessed': count
            })
        }

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'error': str(e)
            })
        }