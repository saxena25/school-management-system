import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearLastSubmission,
  submitAttempt,
} from '../../store/knowledgeCheckSlice';
import { knowledgeCheckApi } from '../../services/api';
import Container from '../../components/ui-components/container';

export const AttemptKnowledgeCheck = () => {
  const navigate = useNavigate();
  const { id: kcId } = useParams();
  const dispatch = useDispatch();
  const { knowledgeChecks, lastSubmission } = useSelector(
    (state) => state.knowledgeCheck
  );

  const [knowledgeCheck, setKnowledgeCheck] = useState(
    knowledgeChecks.find((kc) => String(kc.id) === String(kcId)) || null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(!knowledgeCheck);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(clearLastSubmission());
    let active = true;
    knowledgeCheckApi
      .get(kcId)
      .then((data) => {
        if (active) setKnowledgeCheck(data.knowledgeCheck);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [kcId, dispatch]);

  if (loading) {
    return (
      <Container className="py-10">
        <div className="text-center text-gray-500">Loading knowledge check...</div>
      </Container>
    );
  }

  if (!knowledgeCheck) {
    return (
      <Container className="py-6">
        <div className="py-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Knowledge Check Not Found
          </h2>
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <button
            onClick={() => navigate('/dashboard/knowledge-checks-student')}
            className="font-medium text-blue-600"
          >
            Back to Knowledge Checks
          </button>
        </div>
      </Container>
    );
  }

  const currentQuestion = knowledgeCheck.questions[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === knowledgeCheck.questions.length - 1;

  const handleOptionChange = (optionId) => {
    const questionId = currentQuestion.id;
    if (currentQuestion.type === 'multi-select') {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter((id) => id !== optionId)
        : [...currentAnswers, optionId];
      setAnswers({ ...answers, [questionId]: newAnswers });
    } else {
      setAnswers({ ...answers, [questionId]: [optionId] });
    }
  };

  const handleSubmit = async () => {
    const allAnswered = knowledgeCheck.questions.every(
      (q) => answers[q.id] && answers[q.id].length > 0
    );

    if (!allAnswered) {
      setError('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await dispatch(
        submitAttempt({
          id: knowledgeCheck.id,
          answers: knowledgeCheck.questions.map((q) => ({
            questionId: q.id,
            selectedOptions: answers[q.id] || [],
          })),
        })
      ).unwrap();
      setShowResults(true);
    } catch (err) {
      setError(err.message || err);
    } finally {
      setSubmitting(false);
    }
  };

  if (showResults && lastSubmission) {
    const score = lastSubmission.attempt?.score ?? 0;
    const review = lastSubmission.review || [];

    return (
      <Container className="max-w-2xl space-y-6 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border bg-white p-8 text-center shadow-sm"
        >
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              score >= 70 ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            <CheckCircle
              className={`h-8 w-8 ${
                score >= 70 ? 'text-green-600' : 'text-yellow-600'
              }`}
            />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {score >= 70 ? 'Great Job!' : 'Good Effort!'}
          </h1>
          <div className="mb-8">
            <div className="mb-2 text-6xl font-bold text-blue-600">{score}%</div>
            <p className="text-gray-600">Scored on the server</p>
          </div>

          <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4 text-left">
            {review.map((item, idx) => (
              <div
                key={item.questionId}
                className={`rounded-lg border p-3 ${
                  item.isCorrect
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <p className="font-medium">
                  Q{idx + 1}: {item.isCorrect ? 'Correct' : 'Incorrect'}
                </p>
                {item.explanation && (
                  <p className="mt-1 text-sm text-gray-600">{item.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/dashboard/knowledge-checks-student')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Back to List
          </button>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container className="max-w-2xl space-y-6 py-6">
      <button
        onClick={() => navigate('/dashboard/knowledge-checks-student')}
        className="flex items-center gap-2 text-gray-600"
      >
        <ArrowLeft className="h-5 w-5" /> Back
      </button>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{knowledgeCheck.title}</h1>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1}/{knowledgeCheck.questions.length}
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const selected = (answers[currentQuestion.id] || []).includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionChange(option.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((i) => i - 1)}
            className="rounded-lg bg-gray-100 px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex((i) => i + 1)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default AttemptKnowledgeCheck;
