# Import necessary modules from Flask
from flask import Flask, request, jsonify

# Initialize a Flask application
app = Flask(__name__)

# In-memory storage for donations (list will store all donations as dictionaries)
donations = []

# Define a route to handle donation submissions
@app.route('/donate', methods=['POST'])
def donate():
    # Parse JSON data from the request body
    data = request.get_json()

    # Validate the presence of 'user' and 'amount' in the received data
    if not data or 'user' not in data or 'amount' not in data:
        # If validation fails, return an error message and a 400 status code
        return jsonify({"error": "Invalid input. 'user' and 'amount' are required."}), 400

    # Extract 'user' and 'amount' from the parsed JSON data
    user = data['user']
    amount = data['amount']

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

# Run the Flask app only if this script is executed directly
if __name__ == '__main__':
    # Enable debug mode for easier troubleshooting and run the app on the default port (5000)
    app.run(debug=True)
