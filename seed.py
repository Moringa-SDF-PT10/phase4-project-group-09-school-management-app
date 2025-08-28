from app import create_app, db
from app.models import User, Class, Enrollment, Grade, Role, EnrollmentStatus

def run():
    app = create_app()
    with app.app_context():
        db.create_all()

        if not User.query.filter_by(email="admin@ustadi.local").first():
            admin = User(name="Admin", email="admin@ustadi.local", role=Role.admin)
            admin.set_password("Admin@123")
            db.session.add(admin)

        # Create teacher & students
        t1 = User(name="Ms. Wangari Teacher", email="wangari@ustadi.local", role=Role.teacher)
        t1.set_password("Teacher@123")
        s1 = User(name="Chris Student", email="chris@ustadi.local", role=Role.student)
        s1.set_password("Student@123")
        s2 = User(name="George Student", email="George@ustadi.local", role=Role.student)
        s2.set_password("Student@123")
        s3 = User(name="Benard Student", email="Benard@ustadi.local", role=Role.student)
        s3.set_password("Student@123")

        db.session.add_all([t1, s1, s2])
        db.session.commit()

        # Classes
        c1 = Class(name="Mathematics 101", description="Intro to Algebra", teacher_id=t1.id)
        db.session.add(c1)
        db.session.commit()

        # Enrollments
        e1 = Enrollment(student_id=s1.id, class_id=c1.id, status=EnrollmentStatus.active)
        e2 = Enrollment(student_id=s2.id, class_id=c1.id, status=EnrollmentStatus.active)
        db.session.add_all([e1, e2])
        db.session.commit()

        print("Seeding complete. Admin login: admin@ustadi.local / Admin@123")

if __name__ == "__main__":
    run()
