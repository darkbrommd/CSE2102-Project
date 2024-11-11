from flask import Blueprint, jsonify, request
from models import Donation
from flasgger import swag_from
from db import db

donation_bp = Blueprint('donation', __name__)

@donation_bp.route('/donations', methods=['GET'])
@swag_from('api_docs/donations/donations.yml')
def get_all_donations():
    """Fetch all donations from the database"""
    donations = Donation.query.all()
    return jsonify([donation.to_dict() for donation in donations]), 200

@donation_bp.route('/add_donation', methods=['POST'])
@swag_from('api_docs/donations/add_donation.yml')
def add_donation():
    """Add a new donation to the database"""
    data = request.json
    new_donation = Donation(
        user=data['user'],
        amount=data['amount']
    )
    db.session.add(new_donation)
    db.session.commit()
    return jsonify({"message": "Donation added successfully", "donation": new_donation.to_dict()}), 201