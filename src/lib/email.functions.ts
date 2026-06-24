import { createServerFn } from "@tanstack/react-start";

interface Input {
  email: string;
}

export const sendWelcomeEmail = createServerFn({ method: "POST" })
  .inputValidator((data: Input) => {
    if (
      !data ||
      typeof data.email !== "string" ||
      !data.email.includes("@") ||
      data.email.length > 254
    ) {
      throw new Error("Invalid email");
    }
    return { email: data.email.trim().toLowerCase() };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service not configured");
    }

    const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,-apple-system,Segoe UI,Arial,sans-serif;color:#0f172a">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:32px">
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2">Welcome to Nearfix! 🎉</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6">
        Thanks for joining our waitlist — we'll be in touch soon.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6">
        <strong>Nearfix</strong> is your personal AI agent that learns your preferences
        and recommends local service providers — plumbers, electricians, cleaners,
        babysitters, tutors and more — that actually match your family's needs.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6">
        We're rolling out city by city. You'll hear from us as soon as Nearfix is live in your area.
      </p>
      <p style="margin:32px 0 0;color:#64748b;font-size:13px">— The Nearfix team</p>
    </div>
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px">
      You're receiving this because you signed up for the Nearfix waitlist.
    </p>
  </div>
</body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Nearfix <onboarding@resend.dev>",
        to: [data.email],
        subject: "Welcome to Nearfix! 🎉",
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Resend error", res.status, text);
      throw new Error(`Email send failed (${res.status})`);
    }

    return { ok: true as const };
  });
