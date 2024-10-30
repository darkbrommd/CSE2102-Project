from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from user import user_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pets.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

CORS(app)

# Configure maximum file upload size (e.g., 16 MB)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Allowed file extensions for profile pictures
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


# Register the user blueprint
app.register_blueprint(user_bp)

if __name__ == "__main__":
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    app.run(debug=True)
