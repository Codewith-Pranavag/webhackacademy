"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Bookmark,
  BookmarkCheck,
  ListVideo,
  FileText,
  StickyNote,
  Paperclip,
  MessagesSquare,
  Download,
  Send,
  ArrowLeft,
} from "lucide-react";
import { LessonSidebar } from "./_components/LessonSidebar";
import { VideoStage } from "./_components/VideoStage";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingBlock, EmptyState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { useCourseProgress } from "@/store/course-progress";
import { useAuth } from "@/store/auth";
import { toast } from "@/store/toast";
import { courseService } from "@/services/course.service";
import { formatDuration } from "@/lib/format";
import type { Lesson } from "@/types";

interface LocalNote {
  id: string;
  time: number;
  text: string;
}
interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  time: string;
}

const seedComments: Comment[] = [
  { id: "c1", author: "Elena Petrova", text: "This lesson finally made flexbox click for me. Thank you!", time: "2d ago" },
  { id: "c2", author: "Kwame Mensah", text: "Could you share the starter files link again?", time: "1d ago" },
];

export default function CoursePlayerPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const lessonParam = searchParams.get("lesson");
  const user = useAuth((s) => s.user);

  const { data: course, loading } = useAsync(() => courseService.getBySlug(slug), [slug]);

  const allLessons = useMemo<Lesson[]>(
    () => course?.modules.flatMap((m) => m.lessons) ?? [],
    [course],
  );

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [noteText, setNoteText] = useState("");
  const [comments, setComments] = useState<Comment[]>(seedComments);
  const [commentText, setCommentText] = useState("");

  const { toggleLesson, isComplete, setLastLesson, progressFor, toggleBookmark, isBookmarked } =
    useCourseProgress();

  // Pick the initial lesson.
  useEffect(() => {
    if (!course) return;
    const initial =
      (lessonParam && allLessons.find((l) => l.id === lessonParam)?.id) ||
      allLessons[0]?.id ||
      null;
    setCurrentId(initial);
  }, [course, lessonParam, allLessons]);

  if (loading) return <LoadingBlock label="Loading course…" />;
  if (!course)
    return (
      <EmptyState
        title="Course not found"
        description="This course may have been moved."
        action={<Button href="/app/my-learning">Back to My Learning</Button>}
      />
    );

  const current = allLessons.find((l) => l.id === currentId) ?? allLessons[0];
  const index = allLessons.findIndex((l) => l.id === current.id);
  const progress = progressFor(course.id, allLessons.length);

  const goTo = (lesson: Lesson) => {
    setCurrentId(lesson.id);
    setLastLesson(course.id, lesson.id);
    setSidebarOpen(false);
    setTab("overview");
  };

  const markComplete = () => {
    toggleLesson(course.id, current.id);
    if (!isComplete(course.id, current.id)) toast.success("Lesson completed", current.title);
  };

  const completeAndNext = () => {
    if (!isComplete(course.id, current.id)) toggleLesson(course.id, current.id);
    if (index < allLessons.length - 1) goTo(allLessons[index + 1]);
    else toast.success("Course complete! 🎉", "You've finished all lessons.");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <ListVideo className="h-4 w-4" /> },
    { id: "transcript", label: "Transcript", icon: <FileText className="h-4 w-4" /> },
    { id: "notes", label: "Notes", icon: <StickyNote className="h-4 w-4" />, count: notes.length },
    { id: "resources", label: "Resources", icon: <Paperclip className="h-4 w-4" />, count: current.resources?.length },
    { id: "discussion", label: "Discussion", icon: <MessagesSquare className="h-4 w-4" />, count: comments.length },
  ];

  return (
    <div className="-mx-4 -my-6 lg:-mx-8 lg:-my-8">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 lg:px-6">
        <Link href="/app/my-learning" className="inline-flex items-center gap-2 text-sm font-medium text-body hover:text-violet-deep">
          <ArrowLeft className="h-4 w-4" /> My Learning
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-pill border border-line px-4 py-1.5 text-sm font-medium text-ink lg:hidden"
        >
          <ListVideo className="h-4 w-4" /> Lessons
        </button>
      </div>

      <div className="flex">
        {/* Main */}
        <div className="min-w-0 flex-1 p-4 lg:p-6">
          <VideoStage
            lesson={current}
            poster={course.image}
            onEnded={completeAndNext}
            onPrev={() => index > 0 && goTo(allLessons[index - 1])}
            onNext={() => index < allLessons.length - 1 && goTo(allLessons[index + 1])}
            hasPrev={index > 0}
            hasNext={index < allLessons.length - 1}
          />

          {/* Under-video bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-ink">{current.title}</h1>
              <p className="text-sm text-muted">
                {course.title} · Lesson {index + 1} of {allLessons.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(current.id)}
                className="inline-flex items-center gap-2 rounded-pill border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-violet hover:text-violet-deep"
              >
                {isBookmarked(current.id) ? (
                  <BookmarkCheck className="h-4 w-4 text-violet-deep" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                Bookmark
              </button>
              <button
                onClick={markComplete}
                className={`inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
                  isComplete(course.id, current.id)
                    ? "bg-green-soft text-green"
                    : "border border-line text-ink hover:border-violet hover:text-violet-deep"
                }`}
              >
                {isComplete(course.id, current.id) ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                {isComplete(course.id, current.id) ? "Completed" : "Mark complete"}
              </button>
              <Button size="sm" onClick={completeAndNext}>
                Next lesson
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <Tabs tabs={tabs} active={tab} onChange={setTab} />
            <div className="py-6">
              {tab === "overview" && (
                <div className="prose-sm flex flex-col gap-4 text-body">
                  <p>{course.description}</p>
                  <h3 className="text-base font-semibold text-ink">What you&apos;ll learn</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {course.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" /> {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "transcript" && (
                <div className="flex flex-col gap-3 text-body">
                  {[0, 45, 92, 140].map((t, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="shrink-0 font-mono text-xs text-violet-deep">
                        {formatDuration(t)}
                      </span>
                      <p>{current.transcript}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === "notes" && (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note at the current timestamp…"
                      className="h-11 flex-1 rounded-[var(--radius)] border border-line bg-surface-soft px-4 text-sm text-ink outline-none focus:border-violet"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!noteText.trim()) return;
                        setNotes((n) => [
                          { id: `n${Date.now()}`, time: 0, text: noteText.trim() },
                          ...n,
                        ]);
                        setNoteText("");
                        toast.success("Note saved");
                      }}
                    >
                      Add note
                    </Button>
                  </div>
                  {notes.length === 0 ? (
                    <EmptyState title="No notes yet" description="Notes you take appear here." icon={<StickyNote className="h-7 w-7" />} />
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {notes.map((n) => (
                        <li key={n.id} className="rounded-[var(--radius)] border border-line bg-surface p-4">
                          <p className="text-sm text-ink">{n.text}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {tab === "resources" && (
                <ul className="flex flex-col gap-3">
                  {current.resources?.map((r) => (
                    <li
                      key={r.label}
                      className="flex items-center justify-between rounded-[var(--radius)] border border-line bg-surface p-4"
                    >
                      <span className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-violet-deep" />
                        <span>
                          <span className="block text-sm font-medium text-ink">{r.label}</span>
                          <span className="text-xs text-muted">{r.size}</span>
                        </span>
                      </span>
                      <button
                        onClick={() => toast.success("Downloading", r.label)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-deep hover:underline"
                      >
                        <Download className="h-4 w-4" /> Download
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {tab === "discussion" && (
                <div className="flex flex-col gap-5">
                  <div className="flex gap-3">
                    <Avatar src={user?.avatar} name={user?.name ?? "You"} size={40} />
                    <div className="flex flex-1 gap-2">
                      <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Ask a question or share a thought…"
                        className="h-11 flex-1 rounded-[var(--radius)] border border-line bg-surface-soft px-4 text-sm text-ink outline-none focus:border-violet"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!commentText.trim()) return;
                          setComments((c) => [
                            { id: `c${Date.now()}`, author: user?.name ?? "You", avatar: user?.avatar, text: commentText.trim(), time: "just now" },
                            ...c,
                          ]);
                          setCommentText("");
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {comments.map((c) => (
                      <li key={c.id} className="flex gap-3">
                        <Avatar src={c.avatar} name={c.author} size={40} />
                        <div className="flex-1 rounded-[var(--radius)] border border-line bg-surface p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-ink">{c.author}</p>
                            <p className="text-xs text-muted">{c.time}</p>
                          </div>
                          <p className="mt-1 text-sm text-body">{c.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden w-80 shrink-0 border-l border-line bg-surface lg:block">
          <div className="sticky top-20 h-[calc(100vh-5rem)]">
            <LessonSidebar
              course={course}
              currentLessonId={current.id}
              isComplete={(id) => isComplete(course.id, id)}
              progress={progress}
              onSelect={goTo}
            />
          </div>
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-surface">
              <LessonSidebar
                course={course}
                currentLessonId={current.id}
                isComplete={(id) => isComplete(course.id, id)}
                progress={progress}
                onSelect={goTo}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
