"""
Configuration settings for the application.

This module defines constants and utility functions related to file uploads,
such as allowed file types, upload folders, and maximum file size.
"""

import os

# Define allowed file types and max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
PROFILE_UPLOAD_FOLDER = os.path.join(os.getcwd(), 'frontend/public/images/profile-pictures')
PET_UPLOAD_FOLDER = '/images/pets'
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

def allowed_file(filename):
    """
    Check if a file is allowed based on its extension.

    Args:
        filename (str): The name of the file to check.

    Returns:
        bool: True if the file is allowed, False otherwise.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
