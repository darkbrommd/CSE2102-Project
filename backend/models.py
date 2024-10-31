from datetime import datetime
from main import db

class Pet(db.Model):
    __tablename__ = 'pets'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    species = db.Column(db.String(50), nullable=False)
    breed = db.Column(db.String(100))
    age = db.Column(db.String(50))
    size = db.Column(db.String(50))
    location = db.Column(db.String(100))
    gender = db.Column(db.String(10))
    special_needs = db.Column(db.Boolean, default=False)
    available_for_adoption = db.Column(db.Boolean, default=True)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

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
            "date_added": self.date_added
        }
