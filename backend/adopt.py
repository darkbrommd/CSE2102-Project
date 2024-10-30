from flask import Blueprint, jsonify, request
from models import Pet
from main import db

adopt_bp = Blueprint('adopt', __name__)

@adopt_bp.route('/adopt/applications', methods=['GET'])
def get_adoptable_pets():
    """Fetch all pets available for adoption from the database"""
    adoptable_pets = Pet.query.filter_by(available_for_adoption=True).all()
    return jsonify([pet.to_dict() for pet in adoptable_pets]), 200

@adopt_bp.route('/adopt/<int:pet_id>', methods=['POST'])
def apply_for_adoption(pet_id):
    """Submit an adoption application for a specific pet"""
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404
    if not pet.available_for_adoption:
        return jsonify({"error": "Pet is already adopted"}), 400

    pet.available_for_adoption = False # mark pet as adopted
    db.session.commit()

    return jsonify({"message": f"Adoption application submitted successfully for {pet.name}."}), 201

@adopt_bp.route('/adopt/status/<int:pet_id>', methods=['GET'])
def get_adoption_status(pet_id):
    """Check the adoption status of a specific pet"""
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    status = "Available" if pet.available_for_adoption else "Adopted"
    return jsonify({"pet_id": pet.id, "name": pet.name, "status": status}), 200

@adopt_bp.route('/adopt/cancel/<int:pet_id>', methods=['POST'])
def cancel_adoption(pet_id):
    """Cancel an adoption application, making the pet available again"""
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404
    if pet.available_for_adoption:
        return jsonify({"error": "Pet is already available for adoption"}), 400
    
    pet.available_for_adoption = True # mark pet as available
    db.session.commit()

    return jsonify({"message": f"Adoption application for {pet.name} has been canceled."}), 200
