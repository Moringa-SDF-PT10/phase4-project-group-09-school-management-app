from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from .. import db
from ..models import Class, User, Role, Grade, Enrollment
from ..utils import role_required

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.get("/summary")
@jwt_required()
def dashboard_summary():
    total_classes = db.session.query(func.count(Class.id)).scalar()
    total_students = db.session.query(func.count(User.id)).filter(User.role == Role.student).scalar()
    total_teachers = db.session.query(func.count(User.id)).filter(User.role == Role.teacher).scalar()
    average_grade = db.session.query(func.avg(Grade.score)).scalar()

    recent_activity = []
    recent_enrollments = Enrollment.query.order_by(Enrollment.id.desc()).limit(5).all()
    for enrollment in recent_enrollments:
        recent_activity.append({
            "id": enrollment.id,
            "description": f"New student {enrollment.student.name} enrolled in {enrollment.class_.name}",
            "timestamp": enrollment.student.created_at.isoformat()
        })

    return {
        "total_classes": total_classes,
        "total_students": total_students,
        "total_teachers": total_teachers,
        "average_grade": round(average_grade, 2) if average_grade else 0,
        "recent_activity": recent_activity
    }, 200

@dashboard_bp.get("/teacher-summary")
@jwt_required()
@role_required("teacher")
def teacher_dashboard_summary():
    teacher_id = get_jwt_identity()

    # Get all classes for the teacher
    teacher_classes = Class.query.filter_by(teacher_id=teacher_id).all()
    if not teacher_classes:
        return jsonify({"total_students": 0, "student_grades": []})

    class_ids = [c.id for c in teacher_classes]

    # Get all unique students in these classes
    students = db.session.query(User).join(Enrollment).filter(
        Enrollment.class_id.in_(class_ids)
    ).distinct().all()

    total_students = len(students)

    student_grades = []
    for student in students:
        # Get all enrollments for this student in the teacher's classes
        enrollments = Enrollment.query.filter(
            Enrollment.student_id == student.id,
            Enrollment.class_id.in_(class_ids)
        ).all()
        enrollment_ids = [e.id for e in enrollments]

        # Calculate average grade from those enrollments
        avg_grade = 0
        if enrollment_ids:
            avg_grade = db.session.query(func.avg(Grade.score)).filter(
                Grade.enrollment_id.in_(enrollment_ids)
            ).scalar()

        student_grades.append({
            'id': student.id,
            'name': student.name,
            'average_grade': round(avg_grade, 2) if avg_grade else 0
        })

    return jsonify({
        "total_students": total_students,
        "student_grades": sorted(student_grades, key=lambda x: x['name'])
    })
