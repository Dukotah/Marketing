import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "campaigns@launchpad.app";

export async function sendCampaignEmail(
  to: string[],
  subject: string,
  html: string,
  from?: string
) {
  const response = await resend.batch.send(
    to.map((email) => ({
      from: from || DEFAULT_FROM,
      to: email,
      subject,
      html,
    }))
  );
  return response;
}

export async function sendTestEmail(
  to: string,
  subject: string,
  html: string
) {
  const response = await resend.emails.send({
    from: DEFAULT_FROM,
    to,
    subject,
    html,
  });
  return response;
}
