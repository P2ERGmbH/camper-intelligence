import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

export async function POST(request: Request) {
  const t = await getTranslations("contactForm");
  const data = await request.json();

  // Honeypot check
  if (data.website) {
    return NextResponse.json({ message: t("spamDetected") }, { status: 400 });
  }

  // "Am I human" check - math question
  // The client sends the correct answer, which is then compared with the user's input.
  // This is a basic implementation and for production, a more secure server-side generation/validation
  // of the math question would be recommended to prevent client-side manipulation.
  if (parseInt(data.mathAnswer) !== data.correctAnswer) {
    return NextResponse.json({ message: t("incorrectMathAnswer") }, { status: 400 });
  }

  // Here you would typically send the email or save to a database
  console.log("Contact form submission:", data);

  return NextResponse.json({ message: t("success") }, { status: 200 });
}
