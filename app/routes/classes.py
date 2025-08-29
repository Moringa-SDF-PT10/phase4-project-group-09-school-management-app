from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from .. import db
from ..models import Class, User, Role
from ..utils import role_required

classes_bp = Blueprint("classes", __name__)

@classes_bp.get("/")
@jwt_required()
def list_classes():
    classes = Class.query.all()
    return {"classes": [c.to_dict() for c in classes]}, 200

@classes_bp.post("/")
@role_required("admin")
def create_class():
    data = request.get_json() or {}
    name = data.get("name")
    desc = data.get("description", "")
    if not name:
        return {"msg": "name is required"}, 400
    c = Class(name=name, description=desc)
    db.session.add(c)
    db.session.commit()
    return {"msg": "class created", "class": c.to_dict()}, 201

@classes_bp.put("/<int:class_id>")
@role_required("admin")
def update_class(class_id):
    c = Class.query.get_or_404(class_id)
    data = request.get_json() or {}
    c.name = data.get("name", c.name)
    c.description = data.get("description", c.description)
    db.session.commit()
    return {"msg": "class updated", "class": c.to_dict()}, 200

@classes_bp.delete("/<int:class_id>")
@role_required("admin")
def delete_class(class_id):
    c = Class.query.get_or_404(class_id)
    db.session.delete(c)
    db.session.commit()
    return {"msg": "class deleted"}, 200

@classes_bp.post("/<int:class_id>/assign-teacher")
@role_required("admin")
def assign_teacher(class_id):
    c = Class.query.get_or_404(class_id)
    data = request.get_json() or {}
    teacher_id = data.get("teacher_id")
    if not teacher_id:
        return {"msg": "teacher_id is required"}, 400
    teacher = User.query.get_or_404(int(teacher_id))
    if teacher.role != Role.teacher:
        return {"msg": "User is not a teacher"}, 400
    c.teacher = teacher
    db.session.commit()
    return {"msg": "teacher assigned", "class": c.to_dict()}, 200

@classes_bp.get("/<int:class_id>")
@jwt_required()
def class_details(class_id):
    c = Class.query.get_or_404(class_id)
    return c.to_dict(include_students=True), 200
