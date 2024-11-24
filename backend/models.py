"""
This module defines the database models for User, Pet, Donation, Schedule and Adoption.
These models represent the core entities in the application, such as users,
pets available for adoption, donations made by users, and adoption records.
"""

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from backend.db import db

class User(db.Model):
    """Represents a user in the system."""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    zip_code = db.Column(db.String(20), nullable=True)
    profile_picture = db.Column(db.String(200), nullable=True)
    favorites = db.Column(db.JSON, default=[])

    def set_password(self, password):
        """Hashes the password and stores it."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifies the password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Converts the User object to a dictionary."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "zip_code": self.zip_code,
            "profile_picture": self.profile_picture,
            "favorites": self.favorites 
        }

class Pet(db.Model):
    """Represents a pet available for adoption."""

    __tablename__ = 'pets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    species = db.Column(db.String(50), nullable=False)
    breed = db.Column(db.String(50), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    size = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    special_needs = db.Column(db.Boolean, default=False)
    available_for_adoption = db.Column(db.Boolean, default=True)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    photo = db.Column(db.String(200), nullable=True)
    about = db.Column(db.Text, nullable=True)

    def to_dict(self):
        """Converts the Pet object to a dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "species": self.species,
            "breed": self.breed,
            "age": self.age,
            "size": self.size,
            "location": self.location,
            "gender": self.gender,
            "special_needs": self.special_needs,
            "available_for_adoption": self.available_for_adoption,
            "date_added": self.date_added,
            "photo": self.photo,
            "about": self.about
        }

class Donation(db.Model):
    """Represents a donation made by a user."""
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    frequency = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    card_number = db.Column(db.String(20), nullable=False)
    expiry = db.Column(db.String(10), nullable=False)
    cvv = db.Column(db.String(4), nullable=False)
    billing_address = db.Column(db.String(200), nullable=False)
    zip_code = db.Column(db.String(10), nullable=False)
    dedication = db.Column(db.String(200), nullable=True)
    anonymous = db.Column(db.Boolean, default=False)
    employer = db.Column(db.String(100), nullable=True)
    subscribe = db.Column(db.Boolean, default=False)
    consent = db.Column(db.Boolean, default=False)
    tax_receipt = db.Column(db.Boolean, default=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Represents a donation made by a user."""
        return {
            "id": self.id,
            "user": self.user,
            "amount": self.amount,
            "frequency": self.frequency,
            "email": self.email,
            "phone": self.phone,
            "card_number": self.card_number,
            "expiry": self.expiry,
            "cvv": self.cvv,
            "billing_address": self.billing_address,
            "zip_code": self.zip_code,
            "dedication": self.dedication,
            "anonymous": self.anonymous,
            "employer": self.employer,
            "subscribe": self.subscribe,
            "consent": self.consent,
            "tax_receipt": self.tax_receipt,
            "date": self.date 
        }
    def to_brief_dict(self):
        """this method returns only the fields needed for the recent donations page"""
        return {
        "name": self.user,
        "amount": self.amount,
        "date": self.date,
        "anonymous": self.anonymous
    }


class Adoption(db.Model):
    """Represents an adoption record linking a user and a pet."""

    __tablename__ = 'adoptions'

    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date_adopted = db.Column(db.DateTime, default=datetime.utcnow)
    adopter_name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    address2 = db.Column(db.String(255))
    zip_code = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    additional_comments = db.Column(db.Text)
    duration = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        """Converts the Adoption object to a dictionary."""
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "user_id": self.user_id,
            "date_adopted": self.date_adopted.isoformat(),
            "adopter_name": self.adopter_name,
            "address": self.address,
            "address2": self.address2,
            "zip_code": self.zip_code,
            "email": self.email,
            "phone_number": self.phone_number,
            "additional_comments": self.additional_comments,
            "duration": self.duration,  
        }

class Meeting(db.Model):
    """Represents a scheduled meeting in the system."""

    __tablename__ = 'meetings'

    id = db.Column(db.String(36), primary_key=True)  # UUID as a string
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    facility_id = db.Column(db.String(100), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # duration in minutes

    def to_dict(self):
        """Convert the Donation object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'facility_id': self.facility_id,
            'pet_id': self.pet_id,
            'date_time': self.date_time.strftime('%Y-%m-%d %H:%M:%S'),
            'duration': self.duration
        }
