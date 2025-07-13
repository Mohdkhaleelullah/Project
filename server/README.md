# Flask Backend for ML Video Prediction

This is the backend server for the ML Video Prediction application. It handles video uploads, ML predictions, and user data management.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the server:
   ```
   python app.py
   ```

The server will start at http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Log in to an existing account

### Predictions
- `POST /api/predictions/upload` - Upload a video for prediction
- `GET /api/predictions/user/:userId` - Get all predictions for a user

## Notes

For the MVP, this backend uses file-based storage instead of a real MongoDB database. In a production environment, you would:

1. Connect to a real MongoDB instance
2. Implement proper password hashing
3. Add JWT authentication
4. Load the TensorFlow model for real predictions
5. Implement proper error handling and validation

The commented sections in the code show where these implementations would go in a production version.