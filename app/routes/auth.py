from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from .. import db
from ..models import User, Role

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not all([name, email, password]):
        return {"msg": "name, email, password are required"}, 400

    try:
        user = User(name=name, email=email, role=Role(role) if role in Role._value2member_map_ else Role.student)
    except Exception:
        user = User(name=name, email=email, role=Role.student)

    user.set_password(password)
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"msg": "Email already registered"}, 409

    return {"msg": "Registered successfully", "user": user.to_dict()}, 201

@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not all([email, password]):
        return {"msg": "email and password required"}, 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return {"msg": "Invalid credentials"}, 401

    access_token = create_access_token(identity=user.id, additional_claims={"role": user.role.value})
    return {"access_token": access_token, "user": user.to_dict()}, 200
