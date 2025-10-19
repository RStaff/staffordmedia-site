import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const Lead = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  message: z.string().optional().default(""),
  source: z.string().optional().default("web"),
  utm: z.record(z.string()).optional().default({}),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = Lead.parse(body);

    const to = process.env.LEAD_TO || "ops@localhost";
    const subject = `New Lead: ${lead.name} (${lead.email})`;

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Leads <leads@staffordmedia.ai>",
        to,
        subject,
        text:
`Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Company: ${lead.company}
Source: ${lead.source}
UTM: ${JSON.stringify(lead.utm, null, 2)}

Message:
${lead.message}`.trim()
      });
    } else {
      console.log("[lead] (no RESEND_API_KEY) →", { to, subject, lead });
    }
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    console.error("lead error:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Invalid lead" }, { status: 400 });
  }
}
