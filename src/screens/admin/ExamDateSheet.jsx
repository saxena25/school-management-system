import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Calendar } from 'lucide-react';
import Container from '../../components/ui-components/container';
import { examApi } from '../../services/api';

export const ExamDateSheet = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [showNewScheduleForm, setShowNewScheduleForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    class: '10A',
    subject: 'Mathematics',
    date: '',
    time: '10:00-12:00',
    room: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await examApi.list();
      setExams(data.exams || []);
      setClasses(data.classes || []);
      setSubjects(data.subjects || []);
      setRooms(data.rooms || []);
      if (!selectedExamId && data.exams?.[0]) {
        setSelectedExamId(data.exams[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectedExam = useMemo(
    () => exams.find((e) => e.id === selectedExamId) || exams[0],
    [exams, selectedExamId]
  );

  const handleAddExam = async () => {
    try {
      const data = await examApi.create({
        examName: `Exam ${exams.length + 1}`,
        status: 'planned',
      });
      setExams((prev) => [data.exam, ...prev]);
      setSelectedExamId(data.exam.id);
      setEditingExam(data.exam);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveExam = async () => {
    if (!editingExam) return;
    try {
      const data = await examApi.update(editingExam.id, editingExam);
      setExams((prev) => prev.map((e) => (e.id === data.exam.id ? data.exam : e)));
      setEditingExam(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExam = async (id) => {
    try {
      await examApi.remove(id);
      const next = exams.filter((e) => e.id !== id);
      setExams(next);
      setSelectedExamId(next[0]?.id || null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSchedule = async () => {
    if (!selectedExam || !newSchedule.date || !newSchedule.room) {
      setError('Please fill all fields');
      return;
    }
    try {
      const data = await examApi.addSchedule(selectedExam.id, newSchedule);
      setExams((prev) => prev.map((e) => (e.id === data.exam.id ? data.exam : e)));
      setNewSchedule({
        class: '10A',
        subject: 'Mathematics',
        date: '',
        time: '10:00-12:00',
        room: '',
      });
      setShowNewScheduleForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const data = await examApi.removeSchedule(selectedExam.id, scheduleId);
      setExams((prev) => prev.map((e) => (e.id === data.exam.id ? data.exam : e)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam DateSheet</h1>
          <p className="mt-1 text-gray-600">Persisted exam schedules</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={handleAddExam}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white"
        >
          <Plus className="h-4 w-4" /> New Exam
        </motion.button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          Loading exams...
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <motion.div
                key={exam.id}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedExamId(exam.id)}
                className={`cursor-pointer rounded-xl border p-4 shadow-sm ${
                  selectedExam?.id === exam.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exam.examName}</h3>
                    <p className="text-sm text-gray-500 capitalize">{exam.status}</p>
                  </div>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">
                  {exam.startDate || 'TBD'} → {exam.endDate || 'TBD'}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingExam(exam);
                    }}
                    className="text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExam(exam.id);
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {editingExam && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="grid gap-3 md:grid-cols-4">
                <input
                  value={editingExam.examName}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, examName: e.target.value })
                  }
                  className="rounded border px-3 py-2"
                />
                <input
                  type="date"
                  value={editingExam.startDate || ''}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, startDate: e.target.value })
                  }
                  className="rounded border px-3 py-2"
                />
                <input
                  type="date"
                  value={editingExam.endDate || ''}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, endDate: e.target.value })
                  }
                  className="rounded border px-3 py-2"
                />
                <select
                  value={editingExam.status}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, status: e.target.value })
                  }
                  className="rounded border px-3 py-2"
                >
                  <option value="planned">planned</option>
                  <option value="scheduled">scheduled</option>
                  <option value="completed">completed</option>
                </select>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleSaveExam}
                  className="rounded-lg bg-green-600 px-3 py-2 text-white"
                >
                  <Save className="mr-1 inline h-4 w-4" /> Save
                </button>
                <button
                  onClick={() => setEditingExam(null)}
                  className="rounded-lg bg-gray-200 px-3 py-2"
                >
                  <X className="mr-1 inline h-4 w-4" /> Cancel
                </button>
              </div>
            </div>
          )}

          {selectedExam && (
            <div className="rounded-lg border bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Schedules · {selectedExam.examName}
                </h2>
                <button
                  onClick={() => setShowNewScheduleForm(true)}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-white"
                >
                  Add Schedule
                </button>
              </div>

              {showNewScheduleForm && (
                <div className="mb-4 grid gap-3 rounded-lg border bg-gray-50 p-4 md:grid-cols-5">
                  <select
                    value={newSchedule.class}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, class: e.target.value })
                    }
                    className="rounded border px-2 py-2"
                  >
                    {classes.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={newSchedule.subject}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, subject: e.target.value })
                    }
                    className="rounded border px-2 py-2"
                  >
                    {subjects.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, date: e.target.value })
                    }
                    className="rounded border px-2 py-2"
                  />
                  <input
                    value={newSchedule.time}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, time: e.target.value })
                    }
                    className="rounded border px-2 py-2"
                  />
                  <select
                    value={newSchedule.room}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, room: e.target.value })
                    }
                    className="rounded border px-2 py-2"
                  >
                    <option value="">Room</option>
                    {rooms.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <div className="md:col-span-5 flex gap-2">
                    <button
                      onClick={handleAddSchedule}
                      className="rounded-lg bg-green-600 px-3 py-2 text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowNewScheduleForm(false)}
                      className="rounded-lg bg-gray-200 px-3 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {(selectedExam.schedules || []).map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {schedule.class} · {schedule.subject}
                      </p>
                      <p className="text-sm text-gray-600">
                        {schedule.date} · {schedule.time} · {schedule.room}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ExamDateSheet;
