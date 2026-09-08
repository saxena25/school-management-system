import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  FileText,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKnowledgeChecks } from '../../store/knowledgeCheckSlice';
import Container from '../../components/ui-components/container';
import { staggerContainer, staggerItem } from '../../utils/motion';

export const StudentKnowledgeCheckList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { knowledgeChecks, studentAttempts, loading } = useSelector(
    (state) => state.knowledgeCheck
  );
  const studentClass = user?.className || '10A';
  const studentId = user?.id;

  useEffect(() => {
    dispatch(fetchKnowledgeChecks());
  }, [dispatch]);

  const availableKnowledgeChecks = knowledgeChecks.filter((kc) =>
    (kc.attachedClasses || []).includes(studentClass)
  );

  const getAttemptStats = (kcId) => {
    const attempts = studentAttempts.filter(
      (a) =>
        String(a.knowledgeCheckId) === String(kcId) &&
        String(a.studentId) === String(studentId)
    );
    return {
      totalAttempts: attempts.length,
      bestScore:
        attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null,
      lastAttempt:
        attempts.length > 0
          ? new Date(attempts[attempts.length - 1].timestamp)
          : null,
    };
  };

  return (
    <Container className="space-y-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg"
      >
        <h1 className="mb-2 flex items-center gap-3 text-4xl font-bold">
          <BookOpen className="h-10 w-10" />
          Knowledge Checks
        </h1>
        <p className="text-blue-100">
          Interactive checks for {user?.name || 'student'} · Class {studentClass}
        </p>
      </motion.div>

      {loading ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          Loading...
        </div>
      ) : availableKnowledgeChecks.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No Knowledge Checks Available
          </h3>
          <p className="text-gray-600">
            Your teacher hasn&apos;t attached any checks to your class yet.
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-4"
        >
          {availableKnowledgeChecks.map((kc) => {
            const stats = getAttemptStats(kc.id);
            return (
              <motion.div
                key={kc.id}
                variants={staggerItem}
                whileHover={{ y: -3 }}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {kc.title}
                    </h3>
                    <p className="mb-4 text-gray-600">{kc.description}</p>
                    <div className="mb-4 flex flex-wrap gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {(kc.questions || []).length} Questions
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        {stats.totalAttempts} Attempts
                      </div>
                      {stats.bestScore !== null && (
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                          Best Score: {stats.bestScore}%
                        </span>
                      )}
                      {stats.lastAttempt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Last: {stats.lastAttempt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/attempt-knowledge-check/${kc.id}`)
                    }
                    className="ml-4 flex items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-white"
                  >
                    Attempt Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </Container>
  );
};

export default StudentKnowledgeCheckList;
