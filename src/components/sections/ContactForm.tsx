"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

type Fields = { name: string; email: string; subject: string; message: string };

const empty: Fields = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState<Fields>(empty);
  const [sent, setSent] = useState(false);

  const update =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        setValues(empty);
      }}
      className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-line bg-white p-8 shadow-[var(--shadow-card)]"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name">
          <input
            id="name"
            required
            value={values.name}
            onChange={update("name")}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </Field>
        <Field id="email" label="Email address">
          <input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={update("email")}
            placeholder="jane@example.com"
            className={inputClass}
          />
        </Field>
      </div>
      <Field id="subject" label="Subject">
        <input
          id="subject"
          required
          value={values.subject}
          onChange={update("subject")}
          placeholder="How can we help?"
          className={inputClass}
        />
      </Field>
      <Field id="message" label="Message">
        <textarea
          id="message"
          required
          rows={5}
          value={values.message}
          onChange={update("message")}
          placeholder="Write your message…"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <button
        type="submit"
        className="inline-flex h-14 items-center justify-center gap-2 self-start rounded-pill bg-violet-deep px-8 font-medium text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5"
      >
        Send Message
        <Send className="h-4 w-4" />
      </button>

      {sent && (
        <p className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-green-soft px-4 py-3 text-sm font-medium text-green">
          <CheckCircle2 className="h-5 w-5" /> Thanks! We&apos;ll get back to you
          shortly.
        </p>
      )}
    </form>
  );
}

const inputClass =
  "h-12 w-full rounded-[var(--radius)] border border-line bg-surface-soft px-4 text-ink outline-none transition-colors placeholder:text-muted focus:border-violet focus:bg-white";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
