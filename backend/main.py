from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger
from db import db
from user import user_bp
from pets import pets_bp
from adopt import adopt_bp
from donation import donation_bp

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

# Function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Register the blueprints
app.register_blueprint(user_bp)
app.register_blueprint(pets_bp)
app.register_blueprint(adopt_bp)
app.register_blueprint(donation_bp)


# Error handling for file size limit
@app.errorhandler(413)
def file_too_large(error):
    return jsonify({"error": "File is too large. Max upload size is 16 MB."}), 413

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)