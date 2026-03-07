import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import { useKnowledgeCheck } from '../../contexts/KnowledgeCheckContext';
import Container from '../../components/ui-components/container';

const QUESTION_TYPES = [
  { value: 'single-select', label: 'Single Select' },
  { value: 'multi-select', label: 'Multi Select' },
  { value: 'yes-no', label: 'Yes/No' }
];

const CLASSES = ['8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'];

export const CreateEditKnowledgeCheck = () => {
  const navigate = useNavigate();
  const { id: kcId } = useParams();
  const { knowledgeChecks, createKnowledgeCheck, updateKnowledgeCheck } = useKnowledgeCheck();

  const existingKc = kcId ? knowledgeChecks.find(kc => kc.id === parseInt(kcId)) : null;

  const [formData, setFormData] = useState({
    title: existingKc?.title || '',
    description: existingKc?.description || '',
    attachedClasses: existingKc?.attachedClasses || [],
    questions: existingKc?.questions || []
  });

  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [errors, setErrors] = useState({});

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleClassToggle = (className) => {
    const newClasses = formData.attachedClasses.includes(className)
      ? formData.attachedClasses.filter(c => c !== className)
      : [...formData.attachedClasses, className];
    setFormData({ ...formData, attachedClasses: newClasses });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Math.max(...formData.questions.map(q => q.id || 0), 0) + 1,
      type: 'single-select',
      text: '',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ],
      explanation: ''
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
    setExpandedQuestion(newQuestion.id);
  };

  const deleteQuestion = (qId) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== qId)
    });
  };

  const updateQuestion = (qId, updatedQuestion) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q =>
        q.id === qId ? updatedQuestion : q
      )
    });
  };

  const handleQuestionTypeChange = (qId, newType) => {
    const question = formData.questions.find(q => q.id === qId);
    let newOptions = question.options;

    if (newType === 'yes-no') {
      newOptions = [
        { id: 1, text: 'Yes', isCorrect: false },
        { id: 2, text: 'No', isCorrect: false }
      ];
    } else if (newType === 'single-select' && question.type !== 'single-select') {
      newOptions = [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ];
    }

    updateQuestion(qId, {
      ...question,
      type: newType,
      options: newOptions
    });
  };

  const updateOption = (qId, optId, field, value) => {
    const question = formData.questions.find(q => q.id === qId);
    const updatedOptions = question.options.map(opt =>
      opt.id === optId
        ? { ...opt, [field]: value }
        : { ...opt, ...(field === 'isCorrect' && value ? {} : {}) }
    );

    // For single select and yes-no, ensure only one is correct
    if (field === 'isCorrect' && value && ['single-select', 'yes-no'].includes(question.type)) {
      const correctOptions = updatedOptions.map(opt =>
        opt.id === optId
          ? { ...opt, isCorrect: true }
          : { ...opt, isCorrect: false }
      );
      updateQuestion(qId, { ...question, options: correctOptions });
    } else {
      updateQuestion(qId, { ...question, options: updatedOptions });
    }
  };

  const addOption = (qId) => {
    const question = formData.questions.find(q => q.id === qId);
    const newOption = {
      id: Math.max(...question.options.map(o => o.id || 0), 0) + 1,
      text: '',
      isCorrect: false
    };
    updateQuestion(qId, {
      ...question,
      options: [...question.options, newOption]
    });
  };

  const deleteOption = (qId, optId) => {
    const question = formData.questions.find(q => q.id === qId);
    updateQuestion(qId, {
      ...question,
      options: question.options.filter(o => o.id !== optId)
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.attachedClasses.length === 0) {
      newErrors.attachedClasses = 'Select at least one class';
    }

    if (formData.questions.length === 0) {
      newErrors.questions = 'Add at least one question';
    } else {
      formData.questions.forEach((q, idx) => {
        if (!q.text.trim()) {
          newErrors[`question_${q.id}_text`] = 'Question text is required';
        }
        if (q.options.length < 2) {
          newErrors[`question_${q.id}_options`] = 'At least 2 options required';
        }
        if (!q.options.some(o => o.isCorrect)) {
          newErrors[`question_${q.id}_correct`] = 'Mark at least one option as correct';
        }
        if (!q.explanation.trim()) {
          newErrors[`question_${q.id}_explanation`] = 'Explanation is required';
        }
        q.options.forEach((o, oIdx) => {
          if (!o.text.trim()) {
            newErrors[`question_${q.id}_option_${o.id}_text`] = 'Option text is required';
          }
        });
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    if (existingKc) {
      updateKnowledgeCheck(existingKc.id, formData);
    } else {
      createKnowledgeCheck(formData);
    }

    navigate('/dashboard/knowledge-checks');
  };

  return (
    <Container className="space-y-6 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/knowledge-checks')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {existingKc ? 'Edit' : 'Create'} Knowledge Check
          </h1>
          <p className="text-gray-600 mt-1">
            {existingKc
              ? 'Update your knowledge check and questions'
              : 'Create a new knowledge check with questions'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Mathematics Fundamentals"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what this knowledge check covers..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Attached Classes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Attach to Classes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CLASSES.map(className => (
              <label key={className} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.attachedClasses.includes(className)}
                  onChange={() => handleClassToggle(className)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{className}</span>
              </label>
            ))}
          </div>
          {errors.attachedClasses && (
            <p className="text-red-600 text-sm">{errors.attachedClasses}</p>
          )}
        </div>

        {/* Questions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          {errors.questions && (
            <p className="text-red-600 text-sm">{errors.questions}</p>
          )}

          <div className="space-y-3">
            {formData.questions.map((question, idx) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Question Header */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id
                    )
                  }
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    Question {idx + 1}: {question.text || '(No title)'}
                  </span>
                  {expandedQuestion === question.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Question Content */}
                {expandedQuestion === question.id && (
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    {/* Question Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) =>
                          handleQuestionTypeChange(question.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {QUESTION_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question *
                      </label>
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            ...question,
                            text: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter the question..."
                      />
                      {errors[`question_${question.id}_text`] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[`question_${question.id}_text`]}
                        </p>
                      )}
                    </div>

                    {/* Options */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Options *
                        </label>
                        {question.type !== 'yes-no' && (
                          <button
                            type="button"
                            onClick={() => addOption(question.id)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            + Add Option
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {question.options.map(option => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                          >
                            <input
                              type={
                                question.type === 'multi-select'
                                  ? 'checkbox'
                                  : 'radio'
                              }
                              checked={option.isCorrect}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  option.id,
                                  'isCorrect',
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4"
                              title="Mark as correct"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  option.id,
                                  'text',
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder={`Option ${
                                question.options.indexOf(option) + 1
                              }`}
                              readOnly={question.type === 'yes-no'}
                            />
                            {question.options.length > 2 && question.type !== 'yes-no' && (
                              <button
                                type="button"
                                onClick={() =>
                                  deleteOption(question.id, option.id)
                                }
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {errors[`question_${question.id}_options`] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[`question_${question.id}_options`]}
                        </p>
                      )}
                      {errors[`question_${question.id}_correct`] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[`question_${question.id}_correct`]}
                        </p>
                      )}
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation for Correct Answer *
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            ...question,
                            explanation: e.target.value
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Explain why the marked option is correct..."
                      />
                      {errors[`question_${question.id}_explanation`] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[`question_${question.id}_explanation`]}
                        </p>
                      )}
                    </div>

                    {/* Delete Question */}
                    <button
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                      className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Question
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard/knowledge-checks')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {existingKc ? 'Update' : 'Create'} Knowledge Check
          </button>
        </div>
      </form>
    </Container>
  );
};

export default CreateEditKnowledgeCheck;