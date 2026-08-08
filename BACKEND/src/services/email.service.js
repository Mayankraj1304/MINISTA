async function sendFollowRequestEmail({ to, targetUsername, requesterUsername, acceptUrl, rejectUrl }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.log(
      `Follow request email skipped: ${requesterUsername} requested to follow ${targetUsername}. Accept: ${acceptUrl}`,
    );
    return { skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject: `${requesterUsername} wants to follow you on Minista`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
          <h2>New follow request</h2>
          <p><strong>@${requesterUsername}</strong> wants to follow you on Minista.</p>
          <p>If you accept, they will be able to see your posts in their feed.</p>
          <p>
            <a href="${acceptUrl}" style="display:inline-block;padding:10px 14px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px">Accept request</a>
            <a href="${rejectUrl}" style="display:inline-block;padding:10px 14px;margin-left:8px;background:#e5e7eb;color:#111827;text-decoration:none;border-radius:8px">Reject</a>
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email provider failed: ${body}`);
  }

  return response.json();
}

module.exports = {
  sendFollowRequestEmail,
};

