import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Users,
  Link2,
  Search,
  AlertCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteKnowledgeCheck } from '../../store/knowledgeCheckSlice';
import AttachClassesDrawer from '../../components/AttachClassesDrawer';
import Container from '../../components/ui-components/container';

export const TeacherKnowledgeCheckList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const knowledgeChecks = useSelector((state) => state.knowledgeCheck.knowledgeChecks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKCs, setSelectedKCs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningTimeout, setWarningTimeout] = useState(null);

  const filteredKnowledgeChecks = knowledgeChecks.filter(kc =>
    kc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this KnowledgeCheck?')) {
      dispatch(deleteKnowledgeCheck(id));
    }
  };

  const toggleKCSelection = (id) => {
    setSelectedKCs(prev =>
      prev.includes(id)
        ? prev.filter(kcId => kcId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedKCs.length === filteredKnowledgeChecks.length) {
      setSelectedKCs([]);
    } else {
      setSelectedKCs(filteredKnowledgeChecks.map(kc => kc.id));
    }
  };

  const handleAttachButtonClick = () => {
    if (selectedKCs.length === 0) {
      setShowWarning(true);
      if (warningTimeout) clearTimeout(warningTimeout);
      const timeout = setTimeout(() => setShowWarning(false), 3000);
      setWarningTimeout(timeout);
      return;
    }
    setIsDrawerOpen(true);
  };

  return (
    <Container className="space-y-6 py-6">
      {/* Header */}
      {/* <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Knowledge Checks</h1>
        <p className="text-purple-100">
          Create and manage knowledge checks for your classes
        </p>
      </div> */}

      {/* Create Button & Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/dashboard/knowledge-check-create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium hover:cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Create Knowledge Check
          </button>

          <button
            onClick={handleAttachButtonClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium hover:cursor-pointer ${
              selectedKCs.length > 0
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Link2 className="w-5 h-5" />
            Attach to Classes {selectedKCs.length > 0 && `(${selectedKCs.length})`}
          </button>
        </div>

        {/* Warning Popover */}
        {showWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Please select at least one knowledge check to attach to classes.
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search knowledge checks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Knowledge Checks Grid */}
      <div className="space-y-4">
        {filteredKnowledgeChecks.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Knowledge Checks Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search criteria'
                : 'Create your first knowledge check to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/dashboard/knowledge-check-create')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create First Knowledge Check
              </button>
            )}
          </div>
        ) : (
          filteredKnowledgeChecks.map(kc => (
            <div
              key={kc.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedKCs.includes(kc.id)}
                    onChange={() => toggleKCSelection(kc.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-2"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {kc.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{kc.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(kc.createdDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {kc.questions.length} Questions
                      </div>
                      <div className="flex items-center gap-1">
                        Classes: {kc.attachedClasses?.length > 0 ? kc.attachedClasses.join(', ') : 'Not attached'}
                      </div>
                    </div>

                    {/* Question Preview */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Question Types:
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {Array.from(
                          new Set(kc.questions.map(q => q.type))
                        ).map(type => (
                          <span
                            key={type}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              type === 'single-select'
                                ? 'bg-blue-100 text-blue-700'
                                : type === 'multi-select'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {type === 'single-select'
                              ? 'Single Select'
                              : type === 'multi-select'
                              ? 'Multi Select'
                              : 'Yes/No'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/knowledge-check-edit/${kc.id}`)
                    }
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/knowledge-check-view/${kc.id}`)
                    }
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(kc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Attach Classes Drawer */}
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