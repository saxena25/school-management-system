import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import Container from '../../components/ui-components/container';
import { usersApi } from '../../services/api';

const emptyTeacher = {
  name: '',
  email: '',
  phone: '',
  subjects: [],
  classes: [],
  qualifications: '',
  joinDate: new Date().toISOString().split('T')[0],
};

export const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState(emptyTeacher);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [usersData, meta] = await Promise.all([
        usersApi.list({ role: 'teacher' }),
        usersApi.meta(),
      ]);
      setTeachers(usersData.users || []);
      setSubjects(meta.subjects || []);
      setClasses(meta.classes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleInList = (list, value) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.phone) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const data = await usersApi.createTeacher(newTeacher);
      setTeachers((prev) => [data.user, ...prev]);
      setNewTeacher(emptyTeacher);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTeacher = async () => {
    try {
      const data = await usersApi.updateTeacher(editingTeacher.id, editingTeacher);
      setTeachers((prev) =>
        prev.map((t) => (t.id === data.user.id ? data.user : t))
      );
      setEditingTeacher(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await usersApi.deleteTeacher(id);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="mt-1 text-gray-600">Create and assign teachers via API</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white"
        >
          <Plus className="h-4 w-4" /> Add Teacher
        </motion.button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-white p-4 shadow">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teachers..."
            className="w-full rounded-lg border py-2 pl-10 pr-4"
          />
        </div>
      </div>

      {showForm && (
        <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              placeholder="Name"
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              className="rounded border px-3 py-2"
            />
            <input
              placeholder="Email"
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              className="rounded border px-3 py-2"
            />
            <input
              placeholder="Phone"
              value={newTeacher.phone}
              onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
              className="rounded border px-3 py-2"
            />
            <input
              placeholder="Qualifications"
              value={newTeacher.qualifications}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, qualifications: e.target.value })
              }
              className="rounded border px-3 py-2 md:col-span-3"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() =>
                  setNewTeacher({
                    ...newTeacher,
                    subjects: toggleInList(newTeacher.subjects, subject),
                  })
                }
                className={`rounded-full px-3 py-1 text-sm ${
                  newTeacher.subjects.includes(subject)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {classes.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() =>
                  setNewTeacher({
                    ...newTeacher,
                    classes: toggleInList(newTeacher.classes, cls),
                  })
                }
                className={`rounded-full px-3 py-1 text-sm ${
                  newTeacher.classes.includes(cls)
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddTeacher}
              className="rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              <Save className="mr-1 inline h-4 w-4" /> Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg bg-gray-200 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border bg-white shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading teachers...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Subjects</th>
                <th className="px-4 py-3 text-left">Classes</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="border-b hover:bg-gray-50">
                  {editingTeacher?.id === teacher.id ? (
                    <>
                      <td className="px-4 py-3" colSpan={4}>
                        <div className="grid gap-2 md:grid-cols-2">
                          <input
                            value={editingTeacher.name}
                            onChange={(e) =>
                              setEditingTeacher({
                                ...editingTeacher,
                                name: e.target.value,
                              })
                            }
                            className="rounded border px-2 py-1"
                          />
                          <input
                            value={editingTeacher.phone}
                            onChange={(e) =>
                              setEditingTeacher({
                                ...editingTeacher,
                                phone: e.target.value,
                              })
                            }
                            className="rounded border px-2 py-1"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={handleUpdateTeacher}
                          className="mr-2 text-green-600"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditingTeacher(null)}>
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">{teacher.name}</td>
                      <td className="px-4 py-3">{teacher.email}</td>
                      <td className="px-4 py-3 text-sm">
                        {(teacher.subjects || []).join(', ')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {(teacher.classes || []).join(', ')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setEditingTeacher(teacher)}
                          className="mr-2 text-blue-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  );
};

export default TeacherManagement;
