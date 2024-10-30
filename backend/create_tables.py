from main import app, db
from models import Pet

with app.app_context(): # adds pets to table datbase
    db.create_all()
    print("Tables created successfully.")
