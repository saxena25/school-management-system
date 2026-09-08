import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import {
  deleteKnowledgeCheck,
  fetchKnowledgeChecks,
} from '../../store/knowledgeCheckSlice';
import Container from '../../components/ui-components/container';

export const ViewKnowledgeCheck = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: kcId } = useParams();
  const knowledgeChecks = useSelector(
    (state) => state.knowledgeCheck.knowledgeChecks
  );

  useEffect(() => {
    dispatch(fetchKnowledgeChecks());
  }, [dispatch]);

  const knowledgeCheck = knowledgeChecks.find(
    (kc) => String(kc.id) === String(kcId)
  );

  if (!knowledgeCheck) {
    return (
      <Container className="py-6">
        <div className="py-12 text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Knowledge Check Not Found
          </h2>
          <button
            onClick={() => navigate('/dashboard/knowledge-checks')}
            className="font-medium text-blue-600"
          >
            Back to Knowledge Checks
          </button>
        </div>
      </Container>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this Knowledge Check?')) {
      return;
    }
    await dispatch(deleteKnowledgeCheck(knowledgeCheck.id));
    navigate('/dashboard/knowledge-checks');
  };

  return (
    <Container className="max-w-4xl space-y-6 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/knowledge-checks')}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{knowledgeCheck.title}</h1>
          <p className="mt-2 text-gray-600">{knowledgeCheck.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`/dashboard/knowledge-check-edit/${knowledgeCheck.id}`)
            }
            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
          >
            <Edit2 className="h-6 w-6" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-600">Total Questions</p>
            <p className="text-2xl font-bold text-gray-900">
              {(knowledgeCheck.questions || []).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created By</p>
            <p className="text-lg font-semibold text-gray-900">
              {knowledgeCheck.createdByName || 'Teacher'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Classes</p>
            <p className="text-lg font-semibold text-gray-900">
              {(knowledgeCheck.attachedClasses || []).join(', ') || 'None'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {(knowledgeCheck.questions || []).map((question, index) => (
          <div key={question.id} className="rounded-lg border bg-white p-5 shadow-sm">
            <p className="mb-2 text-sm font-medium text-blue-600">
              Question {index + 1} · {question.type}
            </p>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {question.text}
            </h3>
            <div className="space-y-2">
              {(question.options || []).map((option) => (
                <div
                  key={option.id}
                  className={`rounded-lg border px-3 py-2 ${
                    option.isCorrect
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  {option.text}
                  {option.isCorrect && (
                    <span className="ml-2 text-xs font-semibold text-green-700">
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
            {question.explanation && (
              <p className="mt-3 text-sm text-gray-600">{question.explanation}</p>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ViewKnowledgeCheck;
