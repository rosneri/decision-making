import { NextResponse } from "next/server";
import { buildError } from "@/lib/errors";
import { runAnalyze } from "@/lib/insights";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json() as { decisionText?: string; frameworkId?: string };
  const result = await runAnalyze({ decisionText: body.decisionText, frameworkId: body.frameworkId });

  if (!result.ok) {
    return NextResponse.json(buildError(result.code, result.detail), { status: result.status });
  }
  return NextResponse.json(result.data);
}
