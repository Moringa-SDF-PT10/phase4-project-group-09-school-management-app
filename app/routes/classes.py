from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from .. import db
from ..models import Class, User, Role
from ..utils import role_required

classes_bp = Blueprint("classes", __name__)

@classes_bp.get("/")
@classes_bp.get("")
@jwt_required()
def list_classes():
    classes = Class.query.all()
    return {"classes": [c.to_dict() for c in classes]}, 200

@classes_bp.post("/")
@role_required("admin")
def create_class():
    data = request.get_json() or {}
    name = data.get("name")
    if not name:
        return {"msg": "name is required"}, 400

    new_class = Class(
        name=name,
        description=data.get("description", ""),
        capacity=data.get("capacity"),
        schedule=data.get("schedule"),
        location=data.get("location")
    )

    teacher_id = data.get("teacher_id")
    if teacher_id:
        teacher = User.query.get(teacher_id)
        if not teacher or teacher.role != Role.teacher:
            return {"msg": "Invalid teacher ID"}, 400
        new_class.teacher = teacher

    db.session.add(new_class)
    db.session.commit()
    return {"msg": "class created", "class": new_class.to_dict()}, 201

@classes_bp.put("/<int:class_id>")
@role_required("admin")
def update_class(class_id):
    c = Class.query.get_or_404(class_id)
    data = request.get_json() or {}
    c.name = data.get("name", c.name)
    c.description = data.get("description", c.description)
    c.capacity = data.get("capacity", c.capacity)
    c.schedule = data.get("schedule", c.schedule)
    c.location = data.get("location", c.location)
    
    teacher_id = data.get("teacher_id")
    if teacher_id:
        teacher = User.query.get(teacher_id)
        if not teacher or teacher.role != Role.teacher:
            return {"msg": "Invalid teacher ID"}, 400
        c.teacher_id = teacher_id

    db.session.commit()
    return {"msg": "class updated", "class": c.to_dict()}, 200

@classes_bp.delete("/<int:class_id>")
@role_required("admin")
def delete_class(class_id):
    c = Class.query.get_or_404(class_id)
    db.session.delete(c)
    db.session.commit()
    return {"msg": "class deleted"}, 200


@classes_bp.get("/<int:class_id>")
@jwt_required()
def class_details(class_id):
    c = Class.query.get_or_404(class_id)
    return c.to_dict(include_students=True), 200


@classes_bp.get("/my-teaching-classes")
@role_required("teacher")
def my_teaching_classes():
    teacher_id = get_jwt_identity()
    classes = Class.query.filter_by(teacher_id=teacher_id).all()
    return {"classes": [c.to_dict() for c in classes]}, 200


@classes_bp.get("/options")
@role_required("admin")
def get_class_options():
    classes = Class.query.order_by(Class.name).all()
    class_options = [
        {"value": cls.id, "label": f"{cls.name}"}
        for cls in classes
    ]
    return jsonify(class_options), 200
