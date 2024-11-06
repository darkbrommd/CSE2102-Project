"""
Adoption API module for handling pet adoptions.
Provides endpoints for viewing adoptable pets, applying for adoption,
checking adoption status, and canceling adoptions.
"""

from flask import Blueprint, jsonify, request
from models import User, Pet, Adoption
from flasgger import swag_from
from db import db

adopt_bp = Blueprint('adopt', __name__)

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

@adopt_bp.route('/adopt/cancel/<int:pet_id>', methods=['POST'])
@swag_from('api_docs/adoption/cancel_adoption.yml')
def cancel_adoption(pet_id):
    """Cancel an adoption application, making the pet available again."""
    # Find the pet by pet_id
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404
    if pet.available_for_adoption:
        return jsonify({"error": "Pet is already available for adoption"}), 400

    # Find the adoption record for the pet
    adoption = Adoption.query.filter_by(pet_id=pet_id).first()
    if not adoption:
        return jsonify({"error": "Adoption record not found"}), 404

    # Mark the pet as available again
    pet.available_for_adoption = True

    # Remove the adoption record
    db.session.delete(adoption)
    db.session.commit()

    return jsonify({"message": f"Adoption application for {pet.name} has been canceled."}), 200
