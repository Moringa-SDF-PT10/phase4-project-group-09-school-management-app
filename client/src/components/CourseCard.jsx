import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {course.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">TJ</span>
            </div>
            <span className="ml-2 text-sm text-gray-600">{course.teacher}</span>
          </div>
          <div className="text-orange-500 font-semibold">
            {course.price === 0 ? 'Free' : `KSh ${course.price}`}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>⏱️ {course.duration} hours</span>
          <span>👥 {course.students} students</span>
          <span>⭐ {course.rating}</span>
        </div>
        
        <Link
          to={`/courses/${course.id}`}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
        >
          Enroll Now
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;