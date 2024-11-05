from flask import Flask, request, jsonify
from werkzeug.exceptions import BadRequest
import uuid
from datetime import datetime, timedelta

app = Flask(__name__)

meetings = []

def validate_meeting(data, is_update=False):
    errors = {}

    if 'user_id' not in data:
        errors['user_id'] = "'user_id' field is required."
    elif not isinstance(data['user_id'], str) or not data['user_id'].strip():
        errors['user_id'] = "'user_id' must be a non-empty string."

    if 'facility_id' not in data:
        errors['facility_id'] = "'facility_id' field is required."
    elif not isinstance(data['facility_id'], str) or not data['facility_id'].strip():
        errors['facility_id'] = "'facility_id' must be a non-empty string."

    if 'pet_id' not in data:
        errors['pet_id'] = "'pet_id' field is required."
    elif not isinstance(data['pet_id'], str) or not data['pet_id'].strip():
        errors['pet_id'] = "'pet_id' must be a non-empty string."

    if 'date_time' not in data:
        errors['date_time'] = "'date_time' field is required."
    else:
        try:
            datetime.strptime(data['date_time'], '%Y-%m-%d %H:%M:%S')
        except ValueError:
            errors['date_time'] = "'date_time' must be in 'YYYY-MM-DD HH:MM:SS' format."

    if 'duration' not in data:
        errors['duration'] = "'duration' field is required."
    else:
        try:
            duration = int(data['duration'])
            if duration <= 0:
                errors['duration'] = "'duration' must be a positive integer."
        except (ValueError, TypeError):
            errors['duration'] = "'duration' must be a valid integer."

    return errors

def has_time_conflict(new_meeting, exclude_meeting_id=None):
    new_start = datetime.strptime(new_meeting['date_time'], '%Y-%m-%d %H:%M:%S')
    new_end = new_start + timedelta(minutes=new_meeting['duration'])

    for meeting in meetings:
        if meeting['facility_id'] != new_meeting['facility_id']:
            continue
        if exclude_meeting_id and meeting['id'] == exclude_meeting_id:
            continue
        existing_start = datetime.strptime(meeting['date_time'], '%Y-%m-%d %H:%M:%S')
        existing_end = existing_start + timedelta(minutes=meeting['duration'])

        if new_start < existing_end and existing_start < new_end:
            return True

    return False

@app.route('/schedule', methods=['POST'])
def schedule_meeting():
    try:
        data = request.get_json(force=True)
    except BadRequest:
        return jsonify({"error": "Invalid JSON format."}), 400

    validation_errors = validate_meeting(data)
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    new_meeting = {
        'id': str(uuid.uuid4()),
        'user_id': data['user_id'].strip(),
        'facility_id': data['facility_id'].strip(),
        'pet_id': data['pet_id'].strip(),
        'date_time': data['date_time'],
        'duration': int(data['duration'])
    }

    if has_time_conflict(new_meeting):
        return jsonify({"error": "The facility is already booked during this time."}), 409

    meetings.append(new_meeting)

    return jsonify({"message": "Meeting scheduled successfully.", "meeting": new_meeting}), 201

@app.route('/schedule', methods=['GET'])
def get_meetings():
    return jsonify(meetings), 200

@app.route('/schedule/<meeting_id>', methods=['GET'])
def get_meeting(meeting_id):
    meeting = next((m for m in meetings if m['id'] == meeting_id), None)
    if not meeting:
        return jsonify({"error": "Meeting not found."}), 404
    return jsonify(meeting), 200

@app.route('/schedule/<meeting_id>', methods=['PUT'])
def update_meeting(meeting_id):
    meeting = next((m for m in meetings if m['id'] == meeting_id), None)
    if not meeting:
        return jsonify({"error": "Meeting not found."}), 404

    try:
        data = request.get_json(force=True)
    except BadRequest:
        return jsonify({"error": "Invalid JSON format."}), 400

    validation_errors = validate_meeting(data, is_update=True)
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    updated_meeting = {
        'id': meeting_id,
        'user_id': data['user_id'].strip(),
        'facility_id': data['facility_id'].strip(),
        'pet_id': data['pet_id'].strip(),
        'date_time': data['date_time'],
        'duration': int(data['duration'])
    }

    if has_time_conflict(updated_meeting, exclude_meeting_id=meeting_id):
        return jsonify({"error": "The facility is already booked during this time."}), 409

    meeting.update(updated_meeting)

    return jsonify({"message": "Meeting updated successfully.", "meeting": meeting}), 200

@app.route('/schedule/<meeting_id>', methods=['DELETE'])
def delete_meeting(meeting_id):
    global meetings
    meeting = next((m for m in meetings if m['id'] == meeting_id), None)
    if not meeting:
        return jsonify({"error": "Meeting not found."}), 404
    meetings = [m for m in meetings if m['id'] != meeting_id]
    return jsonify({"message": "Meeting deleted successfully."}), 200

if __name__ == '__main__':
    app.run(debug=True)
