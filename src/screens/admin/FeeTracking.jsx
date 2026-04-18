import React, { useState } from 'react';
import { DollarSign, AlertCircle, CheckCircle2, Clock, Trash2, Edit2, Save, X, Search, Download } from 'lucide-react';
import Container from '../../components/ui-components/container';
import studentsData from '../../data/admin/feeTracking.json';

export const FeeTracking = () => {
  const [students, setStudents] = useState(() => studentsData.students);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [editingStudent, setEditingStudent] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  const classes = studentsData.classes;

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
    const matchesClass = filterClass === 'All' || student.class === filterClass;
    return matchesSearch && matchesStatus && matchesClass;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'due') return b.totalDue - a.totalDue;
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  const stats = {
    totalStudents: students.length,
    feePaid: students.reduce((sum, s) => sum + s.totalPaid, 0),
    feePending: students.reduce((sum, s) => sum + s.totalDue, 0),
    paidCount: students.filter(s => s.status === 'paid').length,
    partialCount: students.filter(s => s.status === 'partial').length,
    overdueCount: students.filter(s => s.status === 'overdue').length,
  };

  const handleUpdatePayment = () => {
    if (!editingStudent) return;
    setStudents(students.map(s => 
      s.id === editingStudent.id 
        ? {
            ...editingStudent,
            totalPaid: editingStudent.tuitionPaid + editingStudent.uniformsPaid + editingStudent.booksPaid,
            totalDue: (editingStudent.tuitionFee + editingStudent.uniforms + editingStudent.books) - 
                      (editingStudent.tuitionPaid + editingStudent.uniformsPaid + editingStudent.booksPaid),
            status: (editingStudent.tuitionPaid + editingStudent.uniformsPaid + editingStudent.booksPaid) === 0 
              ? 'overdue'
              : (editingStudent.tuitionPaid + editingStudent.uniformsPaid + editingStudent.booksPaid) >= 
                (editingStudent.tuitionFee + editingStudent.uniforms + editingStudent.books)
              ? 'paid'
              : 'partial',
            lastPaymentDate: editingStudent.tuitionPaid > 0 || editingStudent.uniformsPaid > 0 || editingStudent.booksPaid > 0
              ? new Date().toISOString().split('T')[0]
              : editingStudent.lastPaymentDate
          }
        : s
    ));
    setEditingStudent(null);
  };

  const getStatusColor = (status) => {
    if (status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'partial') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'paid') return <CheckCircle2 className="w-4 h-4" />;
    if (status === 'partial') return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Class', 'Tuition Fee', 'Tuition Paid', 'Uniforms', 'Uniforms Paid', 'Books', 'Books Paid', 'Total Paid', 'Total Due', 'Status'];
    const rows = filteredStudents.map(s => [
      s.name, s.class, s.tuitionFee, s.tuitionPaid, s.uniforms, s.uniformsPaid, s.books, s.booksPaid, s.totalPaid, s.totalDue, s.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fee_tracking.csv';
    a.click();
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor student fee payments and outstanding dues</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Total Students</p>
          <p className="text-2xl font-bold text-blue-900">{stats.totalStudents}</p>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Fee Collected</p>
          <p className="text-2xl font-bold text-green-900">₹{(stats.feePaid / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-linear-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-gray-600 mb-1">Pending Fees</p>
          <p className="text-2xl font-bold text-red-900">₹{(stats.feePending / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Paid (Full)</p>
          <p className="text-2xl font-bold text-green-900">{stats.paidCount}</p>
        </div>
        <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-gray-600 mb-1">Partial/Overdue</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.partialCount + stats.overdueCount}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          >
            <option>All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          >
            <option value="name">Sort: Name</option>
            <option value="due">Sort: Due Amount</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Class</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Tuition</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Uniforms</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Books</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Total Paid</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Total Due</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {editingStudent ? (
                <tr className="border-b border-gray-200 bg-yellow-50">
                  <td colSpan="9" className="px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Paid</label>
                        <input
                          type="number"
                          value={editingStudent.tuitionPaid}
                          onChange={(e) => setEditingStudent({ ...editingStudent, tuitionPaid: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Uniforms Paid</label>
                        <input
                          type="number"
                          value={editingStudent.uniformsPaid}
                          onChange={(e) => setEditingStudent({ ...editingStudent, uniformsPaid: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Books Paid</label>
                        <input
                          type="number"
                          value={editingStudent.booksPaid}
                          onChange={(e) => setEditingStudent({ ...editingStudent, booksPaid: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdatePayment}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingStudent(null)}
                        className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-medium transition"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : null}
              {filteredStudents.map(student => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{student.name}</td>
                  <td className="px-4 py-3 text-center text-gray-900">{student.class}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm">
                      <div className="text-gray-600">₹{student.tuitionPaid} / ₹{student.tuitionFee}</div>
                      <div className="w-12 h-1 bg-gray-300 rounded mt-1 mx-auto overflow-hidden">
                        <div 
                          className="h-full bg-blue-600"
                          style={{ width: `${(student.tuitionPaid / student.tuitionFee) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm">
                      <div className="text-gray-600">₹{student.uniformsPaid} / ₹{student.uniforms}</div>
                      <div className="w-12 h-1 bg-gray-300 rounded mt-1 mx-auto overflow-hidden">
                        <div 
                          className="h-full bg-green-600"
                          style={{ width: `${(student.uniformsPaid / student.uniforms) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-sm">
                      <div className="text-gray-600">₹{student.booksPaid} / ₹{student.books}</div>
                      <div className="w-12 h-1 bg-gray-300 rounded mt-1 mx-auto overflow-hidden">
                        <div 
                          className="h-full bg-purple-600"
                          style={{ width: `${(student.booksPaid / student.books) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-green-700">₹{student.totalPaid}</td>
                  <td className="px-4 py-3 text-center font-semibold text-red-700">₹{student.totalDue}</td>
                  <td className="px-4 py-3 text-center">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-medium text-sm ${getStatusColor(student.status)}`}>
                      {getStatusIcon(student.status)}
                      {student.status}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setEditingStudent(student)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 bg-gray-50">
            <p className="text-gray-600">No students found</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default FeeTracking;
