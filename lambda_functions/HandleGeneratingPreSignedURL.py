import boto3
import json

def lambda_handler(event, context):
    # Log incoming event
    print("Received event:", json.dumps(event))
    
    try:
        userId = event['queryStringParameters']['userId']
        print(f"UserID received: {userId}")
        
        s3_client = boto3.client('s3')
        bucket_name = 'home-energy-data-uploads'  # Your bucket name
        file_key = f'uploads/{userId}/{context.aws_request_id}.csv'
        
        print(f"Attempting to generate presigned URL for bucket: {bucket_name}, key: {file_key}")
        
        # Generate URL with try/except to catch specific S3 errors
        try:
            presigned_url = s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': bucket_name,
                    'Key': file_key,
                    'ContentType': 'text/csv'
                },
                ExpiresIn=300
            )
            print(f"Generated presigned URL: {presigned_url}")
            
        except Exception as s3_error:
            print(f"S3 presigned URL generation error: {str(s3_error)}")
            raise s3_error

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'uploadUrl': presigned_url,
                'fileKey': file_key,
                'bucket': bucket_name,
                'message': 'Pre-signed URL generated successfully'
            })
        }
    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
        print(f"Error type: {type(e)}")
        print(f"Error details: {str(e.__dict__)}")
        
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'message': 'Error generating pre-signed URL',
                'error': str(e),
                'errorType': str(type(e))
            })
        }