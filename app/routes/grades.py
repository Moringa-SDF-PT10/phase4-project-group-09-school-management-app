from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from .. import db
from ..models import Grade, Enrollment, Class, User
from ..utils import role_required

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


@grades_bp.post("/class/<int:class_id>")
@role_required("teacher")
def batch_update_grades(class_id):
    teacher_id = get_jwt_identity()
    cls = Class.query.get_or_404(class_id)

    if cls.teacher_id != teacher_id:
        return {"msg": "You are not the teacher for this class"}, 403

    data = request.get_json() or {}
    grades_to_update = data.get("grades")
    if not isinstance(grades_to_update, dict):
        return {"msg": "Invalid payload format"}, 400

    for student_id_str, score_str in grades_to_update.items():
        try:
            student_id = int(student_id_str)
            score = float(score_str) if score_str else None
        except (ValueError, TypeError):
            continue # Skip invalid entries

        enrollment = Enrollment.query.filter_by(
            class_id=class_id, student_id=student_id
        ).first()

        if not enrollment:
            continue # Skip if student is not enrolled

        grade = Grade.query.filter_by(enrollment_id=enrollment.id).first()

        if score is not None:
            if grade:
                grade.score = score
            else:
                new_grade = Grade(enrollment_id=enrollment.id, score=score)
                db.session.add(new_grade)
        elif grade:
            # If score is empty/null and grade exists, delete it
            db.session.delete(grade)

    db.session.commit()
    return {"msg": "Grades updated successfully"}, 200


@grades_bp.get("/assignment-types")
def get_assignment_types():
    assignment_types = [
        {"value": "homework", "label": "Homework"},
        {"value": "quiz", "label": "Quiz"},
        {"value": "exam", "label": "Exam"},
        {"value": "project", "label": "Project"},
        {"value": "participation", "label": "Participation"},
        {"value": "lab", "label": "Laboratory"},
    ]
    return jsonify(assignment_types), 200

