from flask import Blueprint, jsonify, request
from flasgger import swag_from
from backend.models import Donation
from backend.db import db

donation_bp = Blueprint('donation', __name__)

@donation_bp.route('/recent_donations', methods=['GET'])
@swag_from('api_docs/donations/recent_donations.yml')
def get_recent_donations():
    """Fetch recent donations from the database"""
    limit = request.args.get('limit', default=5, type=int)  # Default to 5 most recent donations
    donations = Donation.query.order_by(Donation.date.desc()).limit(limit).all()
    # Use to_brief_dict() to get only the required fields
    return jsonify([donation.to_brief_dict() for donation in donations]), 200

@donation_bp.route('/add_donation', methods=['POST'])
@swag_from('api_docs/donations/add_donation.yml')
def add_donation():
    """Add a new donation to the database"""
    data = request.json

    # Check for required fields
    required_fields = ['name', 'donationAmount', 'frequency', 'email', 'cardNumber', 'expiry', 'cvv']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    try:
        new_donation = Donation(
            user=data['name'],
            amount=data['donationAmount'],
            frequency=data['frequency'],
            email=data['email'],
            phone=data['phone'],
            card_number=data['cardNumber'],
            expiry=data['expiry'],
            cvv=data['cvv'],
            billing_address=data['billingAddress'],
            zip_code=data['zipCode'],
            dedication=data['dedication'],
            anonymous=data['anonymous'],
            employer=data['employer'],
            subscribe=data['subscribe'],
            consent=data['consent'],
            tax_receipt=data['taxReceipt']
        )
        db.session.add(new_donation)
        db.session.commit()
        return jsonify({"message": "Donation added successfully", "donation": new_donation.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while processing your donation", "details": str(e)}), 500
