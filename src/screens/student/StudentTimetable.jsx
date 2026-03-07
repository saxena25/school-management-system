import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import Container from '../../components/ui-components/container';

export const StudentTimetable = () => {
  // Mock timetable data for a student in class 10A
  const timetable = {
    monday: [
      { time: '9:00-10:00', subject: 'Mathematics', teacher: 'Mr. Kumar', room: '101' },
      { time: '10:00-11:00', subject: 'English', teacher: 'Ms. Sharma', room: '102' },
      { time: '11:00-12:00', subject: 'Science', teacher: 'Mr. Patel', room: '103' },
      { time: '12:00-1:00', subject: 'Lunch Break', teacher: '', room: '' },
      { time: '1:00-2:00', subject: 'History', teacher: 'Mr. Singh', room: '104' },
      { time: '2:00-3:00', subject: 'Geography', teacher: 'Ms. Gupta', room: '105' },
    ],
    tuesday: [
      { time: '9:00-10:00', subject: 'Science', teacher: 'Mr. Patel', room: '103' },
      { time: '10:00-11:00', subject: 'Mathematics', teacher: 'Mr. Kumar', room: '101' },
      { time: '11:00-12:00', subject: 'Hindi', teacher: 'Mr. Desai', room: '106' },
      { time: '12:00-1:00', subject: 'Lunch Break', teacher: '', room: '' },
      { time: '1:00-2:00', subject: 'Computer Science', teacher: 'Ms. Verma', room: '107' },
      { time: '2:00-3:00', subject: 'Sports', teacher: 'Coach Verma', room: 'Gym' },
    ],
    wednesday: [
      { time: '9:00-10:00', subject: 'English', teacher: 'Ms. Sharma', room: '102' },
      { time: '10:00-11:00', subject: 'History', teacher: 'Mr. Singh', room: '104' },
      { time: '11:00-12:00', subject: 'Mathematics', teacher: 'Mr. Kumar', room: '101' },
      { time: '12:00-1:00', subject: 'Lunch Break', teacher: '', room: '' },
      { time: '1:00-2:00', subject: 'Geography', teacher: 'Ms. Gupta', room: '105' },
      { time: '2:00-3:00', subject: 'Science', teacher: 'Mr. Patel', room: '103' },
    ],
    thursday: [
      { time: '9:00-10:00', subject: 'Hindi', teacher: 'Mr. Desai', room: '106' },
      { time: '10:00-11:00', subject: 'Computer Science', teacher: 'Ms. Verma', room: '107' },
      { time: '11:00-12:00', subject: 'English', teacher: 'Ms. Sharma', room: '102' },
      { time: '12:00-1:00', subject: 'Lunch Break', teacher: '', room: '' },
      { time: '1:00-2:00', subject: 'Mathematics', teacher: 'Mr. Kumar', room: '101' },
      { time: '2:00-3:00', subject: 'History', teacher: 'Mr. Singh', room: '104' },
    ],
    friday: [
      { time: '9:00-10:00', subject: 'Geography', teacher: 'Ms. Gupta', room: '105' },
      { time: '10:00-11:00', subject: 'Science', teacher: 'Mr. Patel', room: '103' },
      { time: '11:00-12:00', subject: 'Sports', teacher: 'Coach Verma', room: 'Gym' },
      { time: '12:00-1:00', subject: 'Lunch Break', teacher: '', room: '' },
      { time: '1:00-2:00', subject: 'English', teacher: 'Ms. Sharma', room: '102' },
      { time: '2:00-3:00', subject: 'Computer Science', teacher: 'Ms. Verma', room: '107' },
    ],
    saturday: [
      { time: '9:00-11:00', subject: 'Extra Curricular Activities', teacher: 'Various', room: 'Auditorium' },
      { time: '11:00-12:00', subject: 'Study Hall', teacher: 'Self Study', room: 'Library' },
    ],
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return (
    <Container className="space-y-6 py-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Calendar className="w-10 h-10" />
          Weekly Timetable
        </h1>
        <p className="text-blue-100">
          Class 10A - Academic Year 2025-2026
        </p>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                  Time
                </th>
                {days.map(day => (
                  <th key={day} className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200 capitalize">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Get all unique time slots */}
              {Array.from(new Set(
                Object.values(timetable).flat().map(slot => slot.time)
              )).sort().map(timeSlot => (
                <tr key={timeSlot} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {timeSlot}
                    </div>
                  </td>
                  {days.map(day => {
                    const slot = timetable[day].find(s => s.time === timeSlot);
                    return (
                      <td key={day} className="px-6 py-4 text-sm border-r border-gray-200 last:border-r-0">
                        {slot ? (
                          <div className={`p-3 rounded-lg ${
                            slot.subject === 'Lunch Break'
                              ? 'bg-orange-50 border border-orange-200'
                              : 'bg-blue-50 border border-blue-200'
                          }`}>
                            <div className="font-semibold text-gray-900 mb-1">
                              {slot.subject}
                            </div>
                            {slot.teacher && (
                              <div className="text-xs text-gray-600 mb-1">
                                {slot.teacher}
                              </div>
                            )}
                            {slot.room && (
                              <div className="text-xs text-gray-500">
                                Room: {slot.room}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span className="text-sm text-gray-700">Regular Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
            <span className="text-sm text-gray-700">Break Time</span>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default StudentTimetable;