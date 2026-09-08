export function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function fail(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

export function scoreAnswers(knowledgeCheck, answers = []) {
  let correctCount = 0;
  const reviewed = [];

  for (const question of knowledgeCheck.questions) {
    const studentAnswer = answers.find((a) => a.questionId === question.id);
    const selected = [...(studentAnswer?.selectedOptions || [])].sort((a, b) => a - b);
    const correctOptions = question.options
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.id)
      .sort((a, b) => a - b);

    let isCorrect = false;
    if (question.type === 'single-select' || question.type === 'yes-no') {
      isCorrect =
        selected.length === 1 &&
        correctOptions.length === 1 &&
        selected[0] === correctOptions[0];
    } else if (question.type === 'multi-select') {
      isCorrect =
        selected.length === correctOptions.length &&
        selected.every((opt, index) => opt === correctOptions[index]);
    }

    if (isCorrect) correctCount += 1;
    reviewed.push({
      questionId: question.id,
      selectedOptions: selected,
      isCorrect,
      correctOptions,
      explanation: question.explanation,
    });
  }

  const score =
    knowledgeCheck.questions.length === 0
      ? 0
      : Math.round((correctCount / knowledgeCheck.questions.length) * 100);

  return { score, reviewed, totalQuestions: knowledgeCheck.questions.length };
}

export function stripAnswerKeys(knowledgeCheck) {
  const obj = knowledgeCheck.toObject ? knowledgeCheck.toObject() : { ...knowledgeCheck };
  return {
    ...obj,
    id: obj._id?.toString?.() || obj.id,
    questions: (obj.questions || []).map((q) => ({
      id: q.id,
      type: q.type,
      text: q.text,
      options: (q.options || []).map((o) => ({
        id: o.id,
        text: o.text,
      })),
    })),
  };
}

export function mapKnowledgeCheck(doc, { includeAnswers = true } = {}) {
  if (!includeAnswers) return stripAnswerKeys(doc);
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...obj,
    id: obj._id.toString(),
    createdBy: obj.createdBy?.toString?.() || obj.createdBy,
  };
}
