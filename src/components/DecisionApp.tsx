"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Composer } from "./Composer";
import { ReadingInterstitial } from "./ReadingInterstitial";
import { DecisionProvider } from "./DecisionContext";
import { RecommendationCard } from "./RecommendationCard";
import { ResultStrip } from "./ResultStrip";
import { FRAMEWORKS, METRICS, VIEWS, type FrameworkResult } from "@/frameworks";
import type { AnalysisResult } from "./analyze-utils";
import { AnalyzeError, fetchAnalysis } from "./analyze-utils";

type Route = "compose" | "reading" | "result";
type Theme = "light" | "dark";

// ── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "dm-app-state-v2";

interface SavedState {
  route: Route;
  decisionText: string;
  theme: Theme;
  result: FrameworkResult | null;
}

function loadSavedState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch { return null; }
}

function persistState(s: SavedState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* quota exceeded */ }
}

// ── Icons ────────────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DecisionApp() {
  const [route, setRoute]         = useState<Route>("compose");
  const [decisionText, setText]   = useState("");
  const [theme, setTheme]         = useState<Theme>("light");
  const [result, setResult]       = useState<FrameworkResult | null>(null);
  const [serverResultKey, setServerResultKey] = useState<string | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [analyzeReady, setAnalyzeReady] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<{ message: string; code: string } | null>(null);
  const recReqRef = useRef(0);
  const hydratedRef = useRef(false);

  // ── Restore from localStorage after mount ──
  useEffect(() => {
    const saved = loadSavedState();
    if (saved) {
      const restoredRoute: Route =
        saved.route === "reading"
          ? (saved.decisionText && saved.result ? "result" : "compose")
          : saved.route;
      startTransition(() => {
        setRoute(restoredRoute);
        setText(saved.decisionText ?? "");
        setTheme(saved.theme ?? "light");
        if (saved.result) {
          setResult(saved.result);
          setServerResultKey(JSON.stringify(saved.result));
        }
      });
    }
    hydratedRef.current = true;
  }, []);

  // ── Persist whenever state changes (after hydration) ──
  useEffect(() => {
    if (!hydratedRef.current) return;
    persistState({ route, decisionText, theme, result });
  }, [route, decisionText, theme, result]);

  // ── Apply theme to <html> ──
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ── Submit ──
  const submit = (text: string) => {
    setText(text);
    setRoute("reading");
    setAnalyzeReady(false);
    setAnalyzeError(null);
    setResult(null);
    setServerResultKey(null);
    const id = ++recReqRef.current;
    setRecLoading(true);
    fetchAnalysis(text)
      .then((r: AnalysisResult) => {
        if (id !== recReqRef.current) return;
        setResult(r);
        setServerResultKey(JSON.stringify(r));
        setRecLoading(false);
        setAnalyzeReady(true);
      })
      .catch((err: unknown) => {
        if (id !== recReqRef.current) return;
        console.error("[analyze] failed after retries:", err);
        if (err instanceof AnalyzeError) {
          setAnalyzeError({ message: err.message, code: err.code });
        } else {
          const message = err instanceof Error ? err.message : "Unknown error";
          setAnalyzeError({ message: "Something went wrong. Try again.", code: "DM-UI-000" });
          void message;
        }
        setRecLoading(false);
        setAnalyzeReady(true); // advance anyway so the user isn't stuck
      });
  };

  // ── Re-recommend (regenerate just the note for the current data) ──
  const rerecommend = () => {
    if (!result) return;
    const id = ++recReqRef.current;
    setRecLoading(true);
    setAnalyzeError(null);
    fetch("/api/recommend", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decisionText, result }),
    })
      .then(async (res) => {
        if (id !== recReqRef.current) return;
        const body = await res.json().catch(() => null) as { recommendation?: string; error?: { message?: string; code?: string } } | null;
        if (!res.ok || !body?.recommendation) {
          const message = body?.error?.message ?? "Couldn't regenerate the note.";
          const code = body?.error?.code ?? "DM-UI-000";
          setAnalyzeError({ message, code });
          setRecLoading(false);
          return;
        }
        setResult((prev) => prev ? { ...prev, recommendation: body.recommendation! } : prev);
        setServerResultKey((prevKey) => {
          // Recompute so the "data changed" indicator resets to current state.
          return prevKey === null ? null : JSON.stringify({ ...result, recommendation: body.recommendation });
        });
        setRecLoading(false);
      })
      .catch((err: unknown) => {
        if (id !== recReqRef.current) return;
        const message = err instanceof Error ? err.message : "Unknown error";
        setAnalyzeError({ message, code: "DM-UI-000" });
        setRecLoading(false);
      });
  };

  const meta = result ? FRAMEWORKS.find((f) => f.id === result.framework) : undefined;

  const runningHead =
    route === "result"  ? `on "${decisionText.length > 60 ? decisionText.slice(0, 60) + "…" : decisionText}"` :
    route === "reading" ? "reading" :
                          "a new entry";

  return (
    <div className="min-h-screen relative paper-grain">
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20 border-b border-rule px-4 sm:px-10 py-[18px] flex items-center justify-between gap-4 sm:gap-7"
        style={{ background: "color-mix(in oklab, var(--paper) 85%, transparent)", backdropFilter: "blur(6px)" }}
      >
        <button
          onClick={() => setRoute("compose")}
          className="font-serif font-medium text-[18px] tracking-[0.02em] text-ink bg-transparent border-none cursor-pointer p-0"
        >
          Decision Making
        </button>

        <div className="hidden sm:block flex-1 text-center font-serif italic text-ink-muted text-sm overflow-hidden text-ellipsis whitespace-nowrap px-6">
          {runningHead}
        </div>

        <nav className="flex gap-6 items-center">
          <button
            onClick={() => setRoute("compose")}
            className={`font-serif italic text-[15px] border-b pb-0.5 bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer transition-colors duration-200 ${
              route !== "result" ? "text-ink border-vermilion" : "text-ink-muted border-transparent hover:text-ink"
            }`}
          >
            Compose
          </button>
          <button
            disabled={route !== "result"}
            className={`font-serif italic text-[15px] border-b pb-0.5 bg-transparent border-t-0 border-l-0 border-r-0 transition-colors duration-200 ${
              route === "result" ? "text-vermilion border-vermilion cursor-pointer" : "text-ink-muted border-transparent opacity-50 cursor-default"
            }`}
          >
            Result
          </button>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-8 h-8 rounded-full border border-rule text-ink-muted hover:border-ink hover:text-ink flex items-center justify-center transition-colors duration-200 bg-transparent cursor-pointer"
            aria-label={theme === "light" ? "Switch to evening theme" : "Switch to daylight theme"}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </nav>
      </header>

      {/* ── Screens ── */}
      {route === "compose" && <Composer onSubmit={submit} initialText={decisionText} />}
      {route === "reading" && <ReadingInterstitial text={decisionText} ready={analyzeReady} onDone={() => setRoute("result")} />}

      {route === "result" && result && meta && (() => {
        const ActiveView = VIEWS[result.framework];
        return (
          <main className="max-w-[1080px] mx-auto px-4 sm:px-10 py-8 sm:py-14 pb-16 sm:pb-[120px] animate-page-in">
            <div className="mb-10">
              <span className="folio folio-accent block mb-1">{meta.category}</span>
              <h2 className="font-serif text-[40px] font-medium tracking-[-0.008em] leading-[1.1] text-ink mt-1">{meta.name}</h2>
              <p className="font-serif italic text-ink-muted text-[17px] mt-2 max-w-[60ch]">
                {meta.blurb}&nbsp;·&nbsp;on <em>&ldquo;{decisionText}&rdquo;</em>
              </p>
            </div>

            <DecisionProvider
              value={{
                result,
                updateResult: (d) =>
                  setResult((prev) =>
                    prev ? { ...d, recommendation: prev.recommendation } : d,
                  ),
              }}
            >
              {/* Views that have adopted useFrameworkData will read/update via
                  the context above; the rest fall back to these props. */}
              <ActiveView
                data={result}
                onUpdate={(d: FrameworkResult) =>
                  setResult((prev) =>
                    prev ? { ...d, recommendation: prev.recommendation } : d,
                  )
                }
              />
            </DecisionProvider>

            <ResultStrip metrics={METRICS[result.framework]?.(result) ?? []} />

            <RecommendationCard
              key={decisionText}
              note={result.recommendation ?? null}
              loading={recLoading}
              error={analyzeError?.message ?? null}
              dataChanged={serverResultKey !== null && JSON.stringify(result) !== serverResultKey}
              onRerecommend={rerecommend}
            />

            <div className="flex gap-3 mt-10 items-center">
              <button className="font-serif text-base font-medium px-[22px] py-3 rounded-sm bg-vermilion text-paper hover:bg-vermilion-deep transition-colors duration-200">
                <span className="sm:hidden">Keep</span><span className="hidden sm:inline">Keep this</span>
              </button>
              <button
                onClick={() => setRoute("compose")}
                className="font-serif text-base font-medium px-[22px] py-3 rounded-sm border border-rule text-ink hover:border-ink transition-colors duration-200"
              >
                Reconsider
              </button>
              <div className="ml-auto">
                <button
                  onClick={() => window.print()}
                  className="font-serif text-base font-medium px-[22px] py-3 rounded-sm border border-rule text-ink hover:border-ink transition-colors duration-200"
                >
                  <span className="sm:hidden">Share</span><span className="hidden sm:inline">Print · share</span>
                </button>
              </div>
            </div>
          </main>
        );
      })()}

      {route === "result" && !result && (
        <main className="max-w-[1080px] mx-auto px-4 sm:px-10 py-14 text-center space-y-4">
          <p className="font-serif italic text-ink-muted text-[18px]">
            {analyzeError?.message ?? "No analysis to show."}
          </p>
          {analyzeError && (
            <p className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted/70">
              error · {analyzeError.code}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            {decisionText && (
              <button
                onClick={() => submit(decisionText)}
                className="font-serif text-base font-medium px-[22px] py-3 rounded-sm bg-vermilion text-paper hover:bg-vermilion-deep transition-colors duration-200 cursor-pointer"
              >
                Try again
              </button>
            )}
            <button
              onClick={() => setRoute("compose")}
              className="font-serif text-base font-medium px-[22px] py-3 rounded-sm border border-rule text-ink hover:border-ink transition-colors duration-200 cursor-pointer"
            >
              Start over →
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
