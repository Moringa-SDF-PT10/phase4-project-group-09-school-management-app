from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models import Enrollment, Class, User, Role, EnrollmentStatus
from app.utils import role_required
from datetime import datetime

enrollments_bp = Blueprint('enrollments', __name__)

@enrollments_bp.route('/teacher/enrollments/', methods=['GET'])
@enrollments_bp.route('/teacher/enrollments', methods=['GET'])
@jwt_required()
@role_required('teacher')
def get_teacher_enrollments():

    teacher_id = get_jwt_identity()

    # Get all classes taught by this teacher
    teacher_classes = Class.query.filter_by(teacher_id=teacher_id).all()
    class_ids = [c.id for c in teacher_classes]

    # Get all enrollments for those classes
    enrollments = Enrollment.query.filter(Enrollment.class_id.in_(class_ids)).all()

    enrollment_list = []
    for enrollment in enrollments:
        student = enrollment.student
        class_ = enrollment.class_
        enrollment_list.append({
            'value': enrollment.id,
            'label': f"{student.first_name} {student.last_name} - {class_.name}"
        })
    
    return jsonify(enrollment_list), 200


@enrollments_bp.post('/')
@jwt_required()
@role_required('admin')
def create_enrollment():
    data = request.get_json()
    student_id = data.get('student_id')
    class_id = data.get('class_id')
    enrollment_date_str = data.get('enrollment_date')

    if not all([student_id, class_id, enrollment_date_str]):
        return jsonify({'msg': 'Missing required fields'}), 400

    # Validate student and class
    student = User.query.get_or_404(student_id)
    if student.role != Role.student:
        return jsonify({'msg': 'User is not a student'}), 400
    
    class_to_enroll = Class.query.get_or_404(class_id)

    # Check for existing enrollment
    existing_enrollment = Enrollment.query.filter_by(student_id=student_id, class_id=class_id).first()
    if existing_enrollment:
        return jsonify({'msg': 'Student is already enrolled in this class'}), 409

    # Check class capacity
    if class_to_enroll.capacity is not None and len(class_to_enroll.enrollments) >= class_to_enroll.capacity:
        return jsonify({'msg': 'Class is at full capacity'}), 409

    try:
        enrollment_date = datetime.fromisoformat(enrollment_date_str.replace('Z', '+00:00')).date()
    except ValueError:
        return jsonify({'msg': 'Invalid date format for enrollment_date'}), 400

    new_enrollment = Enrollment(
        student_id=student_id,
        class_id=class_id,
        enrollment_date=enrollment_date,
        status=EnrollmentStatus.active
    )
    db.session.add(new_enrollment)
    db.session.commit()

    return jsonify({'msg': 'Student enrolled successfully', 'enrollment': new_enrollment.to_dict()}), 201


@enrollments_bp.route('/enroll/<int:class_id>', methods=['POST'])
@jwt_required()
@role_required('student')
def enroll_in_class(class_id):
    student_id = get_jwt_identity()
    class_to_enroll = Class.query.get_or_404(class_id)

    if len(class_to_enroll.enrollments) >= class_to_enroll.capacity:
        return jsonify({'msg': 'Class is full'}), 400

    existing_enrollment = Enrollment.query.filter_by(student_id=student_id, class_id=class_id).first()
    if existing_enrollment:
        return jsonify({'msg': 'Already enrolled in this class'}), 400

    enrollment = Enrollment(student_id=student_id, class_id=class_id)
    db.session.add(enrollment)
    db.session.commit()

    return jsonify({'msg': 'Enrolled successfully', 'enrollment': enrollment.to_dict()}), 201

@enrollments_bp.route('/my-classes', methods=['GET'])
@jwt_required()
@role_required('student')
def get_my_classes():
    student_id = get_jwt_identity()
    enrollments = Enrollment.query.filter_by(student_id=student_id).all()
    
    enrolled_classes = []
    for enrollment in enrollments:
        class_info = {
            'enrollment_id': enrollment.id,
            'class': enrollment.class_.to_dict(),
            'status': enrollment.status.value
        }
        enrolled_classes.append(class_info)

    return jsonify(enrolled_classes), 200

@enrollments_bp.route('/drop/<int:class_id>', methods=['DELETE'])
@jwt_required()
@role_required('student')
def drop_class(class_id):
    student_id = get_jwt_identity()
    enrollment = Enrollment.query.filter_by(student_id=student_id, class_id=class_id).first_or_404()

    db.session.delete(enrollment)
    db.session.commit()

    return jsonify({'msg': 'Successfully dropped class'}), 200


# Admin/Teacher routes
@enrollments_bp.route('/class/<int:class_id>/enrollments', methods=['GET'])
@jwt_required()
@role_required('admin', 'teacher')
def get_class_enrollments(class_id):
    enrollments = Enrollment.query.filter_by(class_id=class_id).all()
    return jsonify([e.to_dict(include_student=True) for e in enrollments]), 200

@enrollments_bp.route('/<int:enrollment_id>/update-status', methods=['PUT'])
@jwt_required()
@role_required('admin', 'teacher')
def update_enrollment_status(enrollment_id):
    enrollment = Enrollment.query.get_or_404(enrollment_id)
    data = request.get_json()
    new_status = data.get('status')

    if not new_status or new_status not in [status.value for status in EnrollmentStatus]:
        return jsonify({'msg': 'Invalid status provided'}), 400

    enrollment.status = EnrollmentStatus(new_status)
    db.session.commit()

    return jsonify({'msg': 'Enrollment status updated', 'enrollment': enrollment.to_dict()}), 200
