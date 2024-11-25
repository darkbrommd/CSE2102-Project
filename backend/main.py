"""
Main application entry point.
Sets up the Flask app, initializes database, and configures API endpoints and error handling.
"""
import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flasgger import Swagger
from backend.db import db
from backend.user import user_bp
from backend.pets import pets_bp
from backend.adopt import adopt_bp
from backend.donate import donation_bp
from backend.schedule import schedule_bp
from backend.search import search_bp
from backend.config import PROFILE_UPLOAD_FOLDER, MAX_CONTENT_LENGTH

app = Flask(__name__, static_url_path='/public', static_folder='public')
swagger = Swagger(app)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = (
    'sqlite:///' + os.path.join(basedir, 'instance', 'database.db')
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'e2a8c0f5d923f14d23b8edb1c6bfe3b5b85e7edc6d8c28e7f2f3b4a15f19e7c4'
app.config.from_object('backend.config')
# Initialize the database
db.init_app(app)
jwt = JWTManager(app)
# Enable CORS
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)  
@app.route('/')
def home():
    return "Welcome to the API!"

# File upload configuration
app.config['PROFILE_UPLOAD_FOLDER'] = 'public/images/profile-pictures'  # Folder for user profile pictures
app.config['PET_UPLOAD_FOLDER'] = 'public/images/pets'            # Folder for pet photos
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024              # Set max upload size to 16 MB
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'} # Allowed extensions

def allowed_file(_filename):
    """
    Check if a filename has an allowed extension.
    
    Args:
        filename (str): The name of the file.
    
    Returns:
        bool: True if the file extension is allowed, False otherwise.
    """
    return jsonify({
    "error": "File is too large. Max upload size is 16 MB."
    }), 413

# Register the blueprints
app.register_blueprint(user_bp)
app.register_blueprint(pets_bp)
app.register_blueprint(adopt_bp)
app.register_blueprint(donation_bp)
app.register_blueprint(schedule_bp)
app.register_blueprint(search_bp)

@app.errorhandler(413)
def file_too_large(_error):
    """
    Error handler for files that exceed the maximum upload size.
    
    Args:
        _error: The error object (unused).
    
    Returns:
        JSON response with error message and HTTP status 413.
    """
    return jsonify({"error": "File is too large. Max upload size is 16 MB."}), 413

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create all database tables

    app.run(debug=True)  # Run the app in debug mode
