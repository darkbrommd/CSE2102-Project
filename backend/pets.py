"""Routes and functions for managing pet information."""

import os
from flask import Blueprint, jsonify, request, current_app
from flasgger import swag_from
from werkzeug.utils import secure_filename
from backend.models import Pet
from backend.db import db

pets_bp = Blueprint('pets', __name__)

# Function to check file extension
def allowed_file(filename):
    """Check if the file has an allowed extension."""
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@pets_bp.route('/pets', methods=['GET'])
@swag_from('api_docs/pets/get_all_pets.yml')
def get_all_pets():
    """Fetch all pets from the database."""
    pets = Pet.query.all()
    return jsonify([pet.to_dict() for pet in pets]), 200


@pets_bp.route('/add_pet', methods=['POST'])
@swag_from('api_docs/pets/pets.yml')
def add_pet():
    """Add a new pet to the database."""
    data = request.get_json()

    # Ensure data was received
    if not data:
        return jsonify({"error": "Request must contain JSON data"}), 400

    # Validate required fields
    required_fields = ['name', 'species']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    # Optional fields with default values
    new_pet = Pet(
        name=data['name'],
        species=data['species'],
        breed=data.get('breed'),
        age=data.get('age', None),
        size=data.get('size', None),
        location=data.get('location', None),
        gender=data.get('gender', None),
        special_needs=data.get('special_needs', False),
        available_for_adoption=data.get('available_for_adoption', True)
    )
    db.session.add(new_pet)
    db.session.commit()
    return jsonify({"message": "Pet added successfully", "pet": new_pet.to_dict()}), 201

@pets_bp.route('/pets/<int:pet_id>', methods=['GET'])
def get_pet_by_id(pet_id):
    """Fetch pet details by ID."""
    pet = Pet.query.get(pet_id)
    if pet:
        # Update the `photo` field to return the frontend-relative path
        return jsonify({
            "id": pet.id,
            "name": pet.name,
            "breed": pet.breed,
            "age": pet.age,
            "size": pet.size,
            "location": pet.location,
            "gender": pet.gender,
            "photo": pet.photo or "public/images/default-pet.png",  # Default image
            "about": pet.about,
        }), 200
    return jsonify({"error": "Pet not found"}), 404

@pets_bp.route('/update_pet/<int:pet_id>', methods=['PUT'])
@swag_from('api_docs/pets/update_pet.yml')
def update_pet(pet_id):
    """Update pet details by ID, including an optional photo update."""
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    data = request.form
    photo_path = pet.photo  # Keep the existing photo if no new photo is uploaded

    # Handle new photo upload
    if 'photo' in request.files:
        file = request.files['photo']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            photo_path = os.path.join(current_app.config['PET_UPLOAD_FOLDER'], filename)
            file.save(photo_path)
        else:
            return jsonify({"error": "Invalid file type"}), 400

    # Update pet attributes
    pet.name = data.get('name', pet.name)
    pet.species = data.get('species', pet.species)
    pet.breed = data.get('breed', pet.breed)
    pet.age = data.get('age', pet.age)
    pet.size = data.get('size', pet.size)
    pet.location = data.get('location', pet.location)
    pet.gender = data.get('gender', pet.gender)
    pet.special_needs = data.get('special_needs', str(pet.special_needs)).lower() == 'true'
    pet.available_for_adoption = (
        data.get('available_for_adoption', str(pet.available_for_adoption))
        .lower() == 'true'
    )
    pet.photo = photo_path

    db.session.commit()
    return jsonify({"message": "Pet updated successfully", "pet": pet.to_dict()}), 200

@pets_bp.route('/delete_pet/<int:pet_id>', methods=['DELETE'])
@swag_from('api_docs/pets/delete_pet.yml')
def delete_pet(pet_id):
    """Delete a pet by ID provided as a path parameter."""
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    # Delete photo file from server if it exists
    if pet.photo and os.path.exists(pet.photo):
        os.remove(pet.photo)

    db.session.delete(pet)
    db.session.commit()
    return jsonify({"message": "Pet deleted successfully"}), 200
