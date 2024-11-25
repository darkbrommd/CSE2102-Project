"""
Test suite for the Pets API.

This module contains unit tests for the Pets API, including:
- Setting up a test client with a temporary database
- Seeding initial test data
- Testing various endpoints and functionalities of the Pets API
"""

# tests/test_pets.py

import os
import pytest
from flask import Flask
from backend.main import db
from backend.models import Pet
from backend.pets import pets_bp

@pytest.fixture
def client():
    """Set up a test client with a temporary database."""
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["PET_UPLOAD_FOLDER"] = "test_uploads"  # Mock upload folder for photos
    db.init_app(app)
    app.register_blueprint(pets_bp)

    with app.app_context():
        db.create_all()
        # Seed initial test data
        pet1 = Pet(name="Buddy", species="Dog", breed="Labrador", available_for_adoption=True)
        pet2 = Pet(name="Kitty", species="Cat", breed="Siamese", available_for_adoption=False)
        db.session.add_all([pet1, pet2])
        db.session.commit()

    with app.test_client() as client:
        yield client

    # Clean up uploaded files after tests
    if os.path.exists("test_uploads"):
        for file in os.listdir("test_uploads"):
            os.remove(os.path.join("test_uploads", file))
        os.rmdir("test_uploads")


def test_get_all_pets(client):
    """Test fetching all pets."""
    response = client.get("/pets")
    assert response.status_code == 200
    pets = response.get_json()
    assert len(pets) == 2
    assert any(pet["name"] == "Buddy" for pet in pets)


def test_get_pet_by_id(client):
    """Test fetching a pet by its ID."""
    response = client.get("/pets/1")
    assert response.status_code == 200
    pet = response.get_json()
    assert pet["name"] == "Buddy"

    response = client.get("/pets/999")  # Nonexistent pet ID
    assert response.status_code == 404
    assert response.get_json()["error"] == "Pet not found"


def test_delete_pet(client):
    """Test deleting a pet."""
    response = client.delete("/delete_pet/1")
    assert response.status_code == 200
    assert response.get_json()["message"] == "Pet deleted successfully"

    # Try deleting the same pet again
    response = client.delete("/delete_pet/1")
    assert response.status_code == 404
    assert response.get_json()["error"] == "Pet not found"
