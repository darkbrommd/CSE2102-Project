"""User-related API endpoints for registration, login, profile management, and deletion."""

import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from backend.models import User
from flasgger import swag_from
from db import db

user_bp = Blueprint('user', __name__)

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@user_bp.route('/signup', methods=['POST'])
@swag_from('api_docs/user/signup.yml')
def signup():
    """User registration endpoint"""
    data = request.get_json()  # Get JSON data from the request

    # Extract fields from the request
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    zip_code = data.get('zip_code')

    # Check for missing fields
    if not username or not password or not email:
        return jsonify({"error": "Username, password, and email are required."}), 400

    # Check if username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    # Create a new user instance and set the password
    new_user = User(username=username, email=email, zip_code=zip_code)
    new_user.set_password(password)  # Hash the password

    # Save the user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user": new_user.to_dict()}), 201

@user_bp.route('/login', methods=['POST'])
@swag_from('api_docs/user/login.yml')
def login():
    """User login endpoint."""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Authenticate user
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@user_bp.route('/change_profile', methods=['POST'])
@swag_from('api_docs/user/change_profile.yml')
def change_profile():
    """User profile update endpoint"""
    data = request.get_json()

    # Authenticate the user
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Update fields if provided
    new_password = data.get('new_password')
    email = data.get('email')
    zip_code = data.get('zip_code')

    if new_password:
        user.set_password(new_password)  # Hash and set new password
    if email:
        user.email = email
    if zip_code:
        user.zip_code = zip_code

    # Handle profile picture upload
    if 'profile_picture' in request.files:
        file = request.files['profile_picture']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            profile_folder = current_app.config['PROFILE_UPLOAD_FOLDER']
            profile_picture_path = os.path.join(profile_folder, filename)
            file.save(profile_picture_path)  # Save file to server
            user.profile_picture = profile_picture_path
        else:
            return jsonify({'error': 'Invalid file type'}), 400

    # Save changes to the database
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully', 'user': user.to_dict()}), 200

@user_bp.route('/forgot_password', methods=['POST'])
@swag_from('api_docs/user/forgot_password.yml')
def forgot_password():
    """Password reset endpoint."""
    data = request.json
    email = data.get('email')

    # Find user by email
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'message': 'Password reset link sent to your email'}), 200
    return jsonify({'error': 'Email not found'}), 404

@user_bp.route('/delete_user', methods=['DELETE'])
@swag_from('api_docs/user/delete_user.yml')
def delete_user():
    """Delete a user by ID from query parameter"""
    user_id = request.args.get('user_id', type=int)

    if user_id is None:
        return jsonify({"error": "User ID not provided"}), 400

    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    return jsonify({"error": "User not found"}), 404
