import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Calendar } from 'lucide-react';
import Container from '../../components/ui-components/container';
import examData from '../../data/admin/examDateSheet.json';

export const ExamDateSheet = () => {
  const [exams, setExams] = useState(examData.exams);
  const [schedules, setSchedules] = useState(examData.schedules);

  const [selectedExam, setSelectedExam] = useState('Mid-Term Exams');
  const [editingExam, setEditingExam] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    class: '10A',
    subject: 'Mathematics',
    date: '',
    time: '10:00-12:00',
    room: '',
  });
  const [showNewScheduleForm, setShowNewScheduleForm] = useState(false);

  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Hindi', 'Computer Science'];
  const classes = ['8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'];
  const rooms = ['A101', 'A102', 'A103', 'A104', 'B101', 'B102', 'B103', 'B104'];

  const handleAddExam = () => {
    const newId = Math.max(...exams.map(e => e.id), 0) + 1;
    const newExam = {
      id: newId,
      examName: `Exam ${newId}`,
      startDate: '',
      endDate: '',
      status: 'planned'
    };
    setExams([...exams, newExam]);
    setEditingExam(newExam);
    setSchedules(prev => ({
      ...prev,
      [`Exam ${newId}`]: []
    }));
  };

  const handleUpdateExam = (id, field, value) => {
    const updatedExams = exams.map(exam =>
      exam.id === id ? { ...exam, [field]: value } : exam
    );
    setExams(updatedExams);
    if (editingExam?.id === id) {
      setEditingExam({ ...editingExam, [field]: value });
    }
  };

  const handleDeleteExam = (id, examName) => {
    const newExams = exams.filter(exam => exam.id !== id);
    setExams(newExams);
    const newSchedules = { ...schedules };
    delete newSchedules[examName];
    setSchedules(newSchedules);
    if (selectedExam === examName && newExams.length > 0) {
      setSelectedExam(newExams[0].examName);
    }
  };

  const handleAddSchedule = () => {
    if (!newSchedule.date || !newSchedule.room) {
      alert('Please fill all fields');
      return;
    }

    const newId = Math.max(...(schedules[selectedExam]?.map(s => s.id) || [0]), 0) + 1;
    const scheduleItem = { ...newSchedule, id: newId };

    setSchedules(prev => ({
      ...prev,
      [selectedExam]: [...(prev[selectedExam] || []), scheduleItem]
    }));

    setNewSchedule({
      class: '10A',
      subject: 'Mathematics',
      date: '',
      time: '10:00-12:00',
      room: '',
    });
    setShowNewScheduleForm(false);
  };

  const handleUpdateSchedule = (id, field, value) => {
    setSchedules(prev => ({
      ...prev,
      [selectedExam]: prev[selectedExam].map(schedule =>
        schedule.id === id ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(prev => ({
      ...prev,
      [selectedExam]: prev[selectedExam].filter(schedule => schedule.id !== id)
    }));
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam DateSheet</h1>
          <p className="text-gray-600 mt-1">Create and manage exam schedules for all classes</p>
        </div>
        <button
          onClick={handleAddExam}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          New Exam
        </button>
      </div>

      {/* Exam List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Exams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map(exam => (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam.examName)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedExam === exam.examName
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{exam.examName}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExam(exam.id, exam.examName);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {editingExam?.id === exam.id ? (
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={editingExam.startDate}
                      onChange={(e) => handleUpdateExam(exam.id, 'startDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                    />
                    <input
                      type="date"
                      value={editingExam.endDate}
                      onChange={(e) => handleUpdateExam(exam.id, 'endDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                    />
                    <button
                      onClick={() => setEditingExam(null)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm font-medium transition"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {exam.startDate ? new Date(exam.startDate).toLocaleDateString() : 'Start date not set'} -{' '}
                      {exam.endDate ? new Date(exam.endDate).toLocaleDateString() : 'End date not set'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingExam(exam);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm font-medium transition"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <span className={`flex-1 text-center text-xs font-semibold rounded py-1 ${
                        exam.status === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {exam.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Table for Selected Exam */}
      {selectedExam && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Exam Schedule - {selectedExam}</h2>
              <button
                onClick={() => setShowNewScheduleForm(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Add Schedule
              </button>
            </div>

            {/* Add Schedule Form */}
            {showNewScheduleForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      value={newSchedule.class}
                      onChange={(e) => setNewSchedule({ ...newSchedule, class: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      value={newSchedule.subject}
                      onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      {subjects.map(subj => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newSchedule.date}
                      onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      placeholder="10:00-12:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                    <select
                      value={newSchedule.room}
                      onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      <option value="">Select Room</option>
                      {rooms.map(room => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddSchedule}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <Save className="w-4 h-4" />
                    Add
                  </button>
                  <button
                    onClick={() => setShowNewScheduleForm(false)}
                    className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-medium transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Schedules Table */}
            {schedules[selectedExam]?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300 bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Class</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Subject</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Room</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules[selectedExam].map(schedule => (
                      <tr key={schedule.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{schedule.class}</td>
                        <td className="px-4 py-3 text-gray-900">{schedule.subject}</td>
                        <td className="px-4 py-3 text-gray-900">
                          <input
                            type="date"
                            value={schedule.date}
                            onChange={(e) => handleUpdateSchedule(schedule.id, 'date', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          <input
                            type="text"
                            value={schedule.time}
                            onChange={(e) => handleUpdateSchedule(schedule.id, 'time', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          <select
                            value={schedule.room}
                            onChange={(e) => handleUpdateSchedule(schedule.id, 'room', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                          >
                            {rooms.map(room => (
                              <option key={room} value={room}>{room}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No schedules added yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default ExamDateSheet;
