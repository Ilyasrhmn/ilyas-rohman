"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLenisModal } from "@/hooks/use-lenis-modal";
import { profile } from "@/data/profile";

type Status = "idle" | "loading" | "success" | "error";

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
      <DialogContent className="sm:max-w-md bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Get in touch</DialogTitle>
          <DialogDescription>
            Reach out at {profile.email} or send a message directly.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <p className="py-6 text-sm text-foreground">
            Thanks — your message has been sent. I&apos;ll get back to you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-xs uppercase tracking-wide text-muted-foreground">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                required
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-xs uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-xs uppercase tracking-wide text-muted-foreground">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                className="resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-destructive">
                Something went wrong. Please try again or email directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="cursor-pointer rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
