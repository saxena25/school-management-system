import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import Container from '../../components/ui-components/container';
import { usersApi } from '../../services/api';
import { staggerContainer, staggerItem } from '../../utils/motion';

const emptyStudent = {
  name: '',
  email: '',
  className: '10A',
  rollNo: '',
  phone: '',
  address: '',
  admissionDate: new Date().toISOString().split('T')[0],
};

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState(emptyStudent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [usersData, meta] = await Promise.all([
        usersApi.list({ role: 'student' }),
        usersApi.meta(),
      ]);
      setStudents(usersData.users || []);
      setClasses(meta.classes || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      filterClass === 'All' || student.className === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.rollNo) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const data = await usersApi.createStudent(newStudent);
      setStudents((prev) => [data.user, ...prev]);
      setNewStudent(emptyStudent);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      const data = await usersApi.updateStudent(editingStudent.id, {
        name: editingStudent.name,
        email: editingStudent.email,
        className: editingStudent.className,
        rollNo: editingStudent.rollNo,
        phone: editingStudent.phone,
        address: editingStudent.address,
      });
      setStudents((prev) =>
        prev.map((s) => (s.id === data.user.id ? data.user : s))
      );
      setEditingStudent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await usersApi.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-1 text-gray-600">Live CRUD against the EduMS API</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </motion.button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-green-200 bg-green-50 p-6"
        >
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {['name', 'email', 'rollNo', 'phone', 'address'].map((field) => (
              <input
                key={field}
                placeholder={field}
                value={newStudent[field]}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, [field]: e.target.value })
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
              />
            ))}
            <select
              value={newStudent.className}
              onChange={(e) =>
                setNewStudent({ ...newStudent, className: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
            >
              {classes.map((cls) => (
                <option key={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddStudent}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
      >
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading students...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Class</th>
                <th className="px-4 py-3 text-center">Roll</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <motion.tr
                  key={student.id}
                  variants={staggerItem}
                  className="border-b hover:bg-gray-50"
                >
                  {editingStudent?.id === student.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          value={editingStudent.name}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              name: e.target.value,
                            })
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editingStudent.email}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              email: e.target.value,
                            })
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={editingStudent.className}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              className: e.target.value,
                            })
                          }
                          className="rounded border px-2 py-1"
                        >
                          {classes.map((cls) => (
                            <option key={cls}>{cls}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          value={editingStudent.rollNo}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              rollNo: e.target.value,
                            })
                          }
                          className="w-20 rounded border px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={handleUpdateStudent}
                          className="mr-2 text-green-600"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditingStudent(null)}>
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-gray-900">{student.name}</td>
                      <td className="px-4 py-3 text-gray-600">{student.email}</td>
                      <td className="px-4 py-3 text-center">{student.className}</td>
                      <td className="px-4 py-3 text-center">{student.rollNo}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="mr-2 text-blue-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </Container>
  );
};

export default StudentManagement;
