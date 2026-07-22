"use client";

import { useState } from "react";
import { Megaphone, Send } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/store/toast";
import { timeAgo } from "@/lib/format";

interface Announcement {
  id: string;
  title: string;
  body: string;
  course: string;
  createdAt: string;
}

const seed: Announcement[] = [
  { id: "a1", title: "New module released 🎉", body: "Module 4: Mastery is now live with 4 fresh lessons. Dive in!", course: "Product Design Masterclass", createdAt: "2026-07-21T10:00:00Z" },
  { id: "a2", title: "Live Q&A this Thursday", body: "Join me for a live session on advanced prototyping at 5 PM IST.", course: "Product Design Masterclass", createdAt: "2026-07-18T09:00:00Z" },
  { id: "a3", title: "Assignment deadline extended", body: "The branding assignment deadline is now 30 July. Take your time!", course: "Branding & Identity Design", createdAt: "2026-07-15T14:00:00Z" },
];

const courses = ["Product Design Masterclass", "Branding & Identity Design", "3D Motion Design in Blender"];

const inputClass =
  "w-full rounded-[var(--radius)] border border-line bg-surface-soft px-4 py-3 text-sm text-ink outline-none focus:border-violet";

export default function AnnouncementsPage() {
  const [list, setList] = useState<Announcement[]>(seed);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [course, setCourse] = useState(courses[0]);

  const post = () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Add a title and message");
      return;
    }
    setList((l) => [
      { id: `a${Date.now()}`, title: title.trim(), body: body.trim(), course, createdAt: new Date().toISOString() },
      ...l,
    ]);
    setTitle("");
    setBody("");
    toast.success("Announcement posted", "Your students have been notified.");
  };

  return (
    <div>
      <PageHeader title="Announcements" description="Broadcast updates to your students." />

      <div className="grid gap-7 lg:grid-cols-3">
        {/* Composer */}
        <Card className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink">
            <Megaphone className="h-5 w-5 text-violet-deep" /> New announcement
          </h2>
          <div className="flex flex-col gap-3">
            <select className={inputClass} value={course} onChange={(e) => setCourse(e.target.value)}>
              {courses.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              className={inputClass}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className={inputClass}
              rows={5}
              placeholder="Write your announcement…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Button onClick={post}>
              <Send className="h-4 w-4" /> Post announcement
            </Button>
          </div>
        </Card>

        {/* List */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {list.map((a) => (
            <Card key={a.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <Badge tone="violet">{a.course}</Badge>
                <span className="text-xs text-muted">{timeAgo(a.createdAt)}</span>
              </div>
              <h3 className="text-lg font-semibold text-ink">{a.title}</h3>
              <p className="mt-1 text-body">{a.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
