import sys
sys.path.append('.')

from app import create_app, db
from app.models import User, Class, Enrollment, Role, Semester, EnrollmentStatus

def run_model_tests():
    """Runs a series of tests on the database models."""
    app = create_app()
    with app.app_context():
        print("--- Running Model Tests ---")

        # 1. Create new users (teacher and student)
        print("\n1. Creating new users...")
        try:
            teacher = User(name="Dr. Ada Lovelace", email="ada.lovelace@test.local", role=Role.teacher)
            teacher.set_password("password123")

            student = User(name="Charles Babbage", email="charles.babbage@test.local", role=Role.student)
            student.set_password("password456")

            db.session.add(teacher)
            db.session.add(student)
            db.session.commit()

            print(f"    - Created Teacher: {teacher.name} (ID: {teacher.id})")
            print(f"    - Created Student: {student.name} (ID: {student.id})")

        except Exception as e:
            db.session.rollback()
            print(f"    ERROR creating users: {e}")
            return

        # 2. Create a new class
        print("\n2. Creating a new class...")
        try:
            new_class = Class(name="Analytical Engines 101", description="The first computer", teacher_id=teacher.id)
            db.session.add(new_class)
            db.session.commit()
            print(f"    - Created Class: '{new_class.name}' (ID: {new_class.id}) taught by {new_class.teacher.name}")
        except Exception as e:
            db.session.rollback()
            print(f"    ERROR creating class: {e}")
            return

        # 3. Create an enrollment
        print("\n3. Enrolling student in the class...")
        try:
            enrollment = Enrollment(
                student_id=student.id,
                class_id=new_class.id,
                semester=Semester.first_semester,
                academic_year="2025-2026"
            )
            db.session.add(enrollment)
            db.session.commit()
            print(f"    - Enrolled '{enrollment.student.name}' in '{enrollment.class_.name}' (Enrollment ID: {enrollment.id})")
        except Exception as e:
            db.session.rollback()
            print(f"    ERROR creating enrollment: {e}")
            return
        
        # 4. Verify creations by querying
        print("\n4. Verifying data from database...")
        teacher_from_db = db.session.get(User, teacher.id)
        student_from_db = db.session.get(User, student.id)
        class_from_db = db.session.get(Class, new_class.id)
        enrollment_from_db = db.session.get(Enrollment, enrollment.id)

        print(f"    - Fetched Teacher: {teacher_from_db.name}")
        print(f"    - Fetched Student: {student_from_db.name}")
        print(f"    - Fetched Class: {class_from_db.name}")
        print(f"    - Fetched Enrollment: Student {enrollment_from_db.student.name} in {enrollment_from_db.class_.name}")

        # 5. Clean up the test data
        print("\n5. Cleaning up test data...")
        try:
            db.session.delete(enrollment)
            db.session.delete(new_class)
            db.session.delete(teacher)
            db.session.delete(student)
            db.session.commit()
            print("    - Test data successfully removed.")
        except Exception as e:
            db.session.rollback()
            print(f"    ERROR cleaning up data: {e}")

        print("\n--- Model Tests Complete ---")

if __name__ == "__main__":
    run_model_tests()
