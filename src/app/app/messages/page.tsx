"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  ArrowLeft,
  MessagesSquare,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useAsync } from "@/hooks/useAsync";
import { messageService } from "@/services/message.service";
import { formatTime, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Conversation, Message } from "@/types";

const CURRENT_USER_ID = "u_1";

const REPLIES = [
  "Sounds good — thanks for the update!",
  "Got it, I'll take a look shortly.",
  "Sure, let me check and get back to you.",
  "Perfect, that works for me.",
  "Thanks for letting me know 🙌",
];

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-surface-soft px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-muted"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export default function MessagesPage() {
  const { data, loading, error, refetch } = useAsync(() =>
    messageService.conversations(),
  );

  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (data) {
      setConvos(data);
      setActiveId((prev) => prev ?? data[0]?.id ?? null);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    };
  }, []);

  const active = useMemo(
    () => convos.find((c) => c.id === activeId) ?? null,
    [convos, activeId],
  );

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return convos;
    return convos.filter((c) => c.participant.name.toLowerCase().includes(term));
  }, [convos, search]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, typing]);

  const openConversation = (id: string) => {
    setActiveId(id);
    setConvos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !active) return;
    setDraft("");
    const sent = await messageService.send(active.id, text);
    setConvos((prev) =>
      prev.map((c) =>
        c.id === active.id ? { ...c, messages: [...c.messages, sent] } : c,
      ),
    );

    setTyping(true);
    replyTimer.current = setTimeout(() => {
      const reply: Message = {
        id: `m_${Math.floor(Math.random() * 1e9)}`,
        senderId: active.participant.id,
        text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
        createdAt: new Date().toISOString(),
      };
      setTyping(false);
      setConvos((prev) =>
        prev.map((c) =>
          c.id === active.id ? { ...c, messages: [...c.messages, reply] } : c,
        ),
      );
    }, 1200);
  };

  return (
    <div>
      <PageHeader title="Messages" description="Chat with instructors and classmates." />

      {loading ? (
        <div className="grid h-[calc(100vh-14rem)] gap-5 lg:grid-cols-[320px_1fr]">
          <Skeleton className="h-full" />
          <Skeleton className="hidden h-full lg:block" />
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : convos.length === 0 ? (
        <EmptyState
          icon={<MessagesSquare className="h-7 w-7" />}
          title="No conversations"
          description="When you message an instructor or classmate it will appear here."
        />
      ) : (
        <div className="grid h-[calc(100vh-14rem)] min-h-[520px] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface lg:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <aside
            className={cn(
              "flex min-h-0 flex-col border-r border-line",
              active ? "hidden lg:flex" : "flex",
            )}
          >
            <div className="border-b border-line p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations"
                  className="w-full rounded-pill border border-line bg-surface-soft py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-violet focus:ring-2 focus:ring-violet/30"
                />
              </div>
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-muted">
                  No matches found.
                </li>
              ) : (
                filtered.map((c) => {
                  const last = c.messages[c.messages.length - 1];
                  const isActive = c.id === activeId;
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => openConversation(c.id)}
                        className={cn(
                          "flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors hover:bg-surface-soft",
                          isActive && "bg-violet-50/60",
                        )}
                      >
                        <Avatar
                          src={c.participant.avatar}
                          name={c.participant.name}
                          online={c.participant.online}
                          size={44}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-ink">
                              {c.participant.name}
                            </p>
                            {last && (
                              <span className="shrink-0 text-xs text-muted">
                                {timeAgo(last.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center justify-between gap-2">
                            <p className="truncate text-sm text-muted">
                              {last?.senderId === CURRENT_USER_ID && "You: "}
                              {last?.text ?? "No messages yet"}
                            </p>
                            {c.unread > 0 && (
                              <Badge tone="violet" className="shrink-0">
                                {c.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </aside>

          {/* Active thread */}
          <section
            className={cn(
              "flex min-h-0 flex-col",
              active ? "flex" : "hidden lg:flex",
            )}
          >
            {active ? (
              <>
                <header className="flex items-center gap-3 border-b border-line px-4 py-3">
                  <button
                    onClick={() => setActiveId(null)}
                    aria-label="Back to conversations"
                    className="text-muted transition-colors hover:text-ink lg:hidden"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <Avatar
                    src={active.participant.avatar}
                    name={active.participant.name}
                    online={active.participant.online}
                    size={40}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {active.participant.name}
                    </p>
                    <p className="text-xs text-muted">
                      {active.participant.online ? (
                        <span className="text-green">● Online</span>
                      ) : (
                        "Offline"
                      )}
                    </p>
                  </div>
                </header>

                <div
                  ref={threadRef}
                  className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-surface-soft/40 p-4"
                >
                  {active.messages.map((m) => {
                    const mine = m.senderId === CURRENT_USER_ID;
                    return (
                      <div
                        key={m.id}
                        className={cn("flex", mine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                            mine
                              ? "rounded-br-md bg-violet-deep text-white"
                              : "rounded-bl-md bg-surface text-ink shadow-[0_1px_2px_rgba(28,28,36,0.05)]",
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.text}</p>
                          <p
                            className={cn(
                              "mt-1 text-[0.65rem]",
                              mine ? "text-white/70" : "text-muted",
                            )}
                          >
                            {formatTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {typing && (
                    <div className="flex justify-start">
                      <TypingIndicator />
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSend();
                  }}
                  className="flex items-center gap-2 border-t border-line p-3"
                >
                  <button
                    type="button"
                    aria-label="Attach file"
                    title="Attachments (demo)"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-soft hover:text-violet-deep"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a message…"
                    className="min-w-0 flex-1 rounded-pill border border-line bg-surface-soft px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-violet focus:ring-2 focus:ring-violet/30"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-deep text-white transition-all hover:bg-violet disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center text-muted">
                <div>
                  <MessagesSquare className="mx-auto h-10 w-10 text-line" />
                  <p className="mt-3 text-sm">Select a conversation to start chatting.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
