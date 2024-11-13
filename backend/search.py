"""This module provides search functionality for finding pets based on various criteria."""

from flask import Blueprint, jsonify, request
from flasgger import swag_from
from backend.models import Pet

search_bp = Blueprint('search', __name__)

@search_bp.route('/search', methods=['GET'])
@swag_from('api_docs/search/search_pets.yml')
def search_pets():
    """Search for pets by various criteria in the database"""

    # Retrieve query parameters
    species = request.args.get('species')
    breed = request.args.get('breed')
    age = request.args.get('age')
    size = request.args.get('size')
    location = request.args.get('location')
    gender = request.args.get('gender')
    special_needs = request.args.get('special_needs')
    availability = request.args.get('availability')

    # Build the query dynamically based on filters
    query = Pet.query
    if species:
        query = query.filter(Pet.species.ilike(f"%{species}%"))
    if breed:
        query = query.filter(Pet.breed.ilike(f"%{breed}%"))
    if age:
        query = query.filter(Pet.age.ilike(f"%{age}%"))
    if size:
        query = query.filter(Pet.size.ilike(f"%{size}%"))
    if location:
        query = query.filter(Pet.location.ilike(f"%{location}%"))
    if gender:
        query = query.filter(Pet.gender.ilike(f"%{gender}%"))
    if special_needs is not None:
        special_needs_bool = special_needs.lower() == 'true'
        query = query.filter(Pet.special_needs == special_needs_bool)
    if availability is not None:
        availability_bool = availability.lower() == 'true'
        query = query.filter(Pet.available_for_adoption == availability_bool)

    # Execute the query and return results
    pets = query.all()
    return jsonify([pet.to_dict() for pet in pets]), 200
