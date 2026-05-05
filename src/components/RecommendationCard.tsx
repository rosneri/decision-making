"use client";

import { useEffect, useRef, useState } from "react";
import { fetchRecommendation, type RecContext } from "./recommendation-utils";

interface Props extends RecContext {
  initialNote: string | null;
  initialLoading: boolean;
}

export function RecommendationCard({ initialNote, initialLoading, ...ctx }: Props) {
  const [note, setNote]       = useState<string | null>(initialNote);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError]     = useState<string | null>(null);
  const [dataChanged, setDataChanged] = useState(false);
  const reqRef                = useRef(0);
  const lastDataKey           = useRef(dataKey(ctx));
  const lastFramework         = useRef(ctx.framework);
  const isFirstRender         = useRef(true);
  const debounceTimer         = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doFetch = async () => {
    const id = ++reqRef.current;
    setLoading(true);
    setError(null);
    try {
      const text = await fetchRecommendation(ctx);
      if (id !== reqRef.current) return;
      setNote(text);
      lastFramework.current = ctx.framework;
      lastDataKey.current   = dataKey(ctx);
      setDataChanged(false);
    } catch (e) {
      if (id !== reqRef.current) return;
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      if (id === reqRef.current) setLoading(false);
    }
  };

  // Auto-refetch when framework changes (clear intent to see a different analysis)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (ctx.framework !== lastFramework.current) {
      void doFetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.framework]);

  // Auto-refetch with 3s debounce when data within the current framework changes
  useEffect(() => {
    if (isFirstRender.current) return;
    if (ctx.framework === lastFramework.current && dataKey(ctx) !== lastDataKey.current) {
      setDataChanged(true);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => { void doFetch(); }, 3000);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ctx.matrix), JSON.stringify(ctx.costBenefit), JSON.stringify(ctx.swot)]);

  const paragraphs = (note ?? "").split(/\n\s*\n/).filter(Boolean);
  const firstChar  = paragraphs[0]?.trim().charAt(0) ?? "";
  const firstRest  = paragraphs[0]?.trim().slice(1) ?? "";

  return (
    <aside
      key={note && !loading ? "loaded" : "empty"}
      className={`border border-rule bg-paper rounded-sm mt-16 px-[52px] py-11 ${note && !loading ? "animate-arrive" : ""}`}
      style={{ boxShadow: "var(--shadow-letter)" }}
    >
      <div className="font-code text-[11px] tracking-[0.22em] uppercase text-vermilion mb-3.5">
        A note on what you wrote
      </div>

      {loading ? (
        <div className="font-serif italic text-ink-muted text-lg leading-[30px]">
          <em>Reading what you wrote…</em>
        </div>
      ) : error ? (
        <div className="space-y-3">
          <p className="font-serif italic text-ink-muted text-[17px]">
            Couldn&rsquo;t reach the book right now.
          </p>
          <button
            onClick={doFetch}
            className="font-serif italic text-sm text-vermilion border-b border-vermilion pb-px bg-transparent border-t-0 border-l-0 border-r-0 p-0 cursor-pointer hover:text-vermilion-deep hover:border-vermilion-deep transition-colors duration-200"
          >
            Try again →
          </button>
        </div>
      ) : !note ? (
        <div className="font-serif italic text-ink-muted text-[17px]">
          No note yet.{" "}
          <button
            onClick={doFetch}
            className="border-b border-rule hover:border-ink hover:text-ink bg-transparent border-t-0 border-l-0 border-r-0 p-0 cursor-pointer transition-colors duration-200 font-serif italic"
          >
            Request one
          </button>
        </div>
      ) : (
        <div className="font-serif text-[19px] leading-8 max-w-[62ch] text-ink">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-[18px] last:mb-0">
              {i === 0 ? (
                <>
                  <span className="float-left font-serif font-medium text-[64px] text-vermilion leading-[0.85] pr-3 pt-1.5" aria-hidden="true">
                    {firstChar}
                  </span>
                  {firstRest}
                </>
              ) : p}
            </p>
          ))}
        </div>
      )}

      <div className="mt-7 pt-[18px] border-t border-rule flex justify-between items-baseline">
        <div className="flex items-center gap-4">
          <span className="font-serif italic text-[13px] text-ink-muted">
            {loading ? "Reading…" : "From the book."}
          </span>
        </div>
        <span className="font-serif not-italic text-vermilion tracking-[0.06em]">§</span>
      </div>

      {note && !loading && dataChanged && (
        <button
          onClick={doFetch}
          className="mt-6 font-serif italic text-[17px] text-vermilion border-b border-vermilion pb-px inline-block bg-transparent border-t-0 border-l-0 border-r-0 p-0 cursor-pointer hover:text-vermilion-deep hover:border-vermilion-deep transition-colors duration-200"
        >
          Re-read →
        </button>
      )}
    </aside>
  );
}

function dataKey(ctx: RecContext): string {
  return JSON.stringify({ m: ctx.matrix, cb: ctx.costBenefit, s: ctx.swot });
}
