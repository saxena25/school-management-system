import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  knowledgeChecks: [
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
  ],
  studentAttempts: [
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
  ]
};

const knowledgeCheckSlice = createSlice({
  name: 'knowledgeCheck',
  initialState,
  reducers: {
    createKnowledgeCheck: {
      reducer(state, action) {
        state.knowledgeChecks.push(action.payload);
      },
      prepare(data) {
        return {
          payload: {
            id: Date.now(),
            ...data,
            createdDate: new Date(),
            createdBy: 'Mr. Kumar'
          }
        };
      }
    },
    updateKnowledgeCheck(state, action) {
      const { id, data } = action.payload;
      state.knowledgeChecks = state.knowledgeChecks.map((kc) =>
        kc.id === id ? { ...kc, ...data } : kc
      );
    },
    deleteKnowledgeCheck(state, action) {
      state.knowledgeChecks = state.knowledgeChecks.filter(kc => kc.id !== action.payload);
    },
    submitAttempt: {
      reducer(state, action) {
        state.studentAttempts.push(action.payload);
      },
      prepare(attemptData) {
        const nextId = Date.now();
        return {
          payload: {
            id: nextId,
            ...attemptData,
            timestamp: new Date(),
            status: 'completed'
          }
        };
      }
    }
  }
});

export const {
  createKnowledgeCheck,
  updateKnowledgeCheck,
  deleteKnowledgeCheck,
  submitAttempt
} = knowledgeCheckSlice.actions;

export const calculateScore = (knowledgeCheck, answers) => {
  if (!knowledgeCheck) return 0;

  let correctCount = 0;
  knowledgeCheck.questions.forEach((question) => {
    const studentAnswer = answers.find(a => a.questionId === question.id);
    if (!studentAnswer) return;

    const correctOptions = question.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.id)
      .sort((a, b) => a - b);

    const selected = [...studentAnswer.selectedOptions].sort((a, b) => a - b);

    if (question.type === 'single-select' || question.type === 'yes-no') {
      if (selected.length === 1 && selected[0] === correctOptions[0]) {
        correctCount += 1;
      }
    } else if (question.type === 'multi-select') {
      if (
        selected.length === correctOptions.length &&
        selected.every((opt, index) => opt === correctOptions[index])
      ) {
        correctCount += 1;
      }
    }
  });

  return Math.round((correctCount / knowledgeCheck.questions.length) * 100);
};

export default knowledgeCheckSlice.reducer;
