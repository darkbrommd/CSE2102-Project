"""
This script initializes the database with sample data for testing purposes.
"""

from datetime import datetime
from backend.db import db
from backend.models import User, Pet, Donation, Adoption
from backend.main import app

def initialize_data():
    """
    Initializes the database with sample data for users, pets, donations, and adoptions.
    This function drops existing tables, recreates them, and populates them with sample records.
    """
    with app.app_context():
        # Drop all tables and recreate them (optional, useful for testing)
        db.drop_all()
        db.create_all()

        # Create and add users
        user1 = User(
            username="johndoe",
            email="johndoe@example.com",
            zip_code="12345",
            profile_picture="public/profile_pictures/johndoe.jpg"
        )
        user1.set_password("password123")

        user2 = User(
            username="janedoe",
            email="janedoe@example.com",
            zip_code="54321",
            profile_picture="public/profile_pictures/janedoe.jpg"
        )
        user2.set_password("securepassword")

        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()  # Commit to assign IDs

        # Create and add pets
        pet1 = Pet(
            name="Buddy",
            species="Dog",
            breed="Golden Retriever",
            age=3,
            size="Large",
            location="New York",
            gender="Male",
            special_needs=False,
            available_for_adoption=True,
            photo="public/pet_photos/buddy.jpg"
        )

        pet2 = Pet(
            name="Whiskers",
            species="Cat",
            breed="Siamese",
            age=2,
            size="Small",
            location="Los Angeles",
            gender="Female",
            special_needs=True,
            available_for_adoption=False,
            photo="public/pet_photos/whiskers.jpg"
        )

        db.session.add(pet1)
        db.session.add(pet2)
        db.session.commit()  # Commit to assign IDs

        # Create donations with user references
        donation1 = Donation(user="johndoe", amount=50.0, date=datetime.utcnow())
        donation2 = Donation(user="janedoe", amount=75.5, date=datetime.utcnow())
        db.session.add(donation1)
        db.session.add(donation2)

        # Create adoptions with pet and user references (using assigned IDs)
        adoption1 = Adoption(pet_id=pet1.id, user_id=user1.id, date_adopted=datetime.utcnow())
        adoption2 = Adoption(pet_id=pet2.id, user_id=user2.id, date_adopted=datetime.utcnow())
        db.session.add(adoption1)
        db.session.add(adoption2)

        # Commit all changes
        db.session.commit()
        print("Sample data has been initialized.")

if __name__ == "__main__":
    initialize_data()
