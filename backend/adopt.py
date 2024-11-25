"""
Adoption API module for handling pet adoptions.
Provides endpoints for viewing adoptable pets, applying for adoption,
checking adoption status, and canceling adoptions.
"""
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from backend.models import User, Pet, Adoption
from backend.db import db


adopt_bp = Blueprint('adopt', __name__)

@adopt_bp.route('/submit-application', methods=['POST'])
@jwt_required()
def submit_application():
    """Submit a pet adoption application."""
    data = request.get_json()

    # Validate required fields
    required_fields = [
        'pet_id', 'adopter_name', 'address', 'zip_code',
        'email', 'phone_number', 'date_time', 'duration'
    ]
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    # Validate date_time format
    try:
        datetime_obj = datetime.strptime(data['date_time'], "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return jsonify({"error": "Invalid date_time format. Use 'YYYY-MM-DD HH:MM:SS'"}), 400

    # Check if the pet exists
    pet = Pet.query.get(data['pet_id'])
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    # Check if the user exists
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Create a new Adoption instance using unpacked data
    try:
        new_adoption = Adoption(
            **{
                "user_id": user_id,
                "pet_id": data['pet_id'],
                "adopter_name": data['adopter_name'],
                "address": data['address'],
                "address2": data.get('address2', ''),  # Optional
                "zip_code": data['zip_code'],
                "email": data['email'],
                "phone_number": data['phone_number'],
                "additional_comments": data.get('additional_comments', ''),  # Optional
                "date_adopted": datetime_obj,
                "duration": data['duration']
            }
        )

        # Save the adoption record to the database
        db.session.add(new_adoption)
        db.session.commit()

        return jsonify({
            "message": "Adoption application submitted successfully!",
            "adoption": new_adoption.to_dict()
        }), 201

    except SQLAlchemyError as e:
        print(f"Error saving adoption: {e}")
        return jsonify({"error": "Failed to submit the adoption application."}), 500

@adopt_bp.route('/my-adoptions', methods=['GET'])
@jwt_required()
def get_user_adoptions():
    """
    Fetch all adoptions for the currently authenticated user.
    """
    try:
        # Get the authenticated user's ID
        user_id = get_jwt_identity()

        # Fetch all adoptions for the user
        adoptions = (
            db.session.query(Adoption, Pet)
            .join(Pet, Adoption.pet_id == Pet.id)
            .filter(Adoption.user_id == user_id)
            .all()
        )

        # Format the response
        response_data = []
        for adoption, pet in adoptions:
            response_data.append({
                "id": adoption.id,
                "petName": pet.name,
                "petBreed": pet.breed,
                "status": "Pending",  # Add logic for real status if available
                "dateAdopted": adoption.date_adopted.isoformat(),
                "petImage": pet.photo if pet.photo else "/images/default/default-pet.png",
            })

        return jsonify({"adoptions": response_data}), 200

    except SQLAlchemyError as e:
        print(f"Error fetching adoptions: {e}")
        return jsonify({"error": "Failed to fetch adoptions."}), 500

@adopt_bp.route('/adoption/<int:adoption_id>', methods=['GET'])
@jwt_required()
def get_adoption_details(adoption_id):
    """Get the details of a specific adoption."""
    try:
        # Get the authenticated user's ID
        user_id = get_jwt_identity()

        # Fetch the adoption record and associated pet details
        adoption = db.session.query(Adoption, Pet).join(Pet, Adoption.pet_id == Pet.id).filter(
            Adoption.id == adoption_id,
            Adoption.user_id == user_id  # Ensure the user is authorized to view this adoption
        ).first()

        if not adoption:
            return jsonify({"error": "Adoption not found or unauthorized access."}), 404

        # Extract adoption and pet details
        adoption, pet = adoption

        # Prepare the response
        response_data = {
            "id": adoption.id,
            "adopter_name": adoption.adopter_name,
            "adopter_contact": adoption.email,
            "adopter_address": f"{adoption.address} {adoption.address2}".strip(),
            "additional_comments": adoption.additional_comments,
            "date_adopted": adoption.date_adopted.isoformat(),
            "status": "Pending",  # Modify to reflect real status if available
            "pet": {
                "name": pet.name,
                "breed": pet.breed,
                "age": pet.age,
                "gender": pet.gender,
                "description": pet.about,
                "photo": pet.photo if pet.photo else "/images/default/default-pet.png",
            },
            "meeting": {
                "date": adoption.date_adopted.isoformat().split("T")[0],
                "time": adoption.date_adopted.isoformat().split("T")[1],
                "duration": adoption.duration,
                "status": "Confirmed",
            },
        }

        return jsonify({"adoption": response_data}), 200

    except SQLAlchemyError as e:
        print(f"Error fetching adoption details: {e}")
        return jsonify({"error": "Failed to fetch adoption details."}), 500

@adopt_bp.route('/adoption/<int:adoption_id>/cancel-adoption', methods=['DELETE'])
@jwt_required()
def cancel_adoption(adoption_id):
    """Cancel the adoption and delete the record."""
    try:
        # Get the current user
        user_id = get_jwt_identity()

        # Find the adoption record
        adoption = Adoption.query.filter_by(id=adoption_id, user_id=user_id).first()
        if not adoption:
            return jsonify({"error": "Adoption record not found."}), 404

        # Delete the adoption record
        db.session.delete(adoption)
        db.session.commit()

        return jsonify({"message": "Adoption canceled successfully!"}), 200
    except SQLAlchemyError as e:
        print(f"Error canceling adoption: {e}")
        return jsonify({"error": "Failed to cancel the adoption."}), 500

@adopt_bp.route('/adopt/applications', methods=['GET'])
@swag_from('api_docs/adoption/get_adoptable_pets.yml')
def get_adoptable_pets():
    """Fetch all pets available for adoption from the database."""
    adoptable_pets = Pet.query.filter_by(available_for_adoption=True).all()
    return jsonify([pet.to_dict() for pet in adoptable_pets]), 200

@adopt_bp.route('/adopt/<int:pet_id>', methods=['POST'])
@swag_from('api_docs/adoption/adoption.yml')
def apply_for_adoption(pet_id):
    """Submit an adoption application for a specific pet."""
    data = request.json
    user_id = data.get('user_id')

    # Validate user ID
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Validate pet ID
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404
    if not pet.available_for_adoption:
        return jsonify({"error": "Pet is already adopted"}), 400

    # Mark pet as adopted
    pet.available_for_adoption = False

    # Record the adoption in the Adoption table
    adoption = Adoption(pet_id=pet.id, user_id=user.id)
    db.session.add(adoption)
    db.session.commit()

    return jsonify({
        "message": f"Adoption application submitted successfully for {pet.name} by {user.username}."
    }), 201

@adopt_bp.route('/adopt/status/<int:pet_id>', methods=['GET'])
@swag_from('api_docs/adoption/get_adoption_status.yml')
def get_adoption_status(pet_id):
    """Check the adoption status of a specific pet."""
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    status = "Available" if pet.available_for_adoption else "Adopted"
    return jsonify({"pet_id": pet.id, "name": pet.name, "status": status}), 200
