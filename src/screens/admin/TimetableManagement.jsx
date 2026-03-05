import React, { useState } from 'react';
import { GripHorizontal, Trash2, Plus, Save, AlertCircle } from 'lucide-react';
import Container from '../../components/ui-components/container';
import timetableData from '../../data/admin/timetable.json';

export const TimetableManagement = () => {
  const [selectedClass, setSelectedClass] = useState('10A');
  const [draggedItem, setDraggedItem] = useState(null);
  const [timetable, setTimetable] = useState(timetableData.timetables);

  const classes = timetableData.classes;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const subjects = timetableData.subjects;
  const teachers = timetableData.teachers;

  const currentDayTimetables = timetable[selectedClass] || {};

  const handleDragStart = (e, item, day) => {
    setDraggedItem({ item, fromDay: day });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, toDay) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item, fromDay } = draggedItem;

    if (fromDay === toDay) {
      setDraggedItem(null);
      return;
    }

    // Remove from original day and add to new day
    setTimetable(prev => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        [fromDay]: prev[selectedClass][fromDay].filter(i => i.id !== item.id),
        [toDay]: [...prev[selectedClass][toDay], item],
      }
    }));

    setDraggedItem(null);
  };

  const handleAddSlot = (day) => {
    const newId = Math.max(...Object.values(currentDayTimetables).flat().map(i => i.id), 0) + 1;
    setTimetable(prev => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        [day]: [
          ...prev[selectedClass][day],
          { id: newId, time: '12:00-1:00', subject: 'Subject', teacher: 'Teacher Name' }
        ]
      }
    }));
  };

  const handleDeleteSlot = (day, id) => {
    setTimetable(prev => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        [day]: prev[selectedClass][day].filter(item => item.id !== id)
      }
    }));
  };

  const handleUpdateSlot = (day, id, field, value) => {
    setTimetable(prev => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        [day]: prev[selectedClass][day].map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const handleCreateNewClass = (className) => {
    if (!timetable[className]) {
      setTimetable(prev => ({
        ...prev,
        [className]: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
        }
      }));
      setSelectedClass(className);
    }
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
          <p className="text-gray-600 mt-1">Create and manage class timetables with drag-and-drop</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
          <Save className="w-4 h-4" />
          Save All
        </button>
      </div>

      {/* Class Selection */}
      <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Class</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => handleCreateNewClass(className) || setSelectedClass(className)}
              className={`py-2 px-3 rounded-lg font-medium transition ${
                selectedClass === className
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {className}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
        <div className="flex items-center gap-2 mb-4 text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Drag and drop classes to rearrange, edit subject and teacher information</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-900 w-20">Time</th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-3 text-center font-semibold text-gray-900 w-40">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-6">
          {dayKey.map((day, dayIndex) => (
            <div key={day} className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              <div className="bg-blue-600 text-white font-semibold p-3 text-center">
                {days[dayIndex]}
              </div>
              <div className="p-3 space-y-2 min-h-96 max-h-96 overflow-y-auto">
                {currentDayTimetables[day]?.map((slot) => (
                  <div
                    key={slot.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, slot, day)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day)}
                    className="bg-white border-2 border-gray-300 rounded-lg p-3 cursor-move hover:shadow-lg transition"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <GripHorizontal className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={slot.time}
                          onChange={(e) => handleUpdateSlot(day, slot.id, 'time', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50 text-gray-900"
                          placeholder="Time"
                        />
                        <select
                          value={slot.subject}
                          onChange={(e) => handleUpdateSlot(day, slot.id, 'subject', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900"
                        >
                          {subjects.map(subj => (
                            <option key={subj} value={subj}>{subj}</option>
                          ))}
                        </select>
                        <select
                          value={slot.teacher}
                          onChange={(e) => handleUpdateSlot(day, slot.id, 'teacher', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900"
                        >
                          {teachers.map(teacher => (
                            <option key={teacher} value={teacher}>{teacher}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(day, slot.id)}
                        className="text-red-600 hover:text-red-800 shrink-0 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => handleAddSlot(day)}
                  className="w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default TimetableManagement;
