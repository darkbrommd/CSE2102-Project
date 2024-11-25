"""
Test suite for Donation API.

This module contains unit tests for the following endpoints:
- Adding a new donation
- Fetching recent donations
"""

import pytest
from flask import Flask
from backend.models import Donation
from backend.db import db
from backend.donate import donation_bp

@pytest.fixture
def test_client():
    """
    Set up a test client for the Flask application with a temporary in-memory database.
    Yields:
        Flask test client
    """
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    db.init_app(app)
    app.register_blueprint(donation_bp)

    with app.app_context():
        db.create_all()
        # Add some sample data
        donation1 = Donation(
            user="John Doe",
            amount=100.00,
            frequency="One-time",
            email="john@example.com",
            phone="1234567890",
            card_number="4111111111111111",
            expiry="12/24",
            cvv="123",
            billing_address="123 Test Street",
            zip_code="12345",
            dedication="For a good cause",
            anonymous=False,
            employer="Tech Corp",
            subscribe=True,
            consent=True,
            tax_receipt=True
        )
        donation2 = Donation(
            user="Jane Smith",
            amount=50.00,
            frequency="Monthly",
            email="jane@example.com",
            phone="9876543210",
            card_number="4222222222222222",
            expiry="11/25",
            cvv="456",
            billing_address="456 Another Ave",
            zip_code="67890",
            dedication="In memory of a friend",
            anonymous=True,
            employer=None,
            subscribe=False,
            consent=True,
            tax_receipt=True
        )
        db.session.add_all([donation1, donation2])
        db.session.commit()

    with app.test_client() as client:
        yield client  # Renamed to avoid name conflict


def test_add_donation_success(test_client):
    """
    Test adding a new donation successfully.
    Asserts:
        - The response status code is 201.
        - The response contains the donation details.
    """
    payload = {
        "name": "Alice Johnson",
        "donationAmount": 200.00,
        "frequency": "One-time",
        "email": "alice@example.com",
        "phone": "5551234567",
        "cardNumber": "4333333333333333",
        "expiry": "10/26",
        "cvv": "789",
        "billingAddress": "789 Some Blvd",
        "zipCode": "54321",
        "dedication": "Helping hands",
        "anonymous": False,
        "employer": "Charity Inc.",
        "subscribe": True,
        "consent": True,
        "taxReceipt": True
    }
    response = test_client.post("/add_donation", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Donation added successfully"
    assert data["donation"]["user"] == "Alice Johnson"
    assert data["donation"]["amount"] == 200.00


def test_add_donation_missing_fields(test_client):
    """
    Test adding a donation with missing required fields.
    Asserts:
        - The response status code is 400.
        - The response contains an appropriate error message.
    """
    payload = {
        "name": "Bob Wilson",
        "donationAmount": 150.00,
        "email": "bob@example.com"
        # Missing required fields
    }
    response = test_client.post("/add_donation", json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert "Missing required fields" in data["error"]
