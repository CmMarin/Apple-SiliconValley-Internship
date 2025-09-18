# OAuth Setup for Google Calendar Integration

This document provides instructions for setting up OAuth 2.0 for integrating Google Calendar with your application.

## Prerequisites

1. **Google Account**: Ensure you have a Google account to access the Google Cloud Console.
2. **Project Setup**: You should have your project structure set up as outlined in the project documentation.

## Steps to Set Up OAuth 2.0

### 1. Create a Google Cloud Project

- Go to the [Google Cloud Console](https://console.cloud.google.com/).
- Click on the project drop-down and select or create the project you want to use for the API.
  
### 2. Enable Google Calendar API

- In the Google Cloud Console, navigate to the **API & Services** > **Library**.
- Search for "Google Calendar API" and click on it.
- Click the **Enable** button to enable the API for your project.

### 3. Configure OAuth Consent Screen

- Navigate to **API & Services** > **OAuth consent screen**.
- Select the User Type (Internal or External) and click **Create**.
- Fill in the required fields such as App name, User support email, and Developer contact information.
- Click **Save and Continue** until you reach the summary page, then click **Back to Dashboard**.

### 4. Create OAuth 2.0 Credentials

- Navigate to **API & Services** > **Credentials**.
- Click on **Create Credentials** and select **OAuth client ID**.
- Choose the application type (Web application).
- Set the name for your OAuth 2.0 client.
- Under **Authorized redirect URIs**, add the URI where your application will handle the OAuth 2.0 response (e.g., `http://localhost:3000/api/auth/callback`).
- Click **Create**. You will see your client ID and client secret.

### 5. Download Credentials

- Click on the download icon next to your newly created OAuth 2.0 client ID to download the credentials JSON file.
- Rename this file to `google_oauth_credentials.json` and place it in the `config` directory of your project.

### 6. Update Environment Variables

- In your `.env` file or `.env.example`, add the following variables:

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

### 7. Implement OAuth Flow in Your Application

- Use the `google-auth` and `google-api-python-client` libraries in your backend to handle the OAuth flow.
- Implement the necessary routes in your FastAPI application to initiate the OAuth flow and handle the callback.

### 8. Test the Integration

- Start your application and navigate to the route that initiates the OAuth flow.
- Follow the prompts to authorize your application.
- Verify that you can access the Google Calendar API and create events.

## Conclusion

You have successfully set up OAuth 2.0 for integrating Google Calendar with your application. Follow the implementation steps to complete the integration and test the functionality.