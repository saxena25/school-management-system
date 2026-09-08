import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit2,
  Save,
  X,
  Search,
  Download,
} from 'lucide-react';
import Container from '../../components/ui-components/container';
import { feeApi } from '../../services/api';

export const FeeTracking = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingStudent, setEditingStudent] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await feeApi.list();
      setStudents(data.students || []);
      setStats(data.stats);
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

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'All' || student.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'due') return b.totalDue - a.totalDue;
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  const handleUpdatePayment = async () => {
    try {
      const data = await feeApi.update(editingStudent.id, {
        tuitionPaid: editingStudent.tuitionPaid,
        uniformsPaid: editingStudent.uniformsPaid,
        booksPaid: editingStudent.booksPaid,
        tuitionFee: editingStudent.tuitionFee,
        uniforms: editingStudent.uniforms,
        books: editingStudent.books,
      });
      setStudents((prev) =>
        prev.map((s) => (s.id === data.student.id ? data.student : s))
      );
      setEditingStudent(null);
      const refreshed = await feeApi.list();
      setStats(refreshed.stats);
    } catch (err) {
      setError(err.message);
    }
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
    const headers = [
      'Name',
      'Class',
      'Tuition Fee',
      'Tuition Paid',
      'Uniforms',
      'Uniforms Paid',
      'Books',
      'Books Paid',
      'Total Paid',
      'Total Due',
      'Status',
    ];
    const rows = filteredStudents.map((s) => [
      s.name,
      s.class,
      s.tuitionFee,
      s.tuitionPaid,
      s.uniforms,
      s.uniformsPaid,
      s.books,
      s.booksPaid,
      s.totalPaid,
      s.totalDue,
      s.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fee_tracking.csv';
    a.click();
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Tracking</h1>
          <p className="mt-1 text-gray-600">Payments synced through the API</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={exportToCSV}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
        >
          <Download className="h-4 w-4" /> Export
        </motion.button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-blue-900">{stats.totalStudents}</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-gray-600">Fee Collected</p>
            <p className="text-2xl font-bold text-green-900">
              ₹{(stats.feePaid / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-gray-600">Pending Fees</p>
            <p className="text-2xl font-bold text-red-900">
              ₹{(stats.feePending / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-gray-600">Paid (Full)</p>
            <p className="text-2xl font-bold text-green-900">{stats.paidCount}</p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-gray-600">Partial/Overdue</p>
            <p className="text-2xl font-bold text-yellow-900">
              {stats.partialCount + stats.overdueCount}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 rounded-lg border bg-white p-6 shadow md:grid-cols-3">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-lg border py-2 pl-10 pr-4"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="All">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="name">Sort: Name</option>
          <option value="due">Sort: Due Amount</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading fees...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-center">Class</th>
                <th className="px-4 py-3 text-center">Total Paid</th>
                <th className="px-4 py-3 text-center">Total Due</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {editingStudent && (
                <tr className="border-b bg-yellow-50">
                  <td colSpan="6" className="px-4 py-4">
                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      {['tuitionPaid', 'uniformsPaid', 'booksPaid'].map((field) => (
                        <div key={field}>
                          <label className="mb-1 block text-sm font-medium capitalize">
                            {field}
                          </label>
                          <input
                            type="number"
                            value={editingStudent[field]}
                            onChange={(e) =>
                              setEditingStudent({
                                ...editingStudent,
                                [field]: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full rounded-lg border px-3 py-2"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdatePayment}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white"
                      >
                        <Save className="h-4 w-4" /> Save
                      </button>
                      <button
                        onClick={() => setEditingStudent(null)}
                        className="flex items-center gap-2 rounded-lg bg-gray-300 px-4 py-2"
                      >
                        <X className="h-4 w-4" /> Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3 text-center">{student.class}</td>
                  <td className="px-4 py-3 text-center font-semibold text-green-700">
                    ₹{student.totalPaid}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-red-700">
                    ₹{student.totalDue}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-medium ${getStatusColor(
                        student.status
                      )}`}
                    >
                      {getStatusIcon(student.status)}
                      {student.status}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setEditingStudent(student)}
                      className="text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  );
};

export default FeeTracking;
