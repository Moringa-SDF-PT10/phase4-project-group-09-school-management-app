import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, Role
from ..utils import role_required

users_bp = Blueprint("users", __name__)


@users_bp.get("/me")
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get(int(uid))
    return user.to_dict(), 200

#  Admin: List all users
@users_bp.get("/")
@users_bp.get("")
@role_required("admin")
def list_users():
    users = User.query.all()
    return {"users": [u.to_dict() for u in users]}, 200


@users_bp.get("/students")
@role_required("admin")
def list_students():
    students = User.query.filter_by(role=Role.student).all()
    student_options = [
        {"value": student.id, "label": f"{student.name} - ID: {student.id:03d}"}
        for student in students
    ]
    return jsonify(student_options), 200

# Admin: Create a new Student or Teacher
@users_bp.post("/")
@role_required("admin")
def create_user():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")  # default student

    if not all([name, email, password]):
        return {"msg": "Missing fields"}, 400

    if User.query.filter_by(email=email).first():
        return {"msg": "Email already exists"}, 409

    new_user = User(name=name, email=email, role=Role(role))
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return {
        "msg": f"{role.capitalize()} created successfully",
        "user": new_user.to_dict()
    }, 201

#  Any user: Change own password
@users_bp.put("/change-password")
@jwt_required()
def change_password():
    uid = get_jwt_identity()
    logging.info(f"Attempting password change for user_id: {uid}")
    
    user = User.query.get(int(uid))
    if not user:
        logging.warning(f"User not found for user_id: {uid}")
        return {"msg": "User not found"}, 404

    data = request.get_json() or {}
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        logging.warning(f"Missing old or new password for user_id: {uid}")
        return {"msg": "Both old and new passwords are required"}, 400

    if not user.check_password(old_password):
        logging.warning(f"Incorrect old password for user_id: {uid}")
        return {"msg": "Old password is incorrect"}, 401

    try:
        user.set_password(new_password)
        db.session.commit()
        logging.info(f"Password updated successfully for user_id: {uid}")
        return {"msg": "Password updated successfully"}, 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Database error during password update for user_id: {uid} - {e}")
        return {"msg": "Server error, could not update password"}, 500
