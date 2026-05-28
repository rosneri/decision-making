import { NextResponse } from "next/server";
import { buildError } from "@/lib/errors";
import { runModify } from "@/lib/insights";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json() as {
    decisionText?: string;
    currentData?: Record<string, unknown>;
    instruction?: string;
  };
  const result = await runModify(body);

  if (!result.ok) {
    return NextResponse.json(buildError(result.code, result.detail), { status: result.status });
  }
  return NextResponse.json({ updatedData: result.data });
}
