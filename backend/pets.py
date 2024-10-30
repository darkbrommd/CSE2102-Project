from flask import Blueprint, jsonify, request
from models import Pet
from main import db

pets_bp = Blueprint('pets', __name__)

@pets_bp.route('/pets', methods=['GET'])
def get_all_pets():
    """Fetch all pets from the database"""
    pets = Pet.query.all()
    return jsonify([pet.to_dict() for pet in pets]), 200

@pets_bp.route('/pets', methods=['POST'])
def add_pet():
    """Add a new pet to the database"""
    data = request.json
    new_pet = Pet(
        name=data['name'],
        species=data['species'],
        breed=data.get('breed'),
        age=data.get('age'),
        size=data.get('size'),
        location=data.get('location'),
        gender=data.get('gender'),
        special_needs=data.get('special_needs', False),
        available_for_adoption=data.get('available_for_adoption', True)
    )
    db.session.add(new_pet)
    db.session.commit()
    return jsonify({"message": "Pet added successfully", "pet": new_pet.to_dict()}), 201

@pets_bp.route('/pets/<int:pet_id>', methods=['GET'])
def get_pet_by_id(pet_id):
    """Fetch pet details by ID from the database"""
    pet = Pet.query.get(pet_id)
    if pet:
        return jsonify(pet.to_dict()), 200
    return jsonify({"error": "Pet not found"}), 404
