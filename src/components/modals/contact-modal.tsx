"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLenisModal } from "@/hooks/use-lenis-modal";
import { profile } from "@/data/profile";
import { XIcon } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";
const fieldClass = "min-h-12 w-full rounded-none border border-[var(--world-b-border)] bg-transparent px-3 py-3 text-base text-[var(--world-b-text)] outline-none transition-colors focus:border-[var(--world-b-accent)] focus:ring-1 focus:ring-[var(--world-b-accent)]";
const labelClass = "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--world-b-muted)]";

export function ContactModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  useLenisModal(open);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setStatus("idle");
      }}
    >
      <DialogContent showCloseButton={false} overlayClassName="z-[300] bg-black/25" className="contact-scroll z-[300] max-h-[calc(100dvh-2rem)] gap-7 overflow-y-auto rounded-none border border-[var(--world-b-border)] bg-[var(--world-b-bg)] p-6 text-[var(--world-b-text)] ring-0 sm:max-w-xl sm:p-8" data-lenis-prevent>
        <DialogClose aria-label="Close contact form" className="absolute right-3 top-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-none text-[var(--world-b-muted)] transition-colors hover:text-[var(--world-b-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--world-b-accent)] sm:right-5 sm:top-5">
          <XIcon aria-hidden className="size-5" />
        </DialogClose>
        <DialogHeader className="gap-4">
          <DialogTitle className="pr-10 font-serif text-3xl font-normal leading-tight tracking-[-0.02em] sm:text-4xl">Get in touch</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-[var(--world-b-muted)]">
            Send a message below, or reach out at{" "}
            <a href={`mailto:${profile.email}`} className="break-words text-[var(--world-b-accent)] underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{profile.email}</a>.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <p role="status" className="py-6 text-base leading-relaxed text-[var(--world-b-accent)]">
            Thanks, your message has been sent. I&apos;ll get back to you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className={labelClass}>
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                data-lenis-prevent
                className={`${fieldClass} contact-scroll h-32 resize-none overflow-y-auto overscroll-contain leading-relaxed sm:h-40`}
              />
            </div>

            {status === "error" && (
              <p role="alert" className="text-sm leading-relaxed text-red-800">
                Something went wrong. Please try again or email directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-none border border-[var(--world-b-accent)] px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[var(--world-b-accent)] transition-colors hover:bg-[var(--world-b-accent)] hover:text-[var(--world-b-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--world-b-accent)] disabled:cursor-wait disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
