"use client";

import { useState } from "react";
import type { FrameworkResult } from "@/frameworks";

interface Props {
  decisionText: string;
  currentData: FrameworkResult;
  onUpdate: (next: FrameworkResult) => void;
}

export function ModifyInput({ decisionText, currentData, onUpdate }: Props) {
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  async function submit() {
    const text = instruction.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    setApplied(false);
    try {
      const res = await fetch("/api/modify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ decisionText, currentData, instruction: text }),
      });
      const body = await res.json().catch(() => null) as {
        updatedData?: FrameworkResult;
        error?: { message?: string };
      } | null;
      if (!res.ok || !body?.updatedData) {
        setError(body?.error?.message ?? "Couldn't apply that. Try again.");
        return;
      }
      onUpdate(body.updatedData);
      setInstruction("");
      setApplied(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  }

  return (
    <div className="mt-10 border-t border-rule pt-8">
      <div className="font-code text-[11px] tracking-[0.22em] uppercase text-ink-muted mb-3">
        Adjust
      </div>
      <div className="flex gap-2 items-end">
        <textarea
          value={instruction}
          onChange={(e) => { setInstruction(e.target.value); setApplied(false); }}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder={busy ? "Applying…" : "e.g. “set the cost weight higher” or “mark urgency as critical”"}
          disabled={busy}
          className="flex-1 resize-none border border-rule rounded-sm px-3 py-2 font-serif text-[15px] text-ink bg-paper outline-none focus:border-ink placeholder:italic placeholder:text-ink-muted disabled:opacity-60"
        />
        <button
          onClick={() => void submit()}
          disabled={busy || !instruction.trim()}
          className="font-serif text-sm font-medium px-4 py-2 rounded-sm bg-vermilion text-paper hover:bg-vermilion-deep transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
      {error && (
        <p className="font-serif italic text-vermilion text-sm mt-2">{error}</p>
      )}
      {applied && !error && (
        <p className="font-serif italic text-ink-muted text-sm mt-2">Applied.</p>
      )}
    </div>
  );
}
