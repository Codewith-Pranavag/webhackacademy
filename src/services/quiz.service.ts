import { mockRequest } from "@/lib/mock/client";
import { quizzes } from "@/mocks/db";
import type { Quiz, QuizAttempt, QuizQuestion } from "@/types";

function isCorrect(q: QuizQuestion, answer: number[] | string | undefined): boolean {
  if (answer === undefined) return false;
  if (q.type === "fill" || q.type === "code") {
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
    return normalize(String(answer)) === normalize(String(q.correct));
  }
  const correct = q.correct as number[];
  const given = answer as number[];
  return (
    correct.length === given.length &&
    correct.every((c) => given.includes(c))
  );
}

export const quizService = {
  async get(id: string): Promise<Quiz | null> {
    return mockRequest(() => quizzes.find((q) => q.id === id) ?? null);
  },

  async list(): Promise<Quiz[]> {
    return mockRequest(quizzes);
  },

  async submit(
    quizId: string,
    answers: Record<string, number[] | string>,
  ): Promise<QuizAttempt & { breakdown: { question: QuizQuestion; correct: boolean }[] }> {
    return mockRequest(() => {
      const quiz = quizzes.find((q) => q.id === quizId)!;
      const totalPoints = quiz.questions.reduce((s, q) => s + q.points, 0);
      let earned = 0;
      const breakdown = quiz.questions.map((question) => {
        const correct = isCorrect(question, answers[question.id]);
        if (correct) earned += question.points;
        return { question, correct };
      });
      const score = Math.round((earned / totalPoints) * 100);
      return {
        quizId,
        score,
        passed: score >= quiz.passingScore,
        takenAt: new Date().toISOString(),
        answers,
        breakdown,
      };
    });
  },
};
