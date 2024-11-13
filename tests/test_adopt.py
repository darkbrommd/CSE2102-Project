# pylint: disable=redefined-outer-name
import pytest
from flask import Flask
from backend.main import db
from backend.models import User, Pet, Adoption
from backend.adopt import adopt_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # In-memory database for testing
    db.init_app(app)
    app.register_blueprint(adopt_bp)

    with app.app_context():
        db.create_all()
        # Set up basic data for testing
        user = User(id=1, username="testuser")
        pet1 = Pet(id=1, name="Fluffy", species="Cat", available_for_adoption=True)
        pet2 = Pet(id=2, name="Spike", species="Dog", available_for_adoption=False)
        db.session.add_all([user, pet1, pet2])
        db.session.commit()

    with app.test_client() as client:
        yield client

def test_get_adoptable_pets(client):
    """Test fetching all adoptable pets."""
    response = client.get('/adopt/applications')
    assert response.status_code == 200
    adoptable_pets = response.get_json()
    assert any(pet['name'] == "Fluffy" for pet in adoptable_pets)

def test_apply_for_adoption(client):
    """Test applying for adoption of an available pet."""
    response = client.post('/adopt/1', json={'user_id': 1})
    assert response.status_code == 201
    data = response.get_json()
    assert "Adoption application submitted successfully" in data["message"]

def test_apply_for_nonexistent_pet(client):
    """Test applying for adoption of a non-existent pet."""
    response = client.post('/adopt/999', json={'user_id': 1})
    assert response.status_code == 404
    assert response.get_json()["error"] == "Pet not found"

def test_apply_for_already_adopted_pet(client):
    """Test applying for adoption of a pet that is already adopted."""
    response = client.post('/adopt/2', json={'user_id': 1})
    assert response.status_code == 400
    assert response.get_json()["error"] == "Pet is already adopted"

def test_get_adoption_status(client):
    """Test retrieving the adoption status of a specific pet."""
    response = client.get('/adopt/status/1')
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "Available"

    # Simulate pet adoption
    client.post('/adopt/1', json={'user_id': 1})
    response = client.get('/adopt/status/1')
    assert response.get_json()["status"] == "Adopted"

def test_get_adoption_status_for_nonexistent_pet(client):
    """Test getting adoption status for a non-existent pet."""
    response = client.get('/adopt/status/999')
    assert response.status_code == 404
    assert response.get_json()["error"] == "Pet not found"

def test_cancel_adoption(client):
    """Test canceling an adoption."""
    # Adopt the pet first
    client.post('/adopt/1', json={'user_id': 1})

    # Cancel the adoption
    response = client.post('/adopt/cancel/1')
    assert response.status_code == 200
    assert "has been canceled" in response.get_json()["message"]

def test_cancel_adoption_for_nonexistent_pet(client):
    """Test canceling an adoption for a non-existent pet."""
    response = client.post('/adopt/cancel/999')
    assert response.status_code == 404
    assert response.get_json()["error"] == "Pet not found"

def test_cancel_adoption_for_available_pet(client):
    """Test canceling an adoption for a pet that is already available."""
    response = client.post('/adopt/cancel/1')
    assert response.status_code == 400
    assert response.get_json()["error"] == "Pet is already available for adoption"
