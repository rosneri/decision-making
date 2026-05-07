"use client";

import { useState } from "react";

export interface ClarifyQuestion {
  id: string;
  text: string;
  type: "choice" | "text";
  options?: string[];
  multiSelect?: boolean;
}

interface AnswerState {
  selected: string[];
  other: string;
  text: string;
}

interface Props {
  questions: ClarifyQuestion[];
  onSubmit: (answers: Record<string, string>) => void;
  onSkip: () => void;
}

function hasAnswer(q: ClarifyQuestion, a: AnswerState): boolean {
  if (q.type === "text") return a.text.trim().length > 0;
  return a.selected.length > 0 || a.other.trim().length > 0;
}

function formatAnswer(q: ClarifyQuestion, a: AnswerState): string {
  if (q.type === "text") return a.text.trim();
  const parts = [...a.selected];
  if (a.other.trim()) parts.push(a.other.trim());
  return parts.join(", ");
}

export function ClarifyScreen({ questions, onSubmit, onSkip }: Props) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, { selected: [], other: "", text: "" }])),
  );
  const [otherOpen, setOtherOpen] = useState<Record<string, boolean>>({});

  const allAnswered = questions.every((q) => hasAnswer(q, answers[q.id]!));

  function toggleOption(qId: string, option: string, multiSelect: boolean) {
    setAnswers((prev) => {
      const cur = prev[qId]!;
      let next: string[];
      if (multiSelect) {
        next = cur.selected.includes(option)
          ? cur.selected.filter((o) => o !== option)
          : [...cur.selected, option];
      } else {
        next = cur.selected[0] === option ? [] : [option];
      }
      return { ...prev, [qId]: { ...cur, selected: next } };
    });
  }

  function toggleOther(qId: string) {
    setOtherOpen((prev) => {
      const next = !prev[qId];
      if (!next) setAnswers((a) => ({ ...a, [qId]: { ...a[qId]!, other: "" } }));
      return { ...prev, [qId]: next };
    });
  }

  function submit() {
    if (!allAnswered) return;
    onSubmit(Object.fromEntries(questions.map((q) => [q.id, formatAnswer(q, answers[q.id]!)])));
  }

  return (
    <main className="max-w-[760px] mx-auto px-4 sm:px-10 py-12 sm:py-20 animate-page-in">
      <span className="folio folio-accent">§ A few questions</span>
      <h2 className="font-serif text-[40px] sm:text-[44px] leading-[1.08] font-medium tracking-[-0.01em] mt-3.5 text-ink text-balance">
        A bit more context helps.
      </h2>
      <p className="font-serif italic text-[17px] leading-[28px] text-ink-muted mt-4">
        Answer what you can — or skip straight through.
      </p>

      <div className="mt-10 space-y-10">
        {questions.map((q, qi) => {
          const a = answers[q.id]!;
          return (
            <div key={q.id}>
              <p className="font-serif text-[18px] leading-[1.5] text-ink mb-4">
                <span className="font-code text-[11px] tracking-[0.22em] uppercase text-ink-muted mr-3 align-middle">
                  {String(qi + 1).padStart(2, "0")}
                </span>
                {q.text}
              </p>

              {q.type === "choice" && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const active = a.selected.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleOption(q.id, opt, q.multiSelect ?? false)}
                        className={[
                          "font-serif text-[15px] px-4 py-2 rounded-sm border transition-colors duration-150 cursor-pointer text-left",
                          active
                            ? "bg-ink text-paper border-ink"
                            : "bg-paper text-ink border-rule hover:border-ink",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => toggleOther(q.id)}
                    className={[
                      "font-serif italic text-[15px] px-4 py-2 rounded-sm border transition-colors duration-150 cursor-pointer",
                      otherOpen[q.id]
                        ? "bg-ink text-paper border-ink"
                        : "bg-paper text-ink-muted border-rule hover:border-ink hover:text-ink",
                    ].join(" ")}
                  >
                    Other
                  </button>

                  {otherOpen[q.id] && (
                    <input
                      autoFocus
                      type="text"
                      value={a.other}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id]!, other: e.target.value } }))
                      }
                      placeholder="Type your answer…"
                      className="w-full mt-2 border-b border-ink bg-transparent font-serif text-[16px] text-ink py-1.5 outline-none placeholder:italic placeholder:text-ink-muted"
                    />
                  )}
                </div>
              )}

              {q.type === "text" && (
                <textarea
                  value={a.text}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id]!, text: e.target.value } }))
                  }
                  rows={2}
                  placeholder="Your answer…"
                  className="w-full border-b border-rule bg-transparent font-serif text-[16px] text-ink py-1.5 outline-none resize-none placeholder:italic placeholder:text-ink-muted focus:border-ink transition-colors duration-150"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-5 mt-12">
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="font-serif text-base font-medium px-[22px] py-3 rounded-sm bg-vermilion text-paper hover:bg-vermilion-deep transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Continue →
        </button>
        <button
          onClick={onSkip}
          className="font-serif italic text-[15px] text-ink-muted hover:text-ink transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
        >
          Skip →
        </button>
      </div>
    </main>
  );
}
