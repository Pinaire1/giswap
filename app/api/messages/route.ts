import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { sellerEmail, buyerName, buyerEmail, message, listingTitle } = await request.json();

    if (!sellerEmail || !buyerEmail || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "GiSwap <noreply@giswap.app>",
      to: sellerEmail,
      subject: `New Inquiry: ${listingTitle}`,
      html: `
        <h2>New message about your Gi</h2>
        <p><strong>From:</strong> ${buyerName} (${buyerEmail})</p>
        <p><strong>Regarding:</strong> ${listingTitle}</p>
        <hr />
        <p>${message}</p>
        <hr />
        <p>Reply directly to this email to respond to the buyer.</p>
        <p><small>Sent via GiSwap</small></p>
      `,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}