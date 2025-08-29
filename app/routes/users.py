from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..models import User
from ..utils import role_required

users_bp = Blueprint("users", __name__)

@users_bp.get("/me")
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get(int(uid))
    return user.to_dict(), 200

@users_bp.get("/")
@role_required("admin")
def list_users():
    users = User.query.all()
    return {"users": [u.to_dict() for u in users]}, 200
