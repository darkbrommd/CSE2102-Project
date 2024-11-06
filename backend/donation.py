# Import necessary modules from Flask
from flask import Flask, request, jsonify
from werkzeug.exceptions import BadRequest

# Initialize a Flask application
app = Flask(__name__)

# In-memory storage for donations (list will store all donations as dictionaries)
donations = []

# Define a route to handle donation submissions
@app.route('/donate', methods=['POST'])
def donate():
    try:
        # Parse JSON data from the request body
        data = request.get_json()
    except BadRequest:
        # Handle malformed JSON
        return jsonify({"error": "Invalid JSON."}), 400

    # Check if JSON was parsed successfully
    if not data:
        return jsonify({"error": "No JSON data provided."}), 400

    # Validate the presence of 'user' and 'amount' in the received data
    if 'user' not in data:
        return jsonify({"error": "Invalid input. 'user' is required."}), 400

    if 'amount' not in data:
        return jsonify({"error": "Invalid input. 'amount' is required."}), 400

    # Extract 'user' and 'amount' from the parsed JSON data
    user = data['user']
    amount = data['amount']

    # Validate value constraints
    if not user.strip():
        return jsonify({"error": "'user' cannot be empty."}), 400
    if amount <= 0:
        return jsonify({"error": "'amount' must be greater than zero."}), 400

    # Create a donation dictionary with 'user' and 'amount'
    donation = {'user': user, 'amount': amount}
    # Add the new donation to the in-memory storage (the donations list)
    donations.append(donation)

    # Return a success response with the created donation and a 201 status code
    return jsonify({"message": "Donation received", "donation": donation}), 201

# Define an additional route to view all donations (for testing or inspection)
@app.route('/donations', methods=['GET'])
def get_donations():
    # Return the list of donations as JSON with a 200 status code
    return jsonify(donations), 200

# Global error handler for BadRequest exceptions (e.g., invalid JSON)
@app.errorhandler(BadRequest)
def handle_bad_request(e):
    return jsonify({"error": "Invalid JSON."}), 400

# Run the Flask app only if this script is executed directly
if __name__ == '__main__':
    # Enable debug mode for easier troubleshooting and run the app on the default port (5000)
    app.run(debug=True)
