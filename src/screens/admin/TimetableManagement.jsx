import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GripHorizontal, Trash2, Plus, Save, Download, AlertCircle } from 'lucide-react';
import Container from '../../components/ui-components/container';
import { timetableApi } from '../../services/api';

const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const TimetableManagement = () => {
  const [selectedClass, setSelectedClass] = useState('10A');
  const [draggedItem, setDraggedItem] = useState(null);
  const [timetable, setTimetable] = useState({});
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const data = await timetableApi.list();
      const mapped = {};
      Object.entries(data.timetables || {}).forEach(([className, value]) => {
        mapped[className] = value;
      });
      setTimetable(mapped);
      setClasses(data.classes || []);
      setSubjects(data.subjects || []);
      setTeachers(data.teachers || []);
      if (data.selectedClass) setSelectedClass(data.selectedClass);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const ensureClass = (className) => {
    if (!timetable[className]) {
      setTimetable((prev) => ({
        ...prev,
        [className]: {
          className,
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
        },
      }));
    }
    setSelectedClass(className);
  };

  const current = timetable[selectedClass] || {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  };

  const handleDragStart = (e, item, day) => {
    setDraggedItem({ item, fromDay: day });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, toDay) => {
    e.preventDefault();
    if (!draggedItem) return;
    const { item, fromDay } = draggedItem;
    if (fromDay === toDay) {
      setDraggedItem(null);
      return;
    }

    setTimetable((prev) => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        [fromDay]: prev[selectedClass][fromDay].filter((i) => i.id !== item.id),
        [toDay]: [...(prev[selectedClass][toDay] || []), item],
      },
    }));
    setDraggedItem(null);
  };

  const handleAddSlot = (day) => {
    const allIds = dayKeys.flatMap((d) => (current[d] || []).map((i) => i.id));
    const newId = Math.max(0, ...allIds) + 1;
    setTimetable((prev) => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        className: selectedClass,
        [day]: [
          ...(prev[selectedClass]?.[day] || []),
          {
            id: newId,
            time: '12:00-1:00',
            subject: subjects[0] || 'Subject',
            teacher: teachers[0] || 'Teacher',
          },
        ],
      },
    }));
  };

  const handleDeleteSlot = (day, id) => {
    setTimetable((prev) => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        [day]: prev[selectedClass][day].filter((item) => item.id !== id),
      },
    }));
  };

  const handleUpdateSlot = (day, id, field, value) => {
    setTimetable((prev) => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        [day]: prev[selectedClass][day].map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = timetable[selectedClass] || current;
      await timetableApi.save(selectedClass, payload);
      setMessage('Timetable saved');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExportTimetable = () => {
    const rows = dayKeys.flatMap((day, dayIndex) =>
      (current[day] || []).map((slot) => [
        dayLabels[dayIndex],
        slot.time,
        slot.subject,
        slot.teacher,
      ])
    );
    const csv = [['Day', 'Time', 'Subject', 'Teacher'], ...rows]
      .map((r) => r.join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedClass}-timetable.csv`;
    link.click();
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
          <p className="mt-1 text-gray-600">Drag, edit, then save to MongoDB</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportTimetable}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save All'}
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="rounded-lg border bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Select Class</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5 lg:grid-cols-10">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => ensureClass(className)}
              className={`rounded-lg px-3 py-2 font-medium transition ${
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

      <div className="rounded-lg border bg-white p-6 shadow">
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-yellow-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            Drag slots between days, then click Save All to persist.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {dayKeys.map((day, dayIndex) => (
            <div
              key={day}
              className="overflow-hidden rounded-lg border border-gray-300 bg-gray-50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, day)}
            >
              <div className="bg-blue-600 p-3 text-center font-semibold text-white">
                {dayLabels[dayIndex]}
              </div>
              <div className="max-h-96 min-h-96 space-y-2 overflow-y-auto p-3">
                {(current[day] || []).map((slot) => (
                  <motion.div
                    key={slot.id}
                    layout
                    draggable
                    onDragStart={(e) => handleDragStart(e, slot, day)}
                    className="cursor-grab rounded-lg border-2 border-gray-300 bg-white p-3 hover:shadow-lg"
                  >
                    <div className="mb-2 flex items-start gap-2">
                      <GripHorizontal className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={slot.time}
                          onChange={(e) =>
                            handleUpdateSlot(day, slot.id, 'time', e.target.value)
                          }
                          className="w-full rounded border bg-gray-50 px-2 py-1 text-sm"
                        />
                        <select
                          value={slot.subject}
                          onChange={(e) =>
                            handleUpdateSlot(day, slot.id, 'subject', e.target.value)
                          }
                          className="w-full rounded border px-2 py-1 text-sm"
                        >
                          {subjects.map((subj) => (
                            <option key={subj}>{subj}</option>
                          ))}
                        </select>
                        <select
                          value={slot.teacher}
                          onChange={(e) =>
                            handleUpdateSlot(day, slot.id, 'teacher', e.target.value)
                          }
                          className="w-full rounded border px-2 py-1 text-sm"
                        >
                          {teachers.map((teacher) => (
                            <option key={teacher}>{teacher}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(day, slot.id)}
                        className="mt-1 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <button
                  onClick={() => handleAddSlot(day)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-gray-600 hover:border-blue-600 hover:text-blue-600"
                >
                  <Plus className="h-4 w-4" /> Add Slot
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
