from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from .. import db
from ..models import Grade, Enrollment, Class

grades_bp = Blueprint("grades", __name__)

@grades_bp.post("/")
@jwt_required()
def create_grade():
    data = request.get_json() or {}
    enrollment_id = data.get("enrollment_id")
    score = data.get("score")
    remarks = data.get("remarks", "")
    if enrollment_id is None or score is None:
        return {"msg": "enrollment_id and score are required"}, 400

    e = Enrollment.query.get_or_404(int(enrollment_id))
    # Only the teacher of the class can grade
    claims = get_jwt()
    user_id = int(claims.get("sub"))
    if e.class_.teacher_id != user_id:
        return {"msg": "Only the class teacher can submit grades"}, 403

    g = Grade(enrollment_id=e.id, score=float(score), remarks=remarks)
    db.session.add(g)
    db.session.commit()
    return {"msg": "grade created", "grade": g.to_dict()}, 201

@grades_bp.put("/<int:grade_id>")
@jwt_required()
def update_grade(grade_id):
    g = Grade.query.get_or_404(grade_id)
    e = g.enrollment
    claims = get_jwt()
    user_id = int(claims.get("sub"))
    if e.class_.teacher_id != user_id:
        return {"msg": "Only the class teacher can update grades"}, 403

    data = request.get_json() or {}
    if "score" in data:
        g.score = float(data["score"])
    if "remarks" in data:
        g.remarks = data["remarks"]
    db.session.commit()
    return {"msg": "grade updated", "grade": g.to_dict()}, 200

@grades_bp.get("/enrollment/<int:enrollment_id>")
@jwt_required()
def list_for_enrollment(enrollment_id):
    grades = Grade.query.filter_by(enrollment_id=enrollment_id).all()
    return {"grades": [g.to_dict() for g in grades]}, 200
