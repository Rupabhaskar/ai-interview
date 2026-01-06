import { NextResponse } from "next/server";

export async function POST(req) {
  const { text } = await req.json();

  const res = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text,
      language: "en-US",
    }),
  });

  const data = await res.json();
  const errors = data.matches.length;

  return NextResponse.json({
    grammar: Math.max(10 - errors, 0),
    english: Math.min(10, Math.max(5, text.split(" ").length / 5)),
  });
}
