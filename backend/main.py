"""
Main application entry point.
Sets up the Flask app, initializes database, and configures API endpoints and error handling.
"""

from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger
from db import db
from backend.user import user_bp
from backend.pets import pets_bp
from backend.adopt import adopt_bp
from backend.donate import donation_bp
from backend.schedule import schedule_bp
from backend.search import search_bp

app = Flask(__name__, static_url_path='/public', static_folder='public')
swagger = Swagger(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Enable CORS
CORS(app)

# File upload configuration
app.config['PROFILE_UPLOAD_FOLDER'] = 'public/profile_pictures'  # Folder for user profile pictures
app.config['PET_UPLOAD_FOLDER'] = 'public/pet_photos'            # Folder for pet photos
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024              # Set max upload size to 16 MB
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'} # Allowed extensions

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
