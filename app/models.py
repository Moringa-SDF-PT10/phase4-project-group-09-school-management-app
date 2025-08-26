from datetime import datetime
from enum import Enum
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class Role(str, Enum):
    admin = "admin"
    teacher = "teacher"
    student = "student"

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(Role), default=Role.student, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    classes_taught = db.relationship("Class", back_populates="teacher", lazy="dynamic")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role.value,
            "created_at": self.created_at.isoformat()
        }

class Class(db.Model):
    __tablename__ = "classes"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, default="")
    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    teacher = db.relationship("User", back_populates="classes_taught")
    enrollments = db.relationship("Enrollment", back_populates="class_", cascade="all, delete-orphan")

    def to_dict(self, include_students=False):
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "teacher": self.teacher.to_dict() if self.teacher else None,
        }
        if include_students:
            data["enrollments"] = [e.to_dict(include_grades=True) for e in self.enrollments]
        return data

class EnrollmentStatus(str, Enum):
    active = "active"
    dropped = "dropped"
    pending = "pending"

class Enrollment(db.Model):
    __tablename__ = "enrollments"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey("classes.id"), nullable=False)
    status = db.Column(db.Enum(EnrollmentStatus), default=EnrollmentStatus.active, nullable=False)

    student = db.relationship("User")
    class_ = db.relationship("Class", back_populates="enrollments")
    grades = db.relationship("Grade", back_populates="enrollment", cascade="all, delete-orphan")

    def to_dict(self, include_grades=False):
        data = {
            "id": self.id,
            "status": self.status.value,
            "student": self.student.to_dict() if self.student else None,
            "class_id": self.class_id,
        }
        if include_grades:
            data["grades"] = [g.to_dict() for g in self.grades]
        return data

class Grade(db.Model):
    __tablename__ = "grades"
    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(db.Integer, db.ForeignKey("enrollments.id"), nullable=False)
    score = db.Column(db.Float, nullable=False)
    remarks = db.Column(db.String(255), default="")

    enrollment = db.relationship("Enrollment", back_populates="grades")

    def to_dict(self):
        return {
            "id": self.id,
            "enrollment_id": self.enrollment_id,
            "score": self.score,
            "remarks": self.remarks
        }
