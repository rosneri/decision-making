import { NextResponse } from "next/server";
import { buildError } from "@/lib/errors";
import { runClarify } from "@/lib/insights";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json() as { decisionText?: string };
  const result = await runClarify({ decisionText: body.decisionText });

  if (!result.ok) {
    return NextResponse.json(buildError(result.code, result.detail), { status: result.status });
  }
  if (result.skip) return NextResponse.json({ skip: true });
  return NextResponse.json({ skip: false, questions: result.questions });
}
