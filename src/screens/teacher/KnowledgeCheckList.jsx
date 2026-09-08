import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Users,
  Link2,
  Search,
  AlertCircle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteKnowledgeCheck,
  fetchKnowledgeChecks,
} from '../../store/knowledgeCheckSlice';
import AttachClassesDrawer from '../../components/AttachClassesDrawer';
import Container from '../../components/ui-components/container';
import { staggerContainer, staggerItem } from '../../utils/motion';

export const TeacherKnowledgeCheckList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { knowledgeChecks, loading, error } = useSelector(
    (state) => state.knowledgeCheck
  );
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedKCs, setSelectedKCs] = React.useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [showWarning, setShowWarning] = React.useState(false);

  useEffect(() => {
    dispatch(fetchKnowledgeChecks());
  }, [dispatch]);

  const filteredKnowledgeChecks = knowledgeChecks.filter(
    (kc) =>
      kc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (kc.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this KnowledgeCheck?')) {
      return;
    }
    await dispatch(deleteKnowledgeCheck(id));
  };

  const toggleKCSelection = (id) => {
    setSelectedKCs((prev) =>
      prev.includes(id) ? prev.filter((kcId) => kcId !== id) : [...prev, id]
    );
  };

  const handleAttachButtonClick = () => {
    if (selectedKCs.length === 0) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    setIsDrawerOpen(true);
  };

  return (
    <Container className="space-y-6 py-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/dashboard/knowledge-check-create')}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
          >
            <Plus className="h-5 w-5" />
            Create Knowledge Check
          </motion.button>

          <button
            onClick={handleAttachButtonClick}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium ${
              selectedKCs.length > 0
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <Link2 className="h-5 w-5" />
            Attach to Classes {selectedKCs.length > 0 && `(${selectedKCs.length})`}
          </button>
        </div>

        {showWarning && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Please select at least one knowledge check to attach to classes.
            </p>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search knowledge checks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-4"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          Loading knowledge checks...
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {filteredKnowledgeChecks.map((kc) => (
            <motion.div
              key={kc.id}
              variants={staggerItem}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedKCs.includes(kc.id)}
                  onChange={() => toggleKCSelection(kc.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{kc.title}</h3>
                  <p className="mt-1 text-gray-600">{kc.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {(kc.attachedClasses || []).join(', ') || 'No classes'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {kc.createdAt
                        ? new Date(kc.createdAt).toLocaleDateString()
                        : '—'}
                    </span>
                    <span>{(kc.questions || []).length} questions</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/knowledge-check-view/${kc.id}`)
                    }
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/knowledge-check-edit/${kc.id}`)
                    }
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(kc.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AttachClassesDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedKCs([]);
        }}
        knowledgeCheckIds={selectedKCs}
        knowledgeChecks={knowledgeChecks}
      />
    </Container>
  );
};

export default TeacherKnowledgeCheckList;
