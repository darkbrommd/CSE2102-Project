"""
Test suite for the Adoption API.

This module contains unit tests
- Retrieving adoptable pets
- Submitting adoption applications
- Checking the adoption status of pets
- Canceling adoptions
"""

# pylint: disable=redefined-outer-name
# pylint: disable=duplicate-code

import hashlib
import pytest
from flask import Flask
from backend.main import db
from backend.models import User, Pet
from backend.adopt import adopt_bp


# Helper function to create a test user
def create_test_user():
    """
    Create a mock user for testing purposes.

    Returns:
        User: A mock user object with predefined attributes.
    """
    password_hash = hashlib.sha256("dummy_password".encode()).hexdigest()
    return User(
        id=1,
        username="testuser",
        email="testuser@example.com",
        password_hash=password_hash
    )


# Helper function to create test pets
def create_test_pets():
    """
    Create mock pets for testing purposes.

    Returns:
        list: A list of mock pet objects with predefined attributes.
    """
    return [
        Pet(id=1, name="Fluffy", species="Cat", available_for_adoption=True),
        Pet(id=2, name="Spike", species="Dog", available_for_adoption=False),
    ]


@pytest.fixture
def client():
    """
    Set up a test client for the Flask application with a temporary in-memory database.

    Yields:
        FlaskClient: A test client for the Flask application.
    """
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    db.init_app(app)
    app.register_blueprint(adopt_bp)

    with app.app_context():
        db.create_all()
        # Set up basic data for testing with required fields
        user = create_test_user()
        pets = create_test_pets()
        db.session.add(user)
        db.session.add_all(pets)
        db.session.commit()

    with app.test_client() as client:
        yield client


def test_get_adoptable_pets(client):
    """
    Test retrieving all pets available for adoption.

    Asserts:
        - The response status code is 200.
        - The pet "Fluffy" is present in the response.
    """
    response = client.get("/adopt/applications")
    assert response.status_code == 200
    assert any(pet["name"] == "Fluffy" for pet in response.get_json())


def test_apply_for_nonexistent_pet(client):
    """
    Test submitting an adoption application for a nonexistent pet.

    Asserts:
        - The response status code is 404.
        - The error message indicates the pet is not found.
    """
    response = client.post("/adopt/999", json={"user_id": 1})
    assert response.status_code == 404
    assert response.get_json()["error"] == "Pet not found"


def test_apply_for_already_adopted_pet(client):
    """
    Test submitting an adoption application for an already adopted pet.

    Asserts:
        - The response status code is 400.
        - The error message indicates the pet is already adopted.
    """
    response = client.post("/adopt/2", json={"user_id": 1})
    assert response.status_code == 400
    assert response.get_json()["error"] == "Pet is already adopted"
