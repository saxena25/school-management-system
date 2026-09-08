import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Download } from 'lucide-react';
import { useSelector } from 'react-redux';
import Container from '../../components/ui-components/container';
import { timetableApi } from '../../services/api';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const StudentTimetable = () => {
  const user = useSelector((state) => state.auth.user);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const className = user?.className || '10A';
    timetableApi
      .get(className)
      .then((data) => setTimetable(data.timetable))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.className]);

  const handleExportTimetable = () => {
    if (!timetable) return;
    const rows = [];
    days.forEach((day) => {
      (timetable[day] || []).forEach((slot) => {
        rows.push([
          day,
          slot.time,
          slot.subject,
          slot.teacher || '-',
          slot.room || '-',
        ]);
      });
    });
    const csv = [['Day', 'Time', 'Subject', 'Teacher', 'Room'], ...rows]
      .map((r) => r.join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user?.className || 'class'}-timetable.csv`;
    a.click();
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Timetable</h1>
          <p className="mt-1 text-gray-600">
            Class {user?.className || '—'} · loaded from API
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={handleExportTimetable}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          <Download className="h-4 w-4" /> Export
        </motion.button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          Loading timetable...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {days.map((day) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div className="flex items-center gap-2 bg-blue-600 px-4 py-3 font-semibold capitalize text-white">
                <Calendar className="h-4 w-4" />
                {day}
              </div>
              <div className="space-y-2 p-4">
                {(timetable?.[day] || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No classes</p>
                ) : (
                  (timetable[day] || []).map((slot) => (
                    <div
                      key={`${day}-${slot.id}-${slot.time}`}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="mb-1 flex items-center gap-2 text-sm text-blue-700">
                        <Clock className="h-3.5 w-3.5" />
                        {slot.time}
                      </div>
                      <p className="font-semibold text-gray-900">{slot.subject}</p>
                      <p className="text-sm text-gray-600">
                        {slot.teacher}
                        {slot.room ? ` · ${slot.room}` : ''}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default StudentTimetable;
