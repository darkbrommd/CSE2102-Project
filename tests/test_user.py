"""
Test suite for the User API.

This module contains unit tests for the User API, including:
- Setting up a test client with a temporary database
- Seeding initial test data
- Testing various endpoints and functionalities of the User API
"""

# tests/test_user.py

import os
import pytest
from flask import Flask
from flask_jwt_extended import JWTManager
from backend.main import db
from backend.models import User
from backend.user import user_bp


@pytest.fixture
def client():
    """Set up a test client with a temporary database."""
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["JWT_SECRET_KEY"] = "test-secret"
    app.config["PROFILE_PICTURE_FOLDER"] = "test_profile_pictures"

    db.init_app(app)
    JWTManager(app)  #  Initialize without assigning to a variable
    app.register_blueprint(user_bp)

    with app.app_context():
        db.create_all()
        # Seed initial test data
        test_user = User(
            username="testuser",
            email="test@example.com",
            zip_code="12345",
            profile_picture="images/default/default-profile-pic.png",
        )
        test_user.set_password("password123")
        db.session.add(test_user)
        db.session.commit()

    with app.test_client() as client:
        yield client

    # Clean up test profile pictures
    if os.path.exists(app.config["PROFILE_PICTURE_FOLDER"]):
        for file in os.listdir(app.config["PROFILE_PICTURE_FOLDER"]):
            os.remove(os.path.join(app.config["PROFILE_PICTURE_FOLDER"], file))
        os.rmdir(app.config["PROFILE_PICTURE_FOLDER"])


def test_signup(client):
    """Test the signup endpoint."""
    response = client.post(
        "/signup",
        data={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
            "zip_code": "54321",
        },
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "User registered successfully"
    assert data["user"]["username"] == "newuser"


def test_signup_existing_user(client):
    """Test signup with an existing username or email."""
    response = client.post(
        "/signup",
        data={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
            "zip_code": "54321",
        },
    )
    assert response.status_code == 409
    assert "already exists" in response.get_json()["error"]


def test_login(client):
    """Test the login endpoint."""
    response = client.post(
        "/login", json={"username": "testuser", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Login successful"
    assert "token" in data


def test_login_invalid_credentials(client):
    """Test login with invalid credentials."""
    response = client.post(
        "/login", json={"username": "testuser", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.get_json()["error"] == "Invalid credentials"


def test_get_profile(client):
    """Test fetching the current user's profile."""
    login_response = client.post(
        "/login", json={"username": "testuser", "password": "password123"}
    )
    token = login_response.get_json()["token"]

    response = client.get(
        "/get-profile", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data["name"] == "testuser"


def test_add_favorite(client):
    """Test adding a pet to the user's favorites."""
    login_response = client.post(
        "/login", json={"username": "testuser", "password": "password123"}
    )
    token = login_response.get_json()["token"]

    response = client.post(
        "/add-favorite",
        json={"pet_id": 1},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.get_json()["message"] == "Pet added to favorites"
