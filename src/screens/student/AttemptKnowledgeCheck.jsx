import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useKnowledgeCheck } from '../../contexts/KnowledgeCheckContext';
import { useAuth } from '../../contexts/AuthContext';
import Container from '../../components/ui-components/container';

export const AttemptKnowledgeCheck = () => {
  const navigate = useNavigate();
  const { id: kcId } = useParams();
  const { user } = useAuth();
  const { knowledgeChecks, submitAttempt, calculateScore } = useKnowledgeCheck();

  const knowledgeCheck = knowledgeChecks.find(kc => kc.id === parseInt(kcId));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  if (!knowledgeCheck) {
    return (
      <Container className="py-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Knowledge Check Not Found
          </h2>
          <button
            onClick={() => navigate('/dashboard/knowledge-checks-student')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Knowledge Checks
          </button>
        </div>
      </Container>
    );
  }

  const currentQuestion = knowledgeCheck.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === knowledgeCheck.questions.length - 1;

  const handleOptionChange = (optionId) => {
    const questionId = currentQuestion.id;
    if (currentQuestion.type === 'multi-select') {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(id => id !== optionId)
        : [...currentAnswers, optionId];
      setAnswers({ ...answers, [questionId]: newAnswers });
    } else {
      setAnswers({ ...answers, [questionId]: [optionId] });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < knowledgeCheck.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const allAnswered = knowledgeCheck.questions.every(
      q => answers[q.id] && answers[q.id].length > 0
    );

    if (!allAnswered) {
      alert('Please answer all questions before submitting');
      return;
    }

    // Calculate score
    const calculatedScore = calculateScore(
      knowledgeCheck.id,
      knowledgeCheck.questions.map(q => ({
        questionId: q.id,
        selectedOptions: answers[q.id] || []
      }))
    );

    setScore(calculatedScore);

    // Submit attempt
    submitAttempt({
      studentId: user?.email,
      studentName: user?.name,
      knowledgeCheckId: knowledgeCheck.id,
      answers: knowledgeCheck.questions.map(q => ({
        questionId: q.id,
        selectedOptions: answers[q.id] || []
      })),
      score: calculatedScore,
      totalQuestions: knowledgeCheck.questions.length
    });

    setSubmitted(true);
    setShowResults(true);
  };

  if (showResults) {
    return (
      <Container className="space-y-6 py-6 max-w-2xl">
        {/* Results Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-sm">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            score >= 70 ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            <CheckCircle className={`w-8 h-8 ${
              score >= 70 ? 'text-green-600' : 'text-yellow-600'
            }`} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {score >= 70 ? 'Great Job!' : 'Good Effort!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {score >= 70
              ? 'You have successfully completed the knowledge check!'
              : 'Keep practicing to improve your score!'}
          </p>

          {/* Score */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">{score}%</div>
            <p className="text-gray-600">Your Score</p>
          </div>

          {/* Review Answers */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Answer Review</h3>
            <div className="space-y-3">
              {knowledgeCheck.questions.map((question, idx) => {
                const studentAnswers = answers[question.id] || [];
                const correctOptions = question.options
                  .filter(o => o.isCorrect)
                  .map(o => o.id);
                const isCorrect =
                  studentAnswers.length === correctOptions.length &&
                  studentAnswers.every(ans =>
                    correctOptions.includes(ans)
                  );

                return (
                  <div
                    key={question.id}
                    className={`p-3 rounded-lg border ${
                      isCorrect
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isCorrect ? 'text-green-900' : 'text-red-900'
                        }`}>
                          Question {idx + 1}: {isCorrect ? 'Correct' : 'Incorrect'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{question.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setAnswers({});
                setSubmitted(false);
                setShowResults(false);
              }}
              className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Attempt Again
            </button>
            <button
              onClick={() => navigate('/dashboard/knowledge-checks-student')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Knowledge Checks
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="space-y-6 py-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/knowledge-checks-student')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {knowledgeCheck.title}
          </h1>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {knowledgeCheck.questions.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentQuestionIndex + 1} / {knowledgeCheck.questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / knowledgeCheck.questions.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {currentQuestion.text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map(option => {
            const isSelected = (answers[currentQuestion.id] || []).includes(
              option.id
            );
            const inputType =
              currentQuestion.type === 'multi-select' ? 'checkbox' : 'radio';

            return (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type={inputType}
                  checked={isSelected}
                  onChange={() => handleOptionChange(option.id)}
                  className="w-5 h-5"
                />
                <span className="text-lg text-gray-900">{option.text}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Submit Knowledge Check
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next Question
          </button>
        )}
      </div>

      {/* Question Indicator */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Jump to Question:
        </p>
        <div className="flex flex-wrap gap-2">
          {knowledgeCheck.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                idx === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : answers[q.id]
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default AttemptKnowledgeCheck;