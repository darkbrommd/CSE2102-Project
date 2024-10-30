from main import app, db
from models import Pet

with app.app_context(): # use the app context to create tables
    db.create_all()
    print("Tables created successfully.")
