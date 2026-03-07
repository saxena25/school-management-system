import React from 'react';
import { BookOpen, Users, GraduationCap, Award, Clock } from 'lucide-react';
import Container from '../../components/ui-components/container';

export const StudentCourses = () => {
  // Mock data for student's courses and class information
  const studentInfo = {
    name: "John Doe",
    class: "10A",
    rollNumber: "10A-15",
    totalStudents: 45,
    classTeacher: "Ms. Sharma"
  };

  const enrolledCourses = [
    {
      id: 1,
      name: "Mathematics",
      teacher: "Mr. Kumar",
      grade: "A",
      progress: 85,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      type: "core"
    },
    {
      id: 2,
      name: "English",
      teacher: "Ms. Sharma",
      grade: "B+",
      progress: 80,
      schedule: "Mon, Tue, Thu - 10:00 AM",
      type: "core"
    },
    {
      id: 3,
      name: "Science",
      teacher: "Mr. Patel",
      grade: "A",
      progress: 88,
      schedule: "Tue, Wed, Fri - 11:00 AM",
      type: "core"
    },
    {
      id: 4,
      name: "History",
      teacher: "Mr. Singh",
      grade: "A",
      progress: 90,
      schedule: "Mon, Thu - 1:00 PM",
      type: "core"
    },
    {
      id: 5,
      name: "Geography",
      teacher: "Ms. Gupta",
      grade: "A-",
      progress: 82,
      schedule: "Wed, Fri - 2:00 PM",
      type: "core"
    },
    {
      id: 6,
      name: "Computer Science",
      teacher: "Ms. Verma",
      grade: "A",
      progress: 87,
      schedule: "Tue, Thu - 2:00 PM",
      type: "elective"
    }
  ];

  const classmates = [
    { name: "Alice Johnson", rollNumber: "10A-01" },
    { name: "Bob Smith", rollNumber: "10A-02" },
    { name: "Charlie Brown", rollNumber: "10A-03" },
    { name: "Diana Wilson", rollNumber: "10A-04" },
    { name: "Emma Davis", rollNumber: "10A-05" },
    { name: "Frank Miller", rollNumber: "10A-06" },
    { name: "Grace Lee", rollNumber: "10A-07" },
    { name: "Henry Taylor", rollNumber: "10A-08" },
  ];

  const coreCourses = enrolledCourses.filter(course => course.type === 'core');
  const electiveCourses = enrolledCourses.filter(course => course.type === 'elective');

  return (
    <Container className="space-y-6 py-6">
      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-teal-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="w-10 h-10" />
          My Courses
        </h1>
        <p className="text-green-100">
          Track your academic progress and enrolled subjects
        </p>
      </div>

      {/* Class Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Class Information</h3>
              <p className="text-sm text-gray-600">Your current class details</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm"><span className="font-medium">Class:</span> {studentInfo.class}</p>
            <p className="text-sm"><span className="font-medium">Roll Number:</span> {studentInfo.rollNumber}</p>
            <p className="text-sm"><span className="font-medium">Class Teacher:</span> {studentInfo.classTeacher}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Classmates</h3>
              <p className="text-sm text-gray-600">Total students in your class</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{studentInfo.totalStudents}</div>
          <p className="text-sm text-gray-600">Students enrolled</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <p className="text-sm text-gray-600">Overall grade average</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">A-</div>
          <p className="text-sm text-gray-600">Current semester</p>
        </div>
      </div>

      {/* Core Courses */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Core Subjects (Grade {studentInfo.class.charAt(0)})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreCourses.map((course) => (
            <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{course.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                  course.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {course.grade}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Teacher: {course.teacher}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.schedule}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-700">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-green-400 to-green-600"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Elective Courses */}
      {electiveCourses.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Elective Subjects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {electiveCourses.map((course) => (
              <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{course.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                    course.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {course.grade}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Teacher: {course.teacher}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.schedule}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-700">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-400 to-blue-600"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Classmates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Classmates (Grade {studentInfo.class.charAt(0)}{studentInfo.class.charAt(1)})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {classmates.map((classmate, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {classmate.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{classmate.name}</p>
                  <p className="text-sm text-gray-600">{classmate.rollNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Showing {classmates.length} of {studentInfo.totalStudents} classmates
          </p>
        </div>
      </div>
    </Container>
  );
};

export default StudentCourses;