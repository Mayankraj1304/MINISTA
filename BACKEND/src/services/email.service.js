const nodemailer = require("nodemailer");
const { env } = require("../config/env");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
}

function isValidSender(sender) {
  if (!sender) {
    return false;
  }

  const trimmedSender = sender.trim();
  const namedSenderMatch = trimmedSender.match(
    /^(.+)\s<([^<>\s]+@[^<>\s]+\.[^<>\s]+)>$/,
  );

  return isValidEmail(trimmedSender) || Boolean(namedSenderMatch);
}

function buildFollowRequestEmail({
  targetUsername,
  requesterUsername,
  acceptUrl,
  rejectUrl,
}) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h2>New follow request</h2>
      <p><strong>@${requesterUsername}</strong> wants to follow your Minista account.</p>
      <p>This email was sent to the email address associated with your account.</p>
      <p>If you accept, posts become visible for this connection.</p>
      <p>
        <a href="${acceptUrl}" style="display:inline-block;padding:10px 14px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px">Accept request</a>
        <a href="${rejectUrl}" style="display:inline-block;padding:10px 14px;margin-left:8px;background:#e5e7eb;color:#111827;text-decoration:none;border-radius:8px">Reject</a>
      </p>
      <p style="font-size:12px;color:#6b7280">This request was sent to @${targetUsername}.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <p style="font-size:12px;color:#6b7280">If the buttons above do not work, copy and paste one of these links into your browser:</p>
      <p style="font-size:12px;color:#2563eb;word-break:break-all;">Accept: <a href="${acceptUrl}" style="color:#2563eb;text-decoration:none">${acceptUrl}</a></p>
      <p style="font-size:12px;color:#dc2626;word-break:break-all;">Reject: <a href="${rejectUrl}" style="color:#dc2626;text-decoration:none">${rejectUrl}</a></p>
    </div>
  `;
}

function buildFollowRequestText({
  targetUsername,
  requesterUsername,
  acceptUrl,
  rejectUrl,
}) {
  return `New follow request\n\n${requesterUsername} wants to follow your Minista account.\n\nAccept request: ${acceptUrl}\nReject request: ${rejectUrl}\n\nThis request was sent to @${targetUsername}.`;
}

async function sendWithGmail({ to, subject, html, text }) {
  if (!env.gmailUser || !env.gmailAppPassword) {
    return { skipped: true, reason: "missing_gmail_config" };
  }

  const from = env.emailFrom?.trim() || env.gmailUser;
  if (!isValidSender(from)) {
    return { skipped: true, reason: "invalid_sender_email" };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.gmailUser,
      pass: env.gmailAppPassword,
    },
  });

  const result = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return { id: result.messageId, provider: "gmail" };
}

async function sendFollowRequestEmail({
  to,
  targetUsername,
  requesterUsername,
  acceptUrl,
  rejectUrl,
}) {
  if (!isValidEmail(to)) {
    console.log(
      `Follow request email skipped: ${targetUsername} does not have a valid account email.`,
    );
    return { skipped: true, reason: "invalid_recipient_email" };
  }

  const subject = `${requesterUsername} wants to follow you on Minista`;
  const html = buildFollowRequestEmail({
    targetUsername,
    requesterUsername,
    acceptUrl,
    rejectUrl,
  });
  const text = buildFollowRequestText({
    targetUsername,
    requesterUsername,
    acceptUrl,
    rejectUrl,
  });

  return sendWithGmail({ to, subject, html, text });
}

module.exports = {
  sendFollowRequestEmail,
};
