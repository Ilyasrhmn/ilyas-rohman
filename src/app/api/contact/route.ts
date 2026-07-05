import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export function validateContact(
  body: unknown
): { name: string; email: string; message: string } | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";
  if (!name || !message) return null;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return null;
  return { name, email, message };
}

export async function POST(req: Request) {
  const data = validateContact(await req.json().catch(() => null));
  if (!data) return NextResponse.json({ error: "invalid" }, { status: 400 });

  if (!process.env.SMTP_HOST) {
    // ponytail: no SMTP configured -> accept + log; wire real SMTP via env later
    console.log("contact (no SMTP):", data);
    return NextResponse.json({ ok: true });
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transport.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_TO ?? process.env.SMTP_USER,
    subject: `Portfolio contact from ${data.name}`,
    replyTo: data.email,
    text: data.message,
  });

  return NextResponse.json({ ok: true });
}
