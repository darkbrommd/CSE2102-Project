"""
This script initializes the database with sample data for testing purposes.
"""

from datetime import datetime
from backend.db import db
from backend.models import User, Pet, Donation, Adoption
from backend.main import app

def initialize_data():
    """
    Initialize the database with sample data.
    """
    with app.app_context():
        # Drop all tables and recreate them (optional, useful for testing)
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()

        # Create and add users
        print("Adding users...")
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
        print("Users added.")

        # Create and add pets
        print("Adding pets...")
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
            photo="images/pets/buddy.png",
            about="Buddy is a friendly and affectionate Golden Retriever who loves long walks and playing fetch. His outgoing personality makes him a great companion for families or individuals. Buddy gets along well with other pets and is eager to learn new tricks."
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
            available_for_adoption=True,
            photo="images/pets/whiskers.png",
            about="Whiskers is a calm and gentle Siamese cat with beautiful blue eyes. She requires special attention due to a mild dietary restriction but is otherwise a healthy and playful cat. Whiskers enjoys cozy corners, sunny windowsills, and gentle petting."
        )

        pet3 = Pet(
            name="Pumpkin",
            species="Cat",
            breed="Siamese",
            age=2,
            size="Small",
            location="Los Angeles",
            gender="Female",
            special_needs=True,
            available_for_adoption=True,
            photo="images/pets/pumpkin.png",
            about="Pumpkin is a curious and lively Siamese cat who loves exploring her surroundings. She's a perfect choice for someone looking for a playful and intelligent feline friend. Pumpkin is great with kids and can adapt to both quiet and bustling households."
        )

        pet4 = Pet(
            name="Max",
            species="Dog",
            breed="Border Collie",
            age=4,
            size="Medium",
            location="Austin",
            gender="Male",
            special_needs=False,
            available_for_adoption=True,
            photo="images/pets/max.png",
            about="Max is an energetic and highly intelligent Border Collie who thrives on mental and physical stimulation. He loves agility courses and outdoor adventures. Max is loyal and protective, making him an excellent addition to an active family."
        )

        pet5 = Pet(
            name="Charlie",
            species="Dog",
            breed="Havanese",
            age=5,
            size="Small",
            location="Istanbul",
            gender="Male",
            special_needs=False,
            available_for_adoption=True,
            photo="images/pets/charlie.png",
            about="Charlie is a lovable Havanese with a calm and gentle demeanor. He enjoys being close to his human companions and is content lounging on the couch or going for short walks. Charlie is well-suited for quieter homes and makes an excellent lap dog."
        )

        db.session.add(pet1)
        db.session.add(pet2)
        db.session.add(pet3)
        db.session.add(pet4)
        db.session.add(pet5)
        db.session.commit()  # Commit to assign IDs
        print("Pets added.")

        # Create donations with user references
        print("Adding donations...")
        donation1 = Donation(
            user="johndoe",
            amount=50.0,
            frequency="one-time",
            email="john.doe@example.com",
            phone="1234567890",
            card_number="4111111111111111",
            expiry="12/23",
            cvv="123",
            billing_address="123 Main St",
            zip_code="12345",
            dedication="In memory of someone",
            anonymous=False,
            employer="Company Inc.",
            subscribe=True,
            consent=True,
            tax_receipt=True,
        )

        donation2 = Donation(
            user="janedoe",
            amount=75.5,
            frequency="monthly",
            email="jane.doe@example.com",
            phone="0987654321",
            card_number="4222222222222222",
            expiry="11/24",
            cvv="456",
            billing_address="456 Elm St",
            zip_code="54321",
            dedication="For a good cause",
            anonymous=True,
            employer="Another Company",
            subscribe=False,
            consent=True,
            tax_receipt=False,
        )

        db.session.add(donation1)
        db.session.add(donation2)
        db.session.commit()
        print("Donations added.")

        # Create adoption records with fixed IDs
        adoption1 = Adoption(
            pet_id=1,
            user_id=1,
            date_adopted=datetime.utcnow(),
            adopter_name="John Doe",
            address="123 Main Street",
            address2="Apt 4B",
            zip_code="12345",
            email="john.doe@example.com",
            phone_number="555-1234",
            additional_comments="Excited to bring Buddy home!",
            duration=30  # Set a duration for this adoption
        )

        adoption2 = Adoption(
            pet_id=2,
            user_id=2,
            date_adopted=datetime.utcnow(),
            adopter_name="Jane Doe",
            address="456 Elm Street",
            address2="",
            zip_code="67890",
            email="jane.doe@example.com",
            phone_number="555-5678",
            additional_comments="Lucy will be a great companion!",
            duration=30  # Set a duration for this adoption
        )

        # Add to the database session and commit
        db.session.add(adoption1)
        db.session.add(adoption2)

        # Commit all changes
        db.session.commit()
        print("Sample data has been initialized.")

if __name__ == "__main__":
    initialize_data()
