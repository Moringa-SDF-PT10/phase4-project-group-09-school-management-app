from flask import Blueprint
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from .. import db
from ..models import Class, User, Role, Grade, Enrollment

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
