import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

user_bp = Blueprint('user', __name__)

# Mock database as a dictionary
users_db = {}

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@user_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Mock authentication
    user = users_db.get(username)
    if user and user['password'] == password:
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@user_bp.route('/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')
    zip_code = request.form.get('zip_code')

    # Check if username already exists
    if username in users_db:
        return jsonify({'error': 'Username already exists'}), 409

    # Handle profile picture upload
    profile_picture = None
    if 'profile_picture' in request.files:
        file = request.files['profile_picture']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Save the file to a mock directory (not actually saving since we're mocking)
            profile_picture = f'/path/to/profile_pictures/{filename}'
        else:
            return jsonify({'error': 'Invalid file type'}), 400

    # Mock user creation
    users_db[username] = {
        'password': password,
        'email': email,
        'zip_code': zip_code,
        'profile_picture': profile_picture,
    }

    return jsonify({'message': 'User registered successfully'}), 201

@user_bp.route('/change_profile', methods=['POST'])
def change_profile():
    """User profile update endpoint"""
    username = request.form.get('username')
    password = request.form.get('password')

    # Authenticate user
    user = users_db.get(username)
    if not user or user['password'] != password:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Update fields if provided
    new_password = request.form.get('new_password')
    email = request.form.get('email')
    zip_code = request.form.get('zip_code')

    if new_password:
        user['password'] = new_password
    if email:
        user['email'] = email
    if zip_code:
        user['zip_code'] = zip_code

    # Handle profile picture upload
    if 'profile_picture' in request.files:
        file = request.files['profile_picture']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Update the profile picture path
            user['profile_picture'] = f'/path/to/profile_pictures/{filename}'
        else:
            return jsonify({'error': 'Invalid file type'}), 400

    return jsonify({'message': 'Profile updated successfully'}), 200

@user_bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    """Password reset endpoint"""
    data = request.json
    email = data.get('email')

    # Mock password reset process
    # Check if email exists in users_db
    for user in users_db.values():
        if user['email'] == email:
            return jsonify({'message': 'Password reset link sent to your email'}), 200
    return jsonify({'error': 'Email not found'}), 404
