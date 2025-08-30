from app import create_app, db
from app.models import User, Class, Enrollment, Grade, Role, EnrollmentStatus, Semester

def run():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        # --- Users ---
        users_data = [
            {"name": "Admin", "email": "admin@ustadi.local", "role": Role.admin, "password": "Admin@123"},
            {"name": "Ms. Wangari Teacher", "email": "wangari@ustadi.local", "role": Role.teacher, "password": "Teacher@123"},
            {"name": "Chris Student", "email": "chris@ustadi.local", "role": Role.student, "password": "Student@123"},
            {"name": "George Student", "email": "George@ustadi.local", "role": Role.student, "password": "Student@123"},
            {"name": "Benard Student", "email": "Benard@ustadi.local", "role": Role.student, "password": "Student@123"}
        ]
        for user_data in users_data:
            if not User.query.filter_by(email=user_data["email"]).first():
                user = User(name=user_data["name"], email=user_data["email"], role=user_data["role"])
                user.set_password(user_data["password"])
                db.session.add(user)
        db.session.commit()

        # --- Classes ---
        teacher = User.query.filter_by(email="wangari@ustadi.local").first()
        if teacher and not Class.query.filter_by(name="Mathematics 101").first():
            class1 = Class(name="Mathematics 101", description="Intro to Algebra", teacher_id=teacher.id)
            db.session.add(class1)
            db.session.commit()

        # --- Enrollments & Grades ---
        student1 = User.query.filter_by(email="chris@ustadi.local").first()
        student2 = User.query.filter_by(email="George@ustadi.local").first()
        class1 = Class.query.filter_by(name="Mathematics 101").first()

        if student1 and class1 and not Enrollment.query.filter_by(student_id=student1.id, class_id=class1.id).first():
            enrollment1 = Enrollment(student_id=student1.id, class_id=class1.id, status=EnrollmentStatus.active, semester=Semester.first_semester, academic_year="2024-2025")
            db.session.add(enrollment1)
            db.session.commit()
            grade1 = Grade(enrollment_id=enrollment1.id, score=85.5, remarks="Good work")
            db.session.add(grade1)

        if student2 and class1 and not Enrollment.query.filter_by(student_id=student2.id, class_id=class1.id).first():
            enrollment2 = Enrollment(student_id=student2.id, class_id=class1.id, status=EnrollmentStatus.active, semester=Semester.first_semester, academic_year="2024-2025")
            db.session.add(enrollment2)

        db.session.commit()

        print("Seeding complete. Admin login: admin@ustadi.local / Admin@123")

if __name__ == "__main__":
    run()
