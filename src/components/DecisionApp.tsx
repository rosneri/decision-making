"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Composer } from "./Composer";
import { ReadingInterstitial } from "./ReadingInterstitial";
import { RecommendationCard } from "./RecommendationCard";
import { FRAMEWORKS, VIEWS, type FrameworkResult } from "@/frameworks";
import type { AnalysisResult } from "./analyze-utils";
import { fetchAnalysis } from "./analyze-utils";

type Route = "compose" | "reading" | "result";
type Theme = "light" | "dark";

// ── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "dm-app-state-v2";

interface SavedState {
  route: Route;
  decisionText: string;
  theme: Theme;
  result: FrameworkResult | null;
  recNote: string | null;
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
  const [recNote, setRecNote]     = useState<string | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [analyzeReady, setAnalyzeReady] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
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
        if (saved.result) setResult(saved.result);
        if (saved.recNote) setRecNote(saved.recNote);
      });
    }
    hydratedRef.current = true;
  }, []);

  // ── Persist whenever state changes (after hydration) ──
  useEffect(() => {
    if (!hydratedRef.current) return;
    persistState({ route, decisionText, theme, result, recNote });
  }, [route, decisionText, theme, result, recNote]);

  // ── Apply theme to <html> ──
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ── Submit ──
  const submit = (text: string) => {
    setText(text);
    setRoute("reading");
    setRecNote(null);
    setAnalyzeReady(false);
    setAnalyzeError(null);
    setResult(null);
    const id = ++recReqRef.current;
    setRecLoading(true);
    fetchAnalysis(text)
      .then((r: AnalysisResult) => {
        if (id !== recReqRef.current) return;
        setResult(r);
        setRecNote(r.recommendation);
        setRecLoading(false);
        setAnalyzeReady(true);
      })
      .catch((err: unknown) => {
        if (id !== recReqRef.current) return;
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[analyze] failed after retries:", err);
        setAnalyzeError(message);
        setRecLoading(false);
        setAnalyzeReady(true); // advance anyway so the user isn't stuck
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
            <div className="flex items-center gap-4 pb-4 mb-8 border-b border-rule">
              <button
                onClick={() => setRoute("compose")}
                className="inline-flex items-center gap-2 font-serif italic text-sm text-ink-muted hover:text-ink transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
              >
                <span className="text-lg leading-none">↩</span>
                Back to compose
              </button>
            </div>

            <div className="mb-10">
              <span className="folio folio-accent block mb-1">{meta.category}</span>
              <h2 className="font-serif text-[40px] font-medium tracking-[-0.008em] leading-[1.1] text-ink mt-1">{meta.name}</h2>
              <p className="font-serif italic text-ink-muted text-[17px] mt-2 max-w-[60ch]">
                {meta.blurb}&nbsp;·&nbsp;on <em>&ldquo;{decisionText}&rdquo;</em>
              </p>
            </div>

            <ActiveView data={result} onUpdate={setResult} />

            <RecommendationCard
              key={decisionText}
              decisionText={decisionText}
              result={result}
              initialNote={recNote}
              initialLoading={recLoading}
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
          <p className="font-serif italic text-ink-muted">
            {analyzeError ? "The analysis failed." : "No analysis to show."}
          </p>
          {analyzeError && (
            <pre className="font-code text-[12px] text-vermilion bg-paper-deep border border-rule rounded-sm p-3 max-w-[60ch] mx-auto whitespace-pre-wrap text-left">
              {analyzeError}
            </pre>
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
