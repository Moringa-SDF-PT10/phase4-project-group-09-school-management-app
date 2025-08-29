from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from .. import db
from ..models import Enrollment, EnrollmentStatus, Class, User, Role
from ..utils import role_required

enrollments_bp = Blueprint("enrollments", __name__)

def _is_class_teacher(user_id: int, class_obj: Class) -> bool:
    return class_obj.teacher_id == user_id

@enrollments_bp.post("/")
@jwt_required()
def create_enrollment():
    data = request.get_json() or {}
    student_id = data.get("student_id")
    class_id = data.get("class_id")
    if not student_id or not class_id:
        return {"msg": "student_id and class_id are required"}, 400

    claims = get_jwt()
    role = claims.get("role")
    user_id = int(claims.get("sub"))
    class_obj = Class.query.get_or_404(int(class_id))

    # Only admin or the class teacher can enroll
    if role not in ["admin"] and not _is_class_teacher(user_id, class_obj):
        return {"msg": "Only admin or class teacher can enroll students"}, 403

    student = User.query.get_or_404(int(student_id))
    if student.role != Role.student:
        return {"msg": "Only students can be enrolled"}, 400

    # Prevent duplicate enrollment
    existing = Enrollment.query.filter_by(student_id=student.id, class_id=class_obj.id).first()
    if existing:
        return {"msg": "Student already enrolled in this class", "enrollment": existing.to_dict()}, 200

    e = Enrollment(student_id=student.id, class_id=class_obj.id, status=EnrollmentStatus.active)
    db.session.add(e)
    db.session.commit()
    return {"msg": "enrolled", "enrollment": e.to_dict()}, 201

@enrollments_bp.put("/<int:enrollment_id>/status")
@jwt_required()
def update_status(enrollment_id):
    e = Enrollment.query.get_or_404(enrollment_id)
    data = request.get_json() or {}
    status = data.get("status")
    if status not in EnrollmentStatus._value2member_map_:
        return {"msg": "invalid status"}, 400

    claims = get_jwt()
    role = claims.get("role")
    user_id = int(claims.get("sub"))
    if role not in ["admin"] and e.class_.teacher_id != user_id:
        return {"msg": "Only admin or class teacher can change status"}, 403

    e.status = EnrollmentStatus(status)
    db.session.commit()
    return {"msg": "status updated", "enrollment": e.to_dict()}, 200

@enrollments_bp.get("/class/<int:class_id>")
@jwt_required()
def list_enrollments_for_class(class_id):
    enrollments = Enrollment.query.filter_by(class_id=class_id).all()
    return {"enrollments": [e.to_dict(include_grades=True) for e in enrollments]}, 200
