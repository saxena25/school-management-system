import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { deleteKnowledgeCheck } from '../../store/knowledgeCheckSlice';
import Container from '../../components/ui-components/container';

export const ViewKnowledgeCheck = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: kcId } = useParams();
  const knowledgeChecks = useSelector((state) => state.knowledgeCheck.knowledgeChecks);

  const knowledgeCheck = knowledgeChecks.find((kc) => kc.id === parseInt(kcId));

  if (!knowledgeCheck) {
    return (
      <Container className="py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Knowledge Check Not Found
          </h2>
          <button
            onClick={() => navigate('/dashboard/knowledge-checks')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Knowledge Checks
          </button>
        </div>
      </Container>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this Knowledge Check?')) {
      dispatch(deleteKnowledgeCheck(knowledgeCheck.id));
      navigate('/dashboard/knowledge-checks');
    }
  };

  return (
    <Container className="space-y-6 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard/knowledge-checks')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {knowledgeCheck.title}
          </h1>
          <p className="text-gray-600 mt-2">{knowledgeCheck.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/dashboard/knowledge-check-edit/${knowledgeCheck.id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-6 h-6" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Questions</p>
            <p className="text-2xl font-bold text-gray-900">
              {knowledgeCheck.questions.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Attached Classes</p>
            <p className="text-lg font-semibold text-gray-900">
              {knowledgeCheck.attachedClasses.join(', ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created By</p>
            <p className="text-lg font-semibold text-gray-900">
              {knowledgeCheck.createdBy}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(knowledgeCheck.createdDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {knowledgeCheck.questions.map((question, idx) => (
          <div
            key={question.id}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            {/* Question Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-white bg-blue-600 px-3 py-1 rounded-full">
                  Q{idx + 1}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  question.type === 'single-select'
                    ? 'bg-blue-100 text-blue-700'
                    : question.type === 'multi-select'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {question.type === 'single-select'
                    ? 'Single Select'
                    : question.type === 'multi-select'
                    ? 'Multi Select'
                    : 'Yes/No'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {question.text}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-3 rounded-lg border-2 ${
                    option.isCorrect
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {question.type === 'multi-select' && option.isCorrect ? (
                      <div className="w-5 h-5 rounded border-2 border-green-600 bg-green-600 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : question.type !== 'multi-select' && option.isCorrect ? (
                      <div className="w-5 h-5 rounded-full border-2 border-green-600 bg-green-600"></div>
                    ) : question.type === 'multi-select' ? (
                      <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                    <span className="text-gray-900">{option.text}</span>
                    {option.isCorrect && (
                      <span className="ml-auto text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        Correct Answer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Explanation for Correct Answer:
              </p>
              <p className="text-sm text-blue-800">{question.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/dashboard/knowledge-checks')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Knowledge Checks
        </button>
      </div>
    </Container>
  );
};

export default ViewKnowledgeCheck;