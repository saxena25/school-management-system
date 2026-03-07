import React, { createContext, useContext, useState } from 'react';

const KnowledgeCheckContext = createContext();

export const KnowledgeCheckProvider = ({ children }) => {
  const [knowledgeChecks, setKnowledgeChecks] = useState([
    {
      id: 1,
      title: 'Mathematics Fundamentals',
      description: 'Test your understanding of basic mathematical concepts',
      createdBy: 'Mr. Kumar',
      createdDate: new Date('2026-03-01'),
      attachedClasses: ['10A', '10B'],
      questions: [
        {
          id: 1,
          type: 'single-select',
          text: 'What is 15 + 8?',
          options: [
            { id: 1, text: '20', isCorrect: false },
            { id: 2, text: '23', isCorrect: true },
            { id: 3, text: '25', isCorrect: false },
            { id: 4, text: '28', isCorrect: false }
          ],
          explanation: '15 + 8 = 23. Remember to add the units place first.'
        },
        {
          id: 2,
          type: 'multi-select',
          text: 'Which of the following are even numbers?',
          options: [
            { id: 1, text: '12', isCorrect: true },
            { id: 2, text: '7', isCorrect: false },
            { id: 3, text: '24', isCorrect: true },
            { id: 4, text: '15', isCorrect: false }
          ],
          explanation: 'Even numbers are divisible by 2. So 12 and 24 are even numbers.'
        },
        {
          id: 3,
          type: 'yes-no',
          text: 'Is the square root of 16 equal to 4?',
          options: [
            { id: 1, text: 'Yes', isCorrect: true },
            { id: 2, text: 'No', isCorrect: false }
          ],
          explanation: 'Yes, √16 = 4 because 4 × 4 = 16.'
        }
      ]
    }
  ]);

  const [studentAttempts, setStudentAttempts] = useState([
    {
      id: 1,
      studentId: 'student@school.com',
      studentName: 'John Doe',
      knowledgeCheckId: 1,
      answers: [
        { questionId: 1, selectedOptions: [2] },
        { questionId: 2, selectedOptions: [1, 3] },
        { questionId: 3, selectedOptions: [1] }
      ],
      score: 100,
      totalQuestions: 3,
      timestamp: new Date('2026-03-05'),
      status: 'completed'
    }
  ]);

  // Create new KnowledgeCheck
  const createKnowledgeCheck = (data) => {
    const newKnowledgeCheck = {
      id: Math.max(...knowledgeChecks.map(k => k.id), 0) + 1,
      ...data,
      createdDate: new Date(),
      createdBy: 'Mr. Kumar' // Will be updated with actual user
    };
    setKnowledgeChecks([...knowledgeChecks, newKnowledgeCheck]);
    return newKnowledgeCheck;
  };

  // Update existing KnowledgeCheck
  const updateKnowledgeCheck = (id, data) => {
    setKnowledgeChecks(
      knowledgeChecks.map(kc => (kc.id === id ? { ...kc, ...data } : kc))
    );
  };

  // Delete KnowledgeCheck
  const deleteKnowledgeCheck = (id) => {
    setKnowledgeChecks(knowledgeChecks.filter(kc => kc.id !== id));
  };

  // Get KnowledgChecks for a specific class
  const getKnowledgeChecksForClass = (className) => {
    return knowledgeChecks.filter(kc => kc.attachedClasses.includes(className));
  };

  // Get all KnowledgChecks created by current teacher
  const getAllKnowledgeChecks = () => {
    return knowledgeChecks;
  };

  // Submit student attempt
  const submitAttempt = (attemptData) => {
    const newAttempt = {
      id: Math.max(...studentAttempts.map(a => a.id || 0), 0) + 1,
      ...attemptData,
      timestamp: new Date(),
      status: 'completed'
    };
    setStudentAttempts([...studentAttempts, newAttempt]);
    return newAttempt;
  };

  // Get student attempts for a KnowledgeCheck
  const getStudentAttempts = (knowledgeCheckId, studentId) => {
    return studentAttempts.filter(
      a => a.knowledgeCheckId === knowledgeCheckId && a.studentId === studentId
    );
  };

  // Calculate score for an attempt
  const calculateScore = (knowledgeCheckId, answers) => {
    const kc = knowledgeChecks.find(k => k.id === knowledgeCheckId);
    if (!kc) return 0;

    let correctCount = 0;
    kc.questions.forEach(question => {
      const studentAnswer = answers.find(a => a.questionId === question.id);
      if (!studentAnswer) return;

      const correctOptions = question.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.id);

      if (
        question.type === 'single-select' ||
        question.type === 'yes-no'
      ) {
        if (
          studentAnswer.selectedOptions.length === 1 &&
          studentAnswer.selectedOptions[0] === correctOptions[0]
        ) {
          correctCount++;
        }
      } else if (question.type === 'multi-select') {
        const studentOptions = studentAnswer.selectedOptions.sort();
        const correct = correctOptions.sort();
        if (
          studentOptions.length === correct.length &&
          studentOptions.every((opt, i) => opt === correct[i])
        ) {
          correctCount++;
        }
      }
    });

    return Math.round((correctCount / kc.questions.length) * 100);
  };

  return (
    <KnowledgeCheckContext.Provider
      value={{
        knowledgeChecks,
        studentAttempts,
        createKnowledgeCheck,
        updateKnowledgeCheck,
        deleteKnowledgeCheck,
        getKnowledgeChecksForClass,
        getAllKnowledgeChecks,
        submitAttempt,
        getStudentAttempts,
        calculateScore
      }}
    >
      {children}
    </KnowledgeCheckContext.Provider>
  );
};

export const useKnowledgeCheck = () => {
  const context = useContext(KnowledgeCheckContext);
  if (!context) {
    throw new Error(
      'useKnowledgeCheck must be used within a KnowledgeCheckProvider'
    );
  }
  return context;
};