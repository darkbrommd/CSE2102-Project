# config.py
import os

# Define allowed file types and max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
PROFILE_UPLOAD_FOLDER = os.path.join(os.getcwd(), 'frontend/public/images/profile-pictures')
PET_UPLOAD_FOLDER = '/images/pets'
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
