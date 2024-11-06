from datetime import datetime
from db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    zip_code = db.Column(db.String(20), nullable=True)
    profile_picture = db.Column(db.String(200), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "zip_code": self.zip_code,
            "profile_picture": self.profile_picture
        }

class Pet(db.Model):
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

    def to_dict(self):
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
            "photo": self.photo
        }

class Donation(db.Model):
    __tablename__ = 'donations'
    
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user,
            "amount": self.amount,
            "date": self.date
        }

class Adoption(db.Model):
    __tablename__ = 'adoptions'
    
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date_adopted = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "user_id": self.user_id,
            "date_adopted": self.date_adopted
        }