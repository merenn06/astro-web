import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    // Email validation
    if (!/^[\w-.]+@[\w-.]+\.[a-z]{2,}$/i.test(email)) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const data = {
      email_address: email,
      status: "subscribed",
    };

    const res = await fetch(
      `https://${process.env.MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok && res.status !== 400) {  // 400 = already subscribed
      return NextResponse.json({ error: "mailchimp" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
} 