# Frontend Development and Deployment

## Local Development Setup

### Prerequisites
- Node.js installed on your machine
- npm (Node Package Manager)
- Git (for cloning the repository)

### Running Locally
1. **Clone the Repository**
   ```bash
   git clone [your-repository-url]
   cd energy-monitoring-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   This will start the development server at `http://localhost:5173`

## Project Structure
```
energy-monitoring-frontend/
├── src/
│   ├── components/
│   │   ├── AlertsForm.jsx
│   │   ├── ConfirmAccount.jsx
│   │   ├── CostEstimation.jsx
│   │   ├── EnergySummary.jsx
│   │   ├── ExportData.jsx
│   │   ├── FileUploadForm.jsx
│   │   ├── HistoricalDataForm.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── SingleEntryForm.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Deployment (AWS Amplify)

The application is deployed using AWS Amplify directly from the GitHub repository.

### Deployment Configuration
1. **AWS Amplify Setup**
   - Service: AWS Amplify
   - Connected to GitHub repository
   - Auto-deploys on main branch updates

2. **Build Settings**
   - Automatically handled by Amplify
   - Uses Node.js environment
   - Installs dependencies and builds the application

3. **Access Deployed Application**
   - URL: [Your Amplify App URL]
   - Updates automatically with Git pushes

### Deployment Process
1. Push changes to GitHub repository
2. Amplify automatically detects changes
3. Builds and deploys updated version
4. Available at Amplify URL

## Components Overview
- **SignUp/SignIn**: User authentication with Cognito
- **ConfirmAccount**: Email verification process
- **SingleEntryForm**: Individual energy data entry
- **FileUploadForm**: Bulk CSV data upload
- **HistoricalDataForm**: View historical data
- **AlertsForm**: Set usage thresholds
- **CostEstimation**: Calculate energy costs
- **ExportData**: Download usage data as CSV
- **EnerySummaryForm**: View usage summaries

## Development Notes
- API base URL: `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com`
- Authentication tokens stored in localStorage
- CSV files must follow specified format for bulk uploads

## Testing the Application
1. Navigate to the [Amplify URL](https://main.d2qbgmcglyi3ta.amplifyapp.com/) or run locally
2. Create account and verify email
3. Refer to api-documentation.md for API information
4. Test main features:
   - Single energy readings
   - CSV file uploads
   - Historical data view
   - Alert settings