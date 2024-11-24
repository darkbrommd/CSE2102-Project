import uuid
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest
from flasgger import swag_from
from backend.models import Meeting
from backend.db import db

schedule_bp = Blueprint('schedule', __name__)

def validate_meeting(data):
    errors = {}

    if 'user_id' not in data:
        errors['user_id'] = "'user_id' field is required."
    else:
        try:
            user_id = int(data['user_id'])
            if user_id <= 0:
                errors['user_id'] = "'user_id' must be a positive integer."
        except (ValueError, TypeError):
            errors['user_id'] = "'user_id' must be a valid integer."

    if 'facility_id' not in data:
        errors['facility_id'] = "'facility_id' field is required."
    elif not isinstance(data['facility_id'], str) or not data['facility_id'].strip():
        errors['facility_id'] = "'facility_id' must be a non-empty string."

    if 'pet_id' not in data:
        errors['pet_id'] = "'pet_id' field is required."
    else:
        try:
            pet_id = int(data['pet_id'])
            if pet_id <= 0:
                errors['pet_id'] = "'pet_id' must be a positive integer."
        except (ValueError, TypeError):
            errors['pet_id'] = "'pet_id' must be a valid integer."

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
    new_start = new_meeting.date_time
    new_end = new_start + timedelta(minutes=new_meeting.duration)

    meetings = Meeting.query.filter_by(facility_id=new_meeting.facility_id).all()

    for meeting in meetings:
        if exclude_meeting_id and meeting.id == exclude_meeting_id:
            continue
        existing_start = meeting.date_time
        existing_end = existing_start + timedelta(minutes=meeting.duration)

        if new_start < existing_end and existing_start < new_end:
            return True

    return False

@schedule_bp.route('/schedule', methods=['POST'])
@swag_from('api_docs/schedule/schedule_meeting.yml')
def schedule_meeting():
    try:
        data = request.get_json(force=True)
    except BadRequest:
        return jsonify({"error": "Invalid JSON format."}), 400

    validation_errors = validate_meeting(data)
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    new_meeting = Meeting(
        id=str(uuid.uuid4()),
        user_id=int(data['user_id']),
        facility_id=data['facility_id'].strip(),
        pet_id=int(data['pet_id']),
        date_time=datetime.strptime(data['date_time'], '%Y-%m-%d %H:%M:%S'),
        duration=int(data['duration'])
    )

    if has_time_conflict(new_meeting):
        return jsonify({"error": "The facility is already booked during this time."}), 409

    db.session.add(new_meeting)
    db.session.commit()

    return jsonify({"message": "Meeting scheduled successfully.", "meeting": new_meeting.to_dict()}), 201

@schedule_bp.route('/schedule', methods=['GET'])
@swag_from('api_docs/schedule/get_scheduled_meetings.yml')
def get_meetings():
    meetings = Meeting.query.all()
    return jsonify([meeting.to_dict() for meeting in meetings]), 200

@schedule_bp.route('/schedule/<meeting_id>', methods=['GET'])
@swag_from('api_docs/schedule/get_meetings_id.yml')
def get_meeting(meeting_id):
    meeting = Meeting.query.get(meeting_id)
    if not meeting:
        return jsonify({"error": "Meeting not found."}), 404
    return jsonify(meeting.to_dict()), 200

@schedule_bp.route('/schedule/<meeting_id>', methods=['PUT'])
@swag_from('api_docs/schedule/update_meeting.yml')
def update_meeting(meeting_id):
    meeting = Meeting.query.get(meeting_id)
    if not meeting:
        return jsonify({"error": "Meeting not found."}), 404

    try:
        data = request.get_json(force=True)
    except BadRequest:
        return jsonify({"error": "Invalid JSON format."}), 400

    validation_errors = validate_meeting(data)
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    updated_meeting = Meeting(
        id=meeting_id,
        user_id=int(data['user_id']),
        facility_id=data['facility_id'].strip(),
        pet_id=int(data['pet_id']),
        date_time=datetime.strptime(data['date_time'], '%Y-%m-%d %H:%M:%S'),
        duration=int(data['duration'])
    )

    if has_time_conflict(updated_meeting, exclude_meeting_id=meeting_id):
        return jsonify({"error": "The facility is already booked during this time."}), 409

    # Update fields
    meeting.user_id = updated_meeting.user_id
    meeting.facility_id = updated_meeting.facility_id
    meeting.pet_id = updated_meeting.pet_id
    meeting.date_time = updated_meeting.date_time
    meeting.duration = updated_meeting.duration

    db.session.commit()

    return jsonify({"message": "Meeting updated successfully.", "meeting": meeting.to_dict()}), 200

@schedule_bp.route('/schedule/<meeting_id>', methods=['DELETE'])
@swag_from('api_docs/schedule/delete_meeting.yml')
def delete_meeting(meeting_id):
    meeting = Meeting.query.get(meeting_id)
    if not meeting:
        return jsonify({"error": "Meeting not found."}), 404

    db.session.delete(meeting)
    db.session.commit()
    return jsonify({"message": "Meeting deleted successfully."}), 200
