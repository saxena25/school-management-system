import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import Container from '../../components/ui-components/container';

export const TeacherManagement = () => {
  const data = require('../../data/admin/teacherManagement.json');
  const [teachers, setTeachers] = useState(data.teachers);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [],
    classes: [],
    qualifications: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [showForm, setShowForm] = useState(false);

  const subjects = data.subjects;
  const classes = data.classes;

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.phone) {
      alert('Please fill all required fields');
      return;
    }
    const id = Math.max(...teachers.map(t => t.id), 0) + 1;
    setTeachers([...teachers, { ...newTeacher, id }]);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      subjects: [],
      classes: [],
      qualifications: '',
      joinDate: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const handleUpdateTeacher = () => {
    if (!editingTeacher.name || !editingTeacher.email || !editingTeacher.phone) {
      alert('Please fill all required fields');
      return;
    }
    setTeachers(teachers.map(t => t.id === editingTeacher.id ? editingTeacher : t));
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const handleToggleSubject = (teacher, subject) => {
    const subjects = teacher.subjects.includes(subject)
      ? teacher.subjects.filter(s => s !== subject)
      : [...teacher.subjects, subject];
    return subjects;
  };

  const handleToggleClass = (teacher, className) => {
    const classes = teacher.classes.includes(className)
      ? teacher.classes.filter(c => c !== className)
      : [...teacher.classes, className];
    return classes;
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600 mt-1">Manage teachers and assign subjects/classes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
      </div>

      {/* Add Teacher Form */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add New Teacher</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="text"
                value={newTeacher.phone}
                onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                placeholder="Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
              <input
                type="text"
                value={newTeacher.qualifications}
                onChange={(e) => setNewTeacher({ ...newTeacher, qualifications: e.target.value })}
                placeholder="e.g., B.Tech, M.Sc"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <input
                type="date"
                value={newTeacher.joinDate}
                onChange={(e) => setNewTeacher({ ...newTeacher, joinDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Subjects Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {subjects.map(subject => (
                <label key={subject} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTeacher.subjects.includes(subject)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewTeacher({ ...newTeacher, subjects: [...newTeacher.subjects, subject] });
                      } else {
                        setNewTeacher({ ...newTeacher, subjects: newTeacher.subjects.filter(s => s !== subject) });
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Classes Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {classes.map(cls => (
                <label key={cls} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTeacher.classes.includes(cls)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewTeacher({ ...newTeacher, classes: [...newTeacher.classes, cls] });
                      } else {
                        setNewTeacher({ ...newTeacher, classes: newTeacher.classes.filter(c => c !== cls) });
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{cls}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddTeacher}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-medium transition"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-lg p-6 shadow border border-gray-200">
            {editingTeacher?.id === teacher.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={editingTeacher.phone}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Phone"
                />
                <input
                  type="text"
                  value={editingTeacher.qualifications}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, qualifications: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Qualifications"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                  <div className="grid grid-cols-2 gap-2">
                    {subjects.map(subject => (
                      <label key={subject} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTeacher.subjects.includes(subject)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingTeacher({ ...editingTeacher, subjects: [...editingTeacher.subjects, subject] });
                            } else {
                              setEditingTeacher({ ...editingTeacher, subjects: editingTeacher.subjects.filter(s => s !== subject) });
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-xs text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>
                  <div className="grid grid-cols-3 gap-2">
                    {classes.map(cls => (
                      <label key={cls} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTeacher.classes.includes(cls)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingTeacher({ ...editingTeacher, classes: [...editingTeacher.classes, cls] });
                            } else {
                              setEditingTeacher({ ...editingTeacher, classes: editingTeacher.classes.filter(c => c !== cls) });
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-xs text-gray-700">{cls}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateTeacher}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium text-sm transition"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTeacher(null)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-900 px-3 py-2 rounded-lg font-medium text-sm transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-1">{teacher.email}</p>
                <p className="text-sm text-gray-600 mb-3">{teacher.phone}</p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Qualifications:</span> {teacher.qualifications}
                </p>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map(subject => (
                      <span key={subject} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Classes:</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.classes.map(cls => (
                      <span key={cls} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setEditingTeacher(teacher)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-sm transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No teachers found</p>
        </div>
      )}
    </Container>
  );
};

export default TeacherManagement;
