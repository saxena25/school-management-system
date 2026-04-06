import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  FileText,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Container from '../../components/ui-components/container';

export const StudentKnowledgeCheckList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const knowledgeChecks = useSelector((state) => state.knowledgeCheck.knowledgeChecks);
  const studentAttempts = useSelector((state) => state.knowledgeCheck.studentAttempts);
  const studentClass = '10A';
  const studentId = user?.email;

  const availableKnowledgeChecks = knowledgeChecks.filter((kc) =>
    kc.attachedClasses.includes(studentClass)
  );

  const getStudentAttempts = (kcId) => {
    return studentAttempts.filter((a) => a.knowledgeCheckId === kcId && a.studentId === studentId);
  };

  const getAttemptStats = (kcId) => {
    const attempts = getStudentAttempts(kcId, studentId);
    return {
      totalAttempts: attempts.length,
      bestScore: attempts.length > 0
        ? Math.max(...attempts.map(a => a.score))
        : null,
      lastAttempt: attempts.length > 0
        ? new Date(attempts[attempts.length - 1].timestamp)
        : null
    };
  };

  return (
    <Container className="space-y-6 py-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="w-10 h-10" />
          Knowledge Checks
        </h1>
        <p className="text-blue-100">
          Test your understanding with interactive knowledge checks
        </p>
      </div>

      {/* Class Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Class:</span> {studentClass}
        </p>
      </div>

      {/* Knowledge Checks */}
      <div className="space-y-4">
        {availableKnowledgeChecks.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Knowledge Checks Available
            </h3>
            <p className="text-gray-600">
              Your teacher hasn't created any knowledge checks for your class yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {availableKnowledgeChecks.map(kc => {
              const stats = getAttemptStats(kc.id);
              return (
                <div
                  key={kc.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {kc.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{kc.description}</p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-6 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="w-4 h-4" />
                          {kc.questions.length} Questions
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <BarChart3 className="w-4 h-4" />
                          {stats.totalAttempts} Attempts
                        </div>
                        {stats.bestScore !== null && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              Best Score: {stats.bestScore}%
                            </span>
                          </div>
                        )}
                        {stats.lastAttempt && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Last: {stats.lastAttempt.toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Question Types */}
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

                    {/* Actions */}
                    <button
                      onClick={() =>
                        navigate(`/dashboard/attempt-knowledge-check/${kc.id}`)
                      }
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      Attempt Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

export default StudentKnowledgeCheckList;