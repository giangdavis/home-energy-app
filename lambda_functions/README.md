# Lambda Functions - Energy Monitoring System

This directory contains all Lambda functions for the Energy Monitoring System backend.

## Functions Overview

### Authentication
- `HandleSignUp` - User registration with Cognito
- `HandleLogin` - User authentication and token generation
- `HandleAuthConfirmation` - Account verification process

### Energy Data Management
- `HandleManualDataInput` - Process single energy readings
- `HandleGetEnergyHistory` - Retrieve historical energy data
- `HandleCSVEnergyUpload` - Process CSV file uploads from S3
- `HandleGeneratingPreSignedURL` - Generates a presigned URL with that can be used to directly upload to S3 bucket

### Alert System
- `HandleSetThreshold` - Set energy usage alert thresholds
- `CheckAndSendSNS` - Monitor usage and trigger SNS notifications

## Common Dependencies
All functions use:
- boto3 (AWS SDK)
- json
- logging

## Environment Variables
Required environment variables for the Lambda functions:
```
COGNITO_USER_POOL_ID=us-west-2_6WVpDNkEQ
COGNITO_USER_POOL_CLIENT_ID=[Your Client ID]
SNS_TOPIC_ARN=[Your SNS Topic ARN]
```

## DynamoDB Tables Used
1. **EnergyData**
   - Primary Key: userId (String)
   - Sort Key: date (String)
   - Attributes: usage (Number)

2. **EnergyAlerts**
   - Primary Key: userId (String)
   - Attributes: 
     - threshold (Number)
     - isActive (Boolean)

## Testing
Each function can be tested using the AWS Lambda Console Test feature.

Example test events are provided in the `test-events` directory:
- `signup-event.json`
- `login-event.json`
- `energy-input-event.json`
- etc.

## Authentication Flow
1. User signs up (`HandleSignUp`)
2. Confirmation code sent to email
3. User confirms account (`HandleConfirmation`)
4. User logs in (`HandleLogin`)
5. JWT token used for subsequent requests

## Error Handling
All functions follow a standard error response format:
```python
{
    'statusCode': error_code,
    'headers': {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': True
    },
    'body': json.dumps({'error': error_message})
}
```

## Logging
Each function includes CloudWatch logging:
```python
logger = logging.getLogger()
logger.setLevel(logging.INFO)
```

## API Integration
Functions are integrated with API Gateway endpoints:
- /auth/*
- /energy/*
- /alerts

## Permissions
Add the necessary permissions for each lambda function 
Example: HandleManualDataInput will need DynamoDB access to store data

## Documentation
For detailed documentation of each function, see the corresponding README in each function's directory.