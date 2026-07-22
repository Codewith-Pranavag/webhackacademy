"use client";

import { ListChecks, Clock, Target, Trophy, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/Button";
import { useAsync } from "@/hooks/useAsync";
import { quizService } from "@/services/quiz.service";

const pastResults = [
  { title: "HTML & CSS Basics", score: 92, date: "12 Jul 2026", passed: true },
  { title: "JavaScript Fundamentals", score: 68, date: "05 Jul 2026", passed: false },
  { title: "Design Principles", score: 88, date: "28 Jun 2026", passed: true },
];

export default function QuizzesPage() {
  const { data, loading, error, refetch } = useAsync(() => quizService.list());

  return (
    <div>
      <PageHeader title="Quizzes" description="Test your knowledge and track your scores." />

      <div className="grid gap-7 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-ink">Available quizzes</h2>
          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-36" />
              ))}
            </div>
          ) : error ? (
            <ErrorState onRetry={refetch} />
          ) : !data?.length ? (
            <EmptyState title="No quizzes available" icon={<ListChecks className="h-7 w-7" />} />
          ) : (
            <div className="flex flex-col gap-4">
              {data.map((quiz) => {
                const points = quiz.questions.reduce((s, q) => s + q.points, 0);
                return (
                  <Card key={quiz.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{quiz.title}</h3>
                      <p className="mt-1 text-sm text-body">{quiz.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge tone="violet">
                          <ListChecks className="h-3.5 w-3.5" /> {quiz.questions.length} questions
                        </Badge>
                        <Badge tone="sky">
                          <Clock className="h-3.5 w-3.5" /> {quiz.durationMinutes} min
                        </Badge>
                        <Badge tone="amber">
                          <Target className="h-3.5 w-3.5" /> Pass {quiz.passingScore}%
                        </Badge>
                        <Badge tone="neutral">{points} pts</Badge>
                      </div>
                    </div>
                    <Button href={`/app/quizzes/${quiz.id}`}>
                      Start quiz <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-ink">Recent results</h2>
          <Card className="flex flex-col gap-3">
            {pastResults.map((r) => (
              <div key={r.title} className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink">{r.title}</p>
                  <p className="text-xs text-muted">{r.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-display text-lg font-bold ${r.passed ? "text-green" : "text-orange"}`}>
                    {r.score}%
                  </span>
                  {r.passed ? (
                    <Trophy className="h-4 w-4 text-amber" />
                  ) : null}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
