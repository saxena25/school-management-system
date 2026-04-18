import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateKnowledgeCheck } from '../../store/knowledgeCheckSlice';
import ReusableDrawer from '../ui-components/ReusableDrawer';

const CLASSES = ['8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'];

export const AttachClassesDrawer = ({ isOpen, onClose, knowledgeCheckIds, knowledgeChecks }) => {
  const dispatch = useDispatch();
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all unique classes currently attached to selected knowledge checks
  useEffect(() => {
    if (isOpen && knowledgeCheckIds.length > 0) {
      const kcsData = knowledgeChecks.filter(kc => knowledgeCheckIds.includes(kc.id));
      if (kcsData.length > 0) {
        const allClasses = new Set();
        kcsData.forEach(kc => {
          (kc.attachedClasses || []).forEach(cls => allClasses.add(cls));
        });
        setSelectedClasses(Array.from(allClasses));
      }
    }
  }, [isOpen, knowledgeCheckIds, knowledgeChecks]);

  const handleClassToggle = (className) => {
    setSelectedClasses(prev =>
      prev.includes(className)
        ? prev.filter(c => c !== className)
        : [...prev, className]
    );
  };

  const handleSubmit = () => {
    if (selectedClasses.length === 0) {
      alert('Please select at least one class');
      return;
    }

    setIsSubmitting(true);

    // Update all selected knowledge checks with the new classes
    knowledgeCheckIds.forEach(kcId => {
      dispatch(updateKnowledgeCheck({
        id: kcId,
        data: { attachedClasses: selectedClasses }
      }));
    });

    setIsSubmitting(false);
    onClose();
  };

  const footerContent = (
    <div className="flex gap-3">
      <button
        onClick={onClose}
        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
        disabled={isSubmitting || selectedClasses.length === 0}
      >
        {isSubmitting ? 'Attaching...' : 'Attach Classes'}
      </button>
    </div>
  );

  return (
    <ReusableDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Attach to Classes"
      subtitle={`Attaching ${knowledgeCheckIds.length} knowledge check${knowledgeCheckIds.length !== 1 ? 's' : ''}`}
      size="md"
      footer={footerContent}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Select the classes you want to attach these knowledge checks to:
        </p>

        <div className="grid grid-cols-2 gap-3">
          {CLASSES.map(className => (
            <label
              key={className}
              className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedClasses.includes(className)}
                onChange={() => handleClassToggle(className)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-700">{className}</span>
            </label>
          ))}
        </div>

        {selectedClasses.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>{selectedClasses.length}</strong> class{selectedClasses.length !== 1 ? 'es' : ''} selected: <strong>{selectedClasses.join(', ')}</strong>
            </p>
          </div>
        )}
      </div>
    </ReusableDrawer>
  );
};

export default AttachClassesDrawer;
