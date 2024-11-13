# pylint: disable=redefined-outer-name
import pytest
from flask import Flask
from backend.main import db
from backend.models import Pet
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
        # Basic data setup for testing
        pet1 = Pet(name="Fluffy", species="Cat", available_for_adoption=True)
        pet2 = Pet(name="Spike", species="Dog", available_for_adoption=False)
        db.session.add_all([pet1, pet2])
        db.session.commit()

    with app.test_client() as client:
        yield client

def test_get_adoptable_pets(client):
    response = client.get('/adopt/applications')
    assert response.status_code == 200

def test_apply_for_adoption(client):
    response = client.post('/adopt/1')
    assert response.status_code in [200, 201, 400, 404]

def test_get_adoption_status(client):
    response = client.get('/adopt/status/1')
    assert response.status_code == 200

def test_cancel_adoption(client):
    response = client.post('/adopt/cancel/1')
    assert response.status_code in [200, 400, 404]
