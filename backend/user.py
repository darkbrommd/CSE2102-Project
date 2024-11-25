"""User-related API endpoints for registration, login, profile management, and deletion."""

import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flasgger import swag_from
from backend.models import User
from backend.db import db
from backend.models import Pet
from backend.config import allowed_file

user_bp = Blueprint('user', __name__)



@user_bp.route('/signup', methods=['POST'])
@swag_from('api_docs/user/signup.yml')
def signup():
    """User registration endpoint."""

    # Get the data and optional file
    data = request.form
    profile_picture = request.files.get('profile_picture')

    # Get user data
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    zip_code = data.get('zip_code')

    # Validate required fields
    if not username or not password or not email:
        return jsonify({"error": "Username, password, and email are required."}), 400

    # Check if username or email already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    # Set the default profile picture path
    default_picture_path = 'images/default/default-profile-pic.png'

    # Save profile picture if provided
    if profile_picture and allowed_file(profile_picture.filename):
        # Create profile-pictures directory if it doesn't exist
        profile_picture_folder = os.path.join(
        os.getcwd(), 'frontend', 'public', 'images', 'profile-pictures'
        )
        if not os.path.exists(profile_picture_folder):
            os.makedirs(profile_picture_folder)

        filename = secure_filename(profile_picture.filename)
        file_path = os.path.join('images/profile-pictures', filename)
        absolute_path = os.path.join(profile_picture_folder, filename)

        # Save the file to the frontend directory
        profile_picture.save(absolute_path)
    else:
        file_path = default_picture_path  # Use default profile picture

    # Create a new user
    new_user = User(username=username, email=email, zip_code=zip_code, profile_picture=file_path)
    new_user.set_password(password)

    # Save the user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": new_user.to_dict()
    }), 201

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
        # Create a JWT token with a JSON-serializable identity
        token = create_access_token(identity=str(user.id))

        # Return token and user info
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200

    return jsonify({'error': 'Invalid credentials'}), 401

@user_bp.route('/get-profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Fetch the current user's profile."""
    current_user_id = get_jwt_identity()  # Get the authenticated user ID
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "name": user.username,
        "profilePic": user.profile_picture or 'images/default/default-profile-pic.png',
        "email": user.email,
        "zipCode": user.zip_code
    }), 200

@user_bp.route('/add-favorite', methods=['POST'])
@jwt_required()
def add_favorite():
    """Add a pet to the user's favorites."""
    current_user_id = get_jwt_identity()  # This returns the user ID as a string
    user = User.query.get(int(current_user_id))  # Fetch the user object

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    pet_id = data.get("pet_id")

    if not pet_id:
        return jsonify({"error": "Pet ID is required"}), 400

    # Check if the pet is already in the user's favorites
    if pet_id not in user.favorites:
        # Replace the favorites list to ensure changes are tracked
        user.favorites = user.favorites + [pet_id]
        db.session.add(user)  # Mark the user object as updated
        db.session.commit()  # Commit changes to the database
        return jsonify({"message": "Pet added to favorites", "favorites": user.favorites}), 200

    return jsonify({"message": "Pet is already in favorites", "favorites": user.favorites}), 200

@user_bp.route('/remove-favorite', methods=['POST'])
@jwt_required()
def remove_favorite():
    """Remove a pet from the user's favorites."""
    current_user_id = get_jwt_identity()  # This returns the user ID as a string
    user = User.query.get(int(current_user_id))  # Fetch the user object

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    pet_id = str(data.get("pet_id"))  # Ensure pet_id is a string

    if not pet_id:
        return jsonify({"error": "Pet ID is required"}), 400

    # Check if the pet is in the user's favorites
    if pet_id in user.favorites:
        # Recreate the favorites list to track the change
        user.favorites = [fav for fav in user.favorites if fav != pet_id]
        db.session.add(user)  # Mark the user object as updated
        db.session.commit()  # Commit changes to the database
        return jsonify({"message": "Pet removed from favorites", "favorites": user.favorites}), 200

    return jsonify({"message": "Pet not in favorites", "favorites": user.favorites}), 200

@user_bp.route('/get-favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    """Fetch the user's favorite pets."""
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Assuming `favorites` stores a list of pet IDs
    pet_ids = user.favorites
    if not pet_ids:
        return jsonify([]), 200  # Return an empty list if no favorites

    # Fetch pets based on IDs
    pets = Pet.query.filter(Pet.id.in_(pet_ids)).all()

    # Convert pet objects to dictionaries
    favorites = [
        {
            "id": pet.id,
            "name": pet.name,
            "species": pet.species,
            "breed": pet.breed,
            "age": pet.age,
            "size": pet.size,
            "location": pet.location,
            "gender": pet.gender,
            "special_needs": pet.special_needs,
            "available_for_adoption": pet.available_for_adoption,
            "date_added": pet.date_added.isoformat() if pet.date_added else None,
            "photo": pet.photo or "/images/default/default-pet.png",
            "about": pet.about,
        }
        for pet in pets
    ]

    return jsonify(favorites), 200

@user_bp.route('/change_profile', methods=['POST'])
@swag_from('api_docs/user/change_profile.yml')
@jwt_required()  # Ensure the user is authenticated
def change_profile():
    """User profile update endpoint"""

    # Get the authenticated user's ID from JWT
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Get form data
    data = request.form
    profile_picture = request.files.get('profile_picture')  # Optional file upload

    # Update fields if provided
    username = data.get('username')
    email = data.get('email')
    zip_code = data.get('zip_code')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if username:
        user.username = username
    if email:
        # Ensure email is valid and not already taken by another user
        if (
            '@' not in email or 
            User.query.filter_by(email=email).filter(User.id != current_user_id).first()
        ):
            return jsonify({'error': 'Invalid or already registered email.'}), 400
        user.email = email
    if zip_code:
        # Ensure zip code is exactly 5 digits
        if not zip_code.isdigit() or len(zip_code) != 5:
            return jsonify({'error': 'Invalid ZIP code. Must be exactly 5 digits.'}), 400
        user.zip_code = zip_code

    # Handle password update
    if current_password and new_password:
        if not user.check_password(current_password):
            return jsonify({'error': 'Invalid current password'}), 401
        user.set_password(new_password)

    # Handle profile picture upload
    if profile_picture and allowed_file(profile_picture.filename):
        # Create profile-pictures directory if it doesn't exist
        profile_picture_folder = os.path.join(
            os.getcwd(), 'frontend', 'public', 'images', 'profile-pictures'
        )
        if not os.path.exists(profile_picture_folder):
            os.makedirs(profile_picture_folder)

        filename = secure_filename(profile_picture.filename)
        file_path = os.path.join('images/profile-pictures', filename)
        absolute_path = os.path.join(profile_picture_folder, filename)

        # Save the file to the frontend directory
        profile_picture.save(absolute_path)
        user.profile_picture = file_path  # Update the database field with the new path
    elif not profile_picture and not user.profile_picture:
        # If no new picture uploaded and no existing picture, set the default
        user.profile_picture = 'images/default/default-profile-pic.png'

    # Commit changes to the database
    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200

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

@user_bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    """Simulate sending a password reset link to the user's email."""
    data = request.get_json()

    # Extract email from the request
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email not provided"}), 400

    # Check if the email exists in the database
    user = User.query.filter_by(email=email).first()
    if not user:
        # If email does not exist, return a 404 error
        return jsonify({"error": "No account associated with this email"}), 404

    # Simulate acknowledgment of password reset (no actual email sent)
    return jsonify({"message": "A password reset link has been sent."}), 200
