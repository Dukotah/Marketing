import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

const DEFAULT_FROM_NAME = process.env.RESEND_FROM_NAME || "Launchpad";
const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "campaigns@launchpad.app";

export async function sendCampaignEmail(
  to: string[],
  subject: string,
  html: string,
  fromName?: string,
  fromEmail?: string
) {
  const from = `${fromName || DEFAULT_FROM_NAME} <${fromEmail || DEFAULT_FROM_EMAIL}>`;
  const response = await resend.batch.send(
    to.map((email) => ({
      from,
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
  html: string,
  fromName?: string,
  fromEmail?: string
) {
  const from = `${fromName || DEFAULT_FROM_NAME} <${fromEmail || DEFAULT_FROM_EMAIL}>`;
  const response = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
  return response;
}
