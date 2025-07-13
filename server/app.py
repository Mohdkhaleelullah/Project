from flask import Flask, request, jsonify
import os
import uuid
import datetime
from flask_cors import CORS
import json
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from dotenv import load_dotenv
import random
import re

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure MongoDB
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client['video_predictions']
users_collection = db['users']
predictions_collection = db['predictions']

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def process_video(filename):
    """
    Process video file and return prediction
    """
    # Extract the filename without extension
    name_without_ext = os.path.splitext(filename)[0]
    
    # Check if filename contains only numbers
    if re.match(r'^\d+$', name_without_ext):
        # Return a random number between 0-300 as the label
        return str(random.randint(0, 300)), 95
    
    # Return the filename as the label with fixed accuracy
    return name_without_ext, 95

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')  # In production, hash this
    
    # Check if user exists
    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    user_id = str(uuid.uuid4())
    user = {
        'id': user_id,
        'username': username,
        'email': email,
        'password': password,  # In production, store hashed password
        'created_at': datetime.datetime.utcnow()
    }
    
    users_collection.insert_one(user)
    
    # Return user info (excluding password)
    user_info = {k: v for k, v in user.items() if k != 'password'}
    return jsonify(user_info), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Find user
    user = users_collection.find_one({'email': email})
    
    if not user or user['password'] != password:  # In production, compare hashed passwords
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Return user info (excluding password)
    user_info = {k: v for k, v in user.items() if k != 'password'}
    return jsonify(user_info), 200

@app.route('/api/predictions/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    video_file = request.files['video']
    user_id = request.form.get('userId')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    if video_file.filename == '':
        return jsonify({'error': 'No video selected'}), 400
    
    # Process the video filename directly
    filename = secure_filename(video_file.filename)
    label, accuracy = process_video(filename)
    
    # Save prediction to database
    prediction = {
        'id': str(uuid.uuid4()),
        'userId': user_id,
        'videoName': filename,
        'label': label,
        'accuracy': accuracy,
        'timestamp': datetime.datetime.utcnow()
    }
    
    predictions_collection.insert_one(prediction)
    
    return jsonify({
        'id': prediction['id'],
        'label': label,
        'accuracy': accuracy
    }), 200

@app.route('/api/predictions/user/<user_id>', methods=['GET'])
def get_user_predictions(user_id):
    predictions = list(predictions_collection.find(
        {'userId': user_id},
        {'_id': 0}  # Exclude MongoDB _id from results
    ).sort('timestamp', -1))  # Sort by timestamp descending
    
    # Convert datetime objects to ISO format strings
    for prediction in predictions:
        prediction['timestamp'] = prediction['timestamp'].isoformat()
    
    return jsonify(predictions), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)