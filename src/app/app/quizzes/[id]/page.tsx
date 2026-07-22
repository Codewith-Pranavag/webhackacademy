"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flag,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar, ProgressRing } from "@/components/ui/Progress";
import { LoadingBlock, EmptyState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { quizService } from "@/services/quiz.service";
import { cn } from "@/lib/utils";
import type { Quiz, QuizQuestion } from "@/types";

type Answers = Record<string, number[] | string>;
type Result = Awaited<ReturnType<typeof quizService.submit>>;

export default function QuizRunnerPage() {
  const { id } = useParams<{ id: string }>();
  const { data: quiz, loading } = useAsync(() => quizService.get(id), [id]);

  const [phase, setPhase] = useState<"intro" | "running" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const submit = useCallback(async () => {
    if (!quiz) return;
    const res = await quizService.submit(quiz.id, answers);
    setResult(res);
    setPhase("result");
  }, [quiz, answers]);

  // Timer
  useEffect(() => {
    if (phase !== "running") return;
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, submit]);

  if (loading) return <LoadingBlock label="Loading quiz…" />;
  if (!quiz)
    return (
      <EmptyState
        title="Quiz not found"
        action={<Button href="/app/quizzes">Back to quizzes</Button>}
      />
    );

  const start = () => {
    setTimeLeft(quiz.durationMinutes * 60);
    setPhase("running");
  };

  const mmss = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;

  if (phase === "intro") return <Intro quiz={quiz} onStart={start} />;
  if (phase === "result" && result) return <ResultView quiz={quiz} result={result} onRetake={() => { setAnswers({}); setIndex(0); setResult(null); setPhase("intro"); }} />;

  const q = quiz.questions[index];
  const answered = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">{quiz.title}</h1>
          <p className="text-sm text-muted">
            Question {index + 1} of {quiz.questions.length}
          </p>
        </div>
        <Badge tone={timeLeft < 60 ? "orange" : "violet"} className="text-sm">
          <Clock className="h-4 w-4" /> {mmss}
        </Badge>
      </div>
      <ProgressBar value={((index + 1) / quiz.questions.length) * 100} className="mb-6" />

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <Badge tone="neutral">{q.points} points</Badge>
          <span className="text-xs uppercase tracking-wide text-muted">{qTypeLabel(q)}</span>
        </div>
        <h2 className="mb-5 text-lg font-semibold text-ink">{q.prompt}</h2>
        <QuestionInput
          question={q}
          value={answers[q.id]}
          onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
        />
      </Card>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>

        <div className="hidden gap-1.5 sm:flex">
          {quiz.questions.map((qq, i) => (
            <button
              key={qq.id}
              onClick={() => setIndex(i)}
              className={cn(
                "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                i === index
                  ? "bg-violet-deep text-white"
                  : answers[qq.id] !== undefined
                    ? "bg-violet-50 text-violet-deep"
                    : "bg-surface text-muted border border-line",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {index < quiz.questions.length - 1 ? (
          <Button size="sm" onClick={() => setIndex((i) => i + 1)}>
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={submit}>
            <Flag className="h-4 w-4" /> Submit ({answered}/{quiz.questions.length})
          </Button>
        )}
      </div>
    </div>
  );
}

function qTypeLabel(q: QuizQuestion) {
  return {
    single: "Multiple choice",
    multi: "Select all that apply",
    boolean: "True / False",
    fill: "Fill in the blank",
    code: "Code answer",
  }[q.type];
}

function Intro({ quiz, onStart }: { quiz: Quiz; onStart: () => void }) {
  const points = quiz.questions.reduce((s, q) => s + q.points, 0);
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/app/quizzes" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-body hover:text-violet-deep">
        <ArrowLeft className="h-4 w-4" /> All quizzes
      </Link>
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-ink">{quiz.title}</h1>
        <p className="mx-auto mt-2 max-w-md text-body">{quiz.description}</p>
        <div className="my-7 grid grid-cols-3 gap-4">
          <Stat label="Questions" value={String(quiz.questions.length)} />
          <Stat label="Duration" value={`${quiz.durationMinutes} min`} />
          <Stat label="Pass mark" value={`${quiz.passingScore}%`} />
        </div>
        <ul className="mx-auto mb-7 max-w-sm space-y-2 text-left text-sm text-body">
          <li>• You have {quiz.durationMinutes} minutes to complete {quiz.questions.length} questions ({points} points).</li>
          <li>• You can navigate between questions before submitting.</li>
          <li>• The quiz auto-submits when the timer runs out.</li>
        </ul>
        <Button size="lg" onClick={onStart}>Start quiz</Button>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius)] bg-surface-soft p-4">
      <p className="font-display text-2xl font-bold text-ink">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: QuizQuestion;
  value: number[] | string | undefined;
  onChange: (v: number[] | string) => void;
}) {
  if (question.type === "fill" || question.type === "code") {
    const isCode = question.type === "code";
    return isCode ? (
      <textarea
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="// Write your answer here"
        className="w-full rounded-[var(--radius)] border border-line bg-ink px-4 py-3 font-mono text-sm text-green-soft outline-none focus:border-violet"
      />
    ) : (
      <input
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer…"
        className="h-12 w-full rounded-[var(--radius)] border border-line bg-surface-soft px-4 text-ink outline-none focus:border-violet"
      />
    );
  }

  const options = question.type === "boolean" ? ["True", "False"] : question.options ?? [];
  const selected = (value as number[]) ?? [];
  const multi = question.type === "multi";

  const toggle = (i: number) => {
    if (multi) {
      onChange(selected.includes(i) ? selected.filter((x) => x !== i) : [...selected, i]);
    } else {
      onChange([i]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map((opt, i) => {
        const active = selected.includes(i);
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={cn(
              "flex items-center gap-3 rounded-[var(--radius)] border p-4 text-left transition-colors",
              active ? "border-violet-deep bg-violet-50" : "border-line hover:border-violet/40",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center border",
                multi ? "rounded" : "rounded-full",
                active ? "border-violet-deep bg-violet-deep text-white" : "border-line",
              )}
            >
              {active && <CheckCircle2 className="h-4 w-4" />}
            </span>
            <span className={cn("text-sm", active ? "font-medium text-ink" : "text-body")}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function ResultView({
  quiz,
  result,
  onRetake,
}: {
  quiz: Quiz;
  result: Result;
  onRetake: () => void;
}) {
  const correctCount = result.breakdown.filter((b) => b.correct).length;
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="text-center">
        <ProgressRing value={result.score} size={120} label="score" />
        <h1 className="mt-4 text-2xl font-bold text-ink">
          {result.passed ? "Congratulations! 🎉" : "Keep practising"}
        </h1>
        <p className="mt-1 text-body">
          You scored <span className="font-semibold text-ink">{result.score}%</span> —{" "}
          {result.passed ? "you passed" : `you need ${quiz.passingScore}% to pass`}.
        </p>
        <div className="my-6 grid grid-cols-3 gap-4">
          <Stat label="Correct" value={`${correctCount}/${quiz.questions.length}`} />
          <Stat label="Score" value={`${result.score}%`} />
          <Stat label="Result" value={result.passed ? "Passed" : "Failed"} />
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onRetake}>
            <RotateCcw className="h-4 w-4" /> Retake
          </Button>
          <Button href="/app/quizzes">Back to quizzes</Button>
        </div>
      </Card>

      <h2 className="mb-4 mt-8 text-lg font-semibold text-ink">Answer review</h2>
      <div className="flex flex-col gap-4">
        {result.breakdown.map((b, i) => (
          <Card key={b.question.id}>
            <div className="flex items-start gap-3">
              {b.correct ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
              )}
              <div className="flex-1">
                <p className="font-medium text-ink">
                  {i + 1}. {b.question.prompt}
                </p>
                <p className="mt-2 rounded-[var(--radius)] bg-surface-soft p-3 text-sm text-body">
                  <span className="font-medium text-ink">Explanation: </span>
                  {b.question.explanation}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
