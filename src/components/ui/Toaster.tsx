"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore, type ToastVariant } from "@/store/toast";

const config: Record<
  ToastVariant,
  { Icon: typeof CheckCircle2; ring: string; text: string }
> = {
  success: { Icon: CheckCircle2, ring: "text-green", text: "text-green" },
  error: { Icon: XCircle, ring: "text-orange", text: "text-orange" },
  info: { Icon: Info, ring: "text-violet-deep", text: "text-violet-deep" },
  warning: { Icon: AlertTriangle, ring: "text-amber", text: "text-amber" },
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => {
          const { Icon, text } = config[t.variant];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex items-start gap-3 rounded-[var(--radius)] border border-line bg-white p-4 shadow-[var(--shadow-card)]"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${text}`} />
              <div className="flex-1">
                <p className="font-semibold text-ink">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-sm text-body">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="text-muted transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
