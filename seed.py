from app import create_app, db
from app.models import User, Class, Enrollment, Role, EnrollmentStatus, Semester

app = create_app()

with app.app_context():
    print("Clearing existing data...")
    db.drop_all()
    db.create_all()

    print("Seeding admin user...")
    admin = User(name="Admin User", email="admin@ustadi.local", role=Role.admin)
    admin.set_password("Admin@123")
    db.session.add(admin)

    print("Seeding teacher user...")
    teacher = User(name="Teacher User", email="teacher@ustadi.local", role=Role.teacher)
    teacher.set_password("Teacher@123")
    db.session.add(teacher)

    print("Seeding student users...")
    student1 = User(name="Student One", email="student1@ustadi.local", role=Role.student)
    student1.set_password("Student@123")
    student2 = User(name="Student Two", email="student2@ustadi.local", role=Role.student)
    student2.set_password("Student@123")
    db.session.add_all([student1, student2])

    db.session.commit()

    print("Seeding classes...")
    class1 = Class(name="Mathematics 101", description="Introduction to Algebra", teacher_id=teacher.id)
    class2 = Class(name="History 202", description="World History from 1900", teacher_id=teacher.id)
    db.session.add_all([class1, class2])

    db.session.commit()

    print("Seeding enrollments...")
    enrollment1 = Enrollment(student_id=student1.id, class_id=class1.id, status=EnrollmentStatus.active, semester=Semester.first_semester, academic_year="2024/2025")
    enrollment2 = Enrollment(student_id=student2.id, class_id=class1.id, status=EnrollmentStatus.active, semester=Semester.first_semester, academic_year="2024/2025")
    enrollment3 = Enrollment(student_id=student1.id, class_id=class2.id, status=EnrollmentStatus.active, semester=Semester.first_semester, academic_year="2024/2025")
    db.session.add_all([enrollment1, enrollment2, enrollment3])

    db.session.commit()
    print("Database seeded successfully!")
