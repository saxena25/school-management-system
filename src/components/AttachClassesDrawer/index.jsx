import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { attachKnowledgeChecks } from '../../store/knowledgeCheckSlice';
import ReusableDrawer from '../ui-components/ReusableDrawer';

const CLASSES = ['8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'];

export const AttachClassesDrawer = ({
  isOpen,
  onClose,
  knowledgeCheckIds,
  knowledgeChecks,
}) => {
  const dispatch = useDispatch();
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && knowledgeCheckIds.length > 0) {
      const kcsData = knowledgeChecks.filter((kc) =>
        knowledgeCheckIds.includes(kc.id)
      );
      if (kcsData.length > 0) {
        const allClasses = new Set();
        kcsData.forEach((kc) => {
          (kc.attachedClasses || []).forEach((cls) => allClasses.add(cls));
        });
        setSelectedClasses(Array.from(allClasses));
      }
    }
  }, [isOpen, knowledgeCheckIds, knowledgeChecks]);

  const handleClassToggle = (className) => {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className]
    );
  };

  const handleSubmit = async () => {
    if (selectedClasses.length === 0) {
      setError('Please select at least one class');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await dispatch(
        attachKnowledgeChecks({
          knowledgeCheckIds,
          attachedClasses: selectedClasses,
        })
      ).unwrap();
      onClose();
    } catch (err) {
      setError(err.message || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerContent = (
    <div className="flex gap-3">
      <button
        onClick={onClose}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
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
      subtitle={`Attaching ${knowledgeCheckIds.length} knowledge check${
        knowledgeCheckIds.length !== 1 ? 's' : ''
      }`}
      size="md"
      footer={footerContent}
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <p className="text-sm text-gray-600">
          Select the classes you want to attach these knowledge checks to:
        </p>

        <div className="grid grid-cols-2 gap-3">
          {CLASSES.map((className) => (
            <label
              key={className}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedClasses.includes(className)}
                onChange={() => handleClassToggle(className)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="font-medium text-gray-700">{className}</span>
            </label>
          ))}
        </div>
      </div>
    </ReusableDrawer>
  );
};

export default AttachClassesDrawer;
