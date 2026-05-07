"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatFiller } from "./ChatFiller";
import { Composer } from "./Composer";
import { ReadingInterstitial } from "./ReadingInterstitial";
import { DecisionProvider } from "./DecisionContext";
import { RecommendationCard } from "./RecommendationCard";
import { ResultStrip } from "./ResultStrip";
import { ModifyInput } from "./ModifyInput";
import { FRAMEWORKS, METRICS, VIEWS, type FrameworkId, type FrameworkResult } from "@/frameworks";
import { HELP } from "@/frameworks/help";
import { FrameworkHelpPanel } from "./FrameworkHelpPanel";
import { SiteHeader } from "./SiteHeader";
import type { AnalysisResult, FrameworkAlternative } from "./analyze-utils";
import { AnalyzeError, fetchAnalysis } from "./analyze-utils";

type Route = "compose" | "reading" | "result";
type Mode = "easy" | "advanced";

// ── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "dm-app-state-v3";

interface SavedState {
  route: Route;
  decisionText: string;
  result: AnalysisResult | null;
  mode: Mode;
  explanation: string | null;
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

// ── Component ─────────────────────────────────────────────────────────────────

export function DecisionApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams?.get("view") ?? null;

  const [route, setRoute]         = useState<Route>("compose");
  const [decisionText, setText]   = useState("");
  const [result, setResult]       = useState<AnalysisResult | null>(null);
  const [serverResultKey, setServerResultKey] = useState<string | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [analyzeReady, setAnalyzeReady] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<{ message: string; code: string } | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [viewVersion, setViewVersion] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>("easy");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationKey, setExplanationKey] = useState(0);
  const recReqRef = useRef(0);
  const explReqRef = useRef(0);
  const resultRef = useRef<AnalysisResult | null>(null);

  // ── Restore from localStorage on mount ──
  useEffect(() => {
    const saved = loadSavedState();
    const wantsResult = viewParam === "result";
    if (saved) {
      const baseRoute: Route =
        saved.route === "reading"
          ? (saved.decisionText && saved.result ? "result" : "compose")
          : saved.route;
      const restoredRoute: Route = wantsResult && saved.result ? "result" : baseRoute;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoute(restoredRoute);
      setText(saved.decisionText ?? "");
      if (saved.result) {
        setResult(saved.result);
        setServerResultKey(JSON.stringify(saved.result));
      }
      if (saved.mode) setMode(saved.mode);
      if (saved.explanation) setExplanation(saved.explanation);
    }
    if (wantsResult) {
      router.replace("/", { scroll: false });
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist whenever state changes (after hydration) ──
  useEffect(() => {
    if (!hydrated) return;
    persistState({ route, decisionText, result, mode, explanation });
  }, [hydrated, route, decisionText, result, mode, explanation]);

  // Keep resultRef in sync so the explanation effect always reads fresh data
  useEffect(() => { resultRef.current = result; }, [result]);

  // ── Fetch explanation whenever explanationKey bumps (new analysis or after modify) ──
  useEffect(() => {
    const current = resultRef.current;
    if (!current) return;
    const id = ++explReqRef.current;
     
    setExplanationLoading(true);
     
    setExplanation(null);
    fetch("/api/explain", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decisionText, result: current }),
    })
      .then(async (res) => {
        if (id !== explReqRef.current) return;
        const body = await res.json().catch(() => null) as { explanation?: string } | null;
        if (body?.explanation) setExplanation(body.explanation);
      })
      .catch(() => { /* non-critical */ })
      .finally(() => { if (id === explReqRef.current) setExplanationLoading(false); });
  // Re-runs on new analysis (key reset in submit) and after modify (key incremented)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explanationKey]);

  // ── Submit ──
  const submit = (text: string, frameworkId?: FrameworkId, chosenMode?: Mode) => {
    setText(text);
    if (chosenMode) setMode(chosenMode);
    setRoute("reading");
    setAnalyzeReady(false);
    setAnalyzeError(null);
    setResult(null);
    setServerResultKey(null);
    resultRef.current = null;
    const id = ++recReqRef.current;
    setRecLoading(true);
    fetchAnalysis(text, frameworkId ? { frameworkId } : undefined)
      .then((r: AnalysisResult) => {
        if (id !== recReqRef.current) return;
        resultRef.current = r;
        setResult(r);
        setServerResultKey(JSON.stringify(r));
        setRecLoading(false);
        setAnalyzeReady(true);
        setExplanationKey((k) => k + 1);
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
        setAnalyzeReady(true);
      });
  };

  // ── Re-recommend ──
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

  // ── Switch to one of the AI's alternative frameworks ──
  const switchFramework = (alt: FrameworkAlternative) => {
    if (!result) return;
    const previousMeta = FRAMEWORKS.find((f) => f.id === result.framework);
    const carryOverAlts: FrameworkAlternative[] = [
      ...(previousMeta
        ? [{ id: result.framework as FrameworkId, name: previousMeta.name, reason: "the previous pick" }]
        : []),
      ...(result.altFrameworks ?? []).filter((a) => a.id !== alt.id),
    ];
    setRoute("reading");
    setAnalyzeReady(false);
    setAnalyzeError(null);
    setResult(null);
    setServerResultKey(null);
    resultRef.current = null;
    const reqId = ++recReqRef.current;
    setRecLoading(true);
    fetchAnalysis(decisionText, { frameworkId: alt.id })
      .then((r: AnalysisResult) => {
        if (reqId !== recReqRef.current) return;
        const merged: AnalysisResult = { ...r, altFrameworks: carryOverAlts };
        resultRef.current = merged;
        setResult(merged);
        setServerResultKey(JSON.stringify(merged));
        setRecLoading(false);
        setAnalyzeReady(true);
        setExplanationKey((k) => k + 1);
      })
      .catch((err: unknown) => {
        if (reqId !== recReqRef.current) return;
        console.error("[switchFramework] failed:", err);
        if (err instanceof AnalyzeError) {
          setAnalyzeError({ message: err.message, code: err.code });
        } else {
          setAnalyzeError({ message: "Couldn't switch framework. Try again.", code: "DM-UI-000" });
        }
        setRecLoading(false);
        setAnalyzeReady(true);
      });
  };

  // ── Handle modify-input updates ──
  const handleModify = (next: FrameworkResult) => {
    const merged: AnalysisResult = {
      ...next,
      recommendation: (result?.recommendation) ?? (next as AnalysisResult).recommendation,
      ...(result?.altFrameworks ? { altFrameworks: result.altFrameworks } : {}),
    };
    resultRef.current = merged;
    setResult(merged);
    setViewVersion((v) => v + 1);
    setExplanationKey((k) => k + 1);
  };

  const meta = result ? FRAMEWORKS.find((f) => f.id === result.framework) : undefined;

  const runningHead =
    route === "result"  ? `on "${decisionText.length > 60 ? decisionText.slice(0, 60) + "…" : decisionText}"` :
    route === "reading" ? "reading" :
                          "a new entry";

  // ── Mode toggle pill ──
  const ModeToggle = () => (
    <div className="inline-flex border border-rule rounded-sm overflow-hidden text-[11px] font-code tracking-[0.18em] uppercase">
      <button
        onClick={() => setMode("easy")}
        className={`px-3 py-1.5 transition-colors duration-150 cursor-pointer ${mode === "easy" ? "bg-ink text-paper" : "bg-paper text-ink-muted hover:text-ink"}`}
      >
        Simple
      </button>
      <button
        onClick={() => setMode("advanced")}
        className={`px-3 py-1.5 transition-colors duration-150 cursor-pointer border-l border-rule ${mode === "advanced" ? "bg-ink text-paper" : "bg-paper text-ink-muted hover:text-ink"}`}
      >
        Advanced
      </button>
    </div>
  );

  return (
    <div className="min-h-screen relative paper-grain">
      <SiteHeader
        runningHead={runningHead}
        onBrandClick={() => setRoute("compose")}
        items={[
          ...(result ? [{ label: "Result", onClick: () => setRoute("result"), active: route === "result" }] : []),
          { label: "Compose", onClick: () => setRoute("compose"), active: route !== "result" },
          { label: "Library", href: "/frameworks" },
        ]}
      />

      {/* ── Screens ── */}
      {route === "compose" && <Composer onSubmit={submit} initialText={decisionText} initialResultMode={mode} />}
      {route === "reading" && <ReadingInterstitial text={decisionText} ready={analyzeReady} onDone={() => setRoute("result")} />}

      {route === "result" && result && meta && (() => {
        const ActiveView = VIEWS[result.framework];
        const metrics = METRICS[result.framework]?.(result) ?? [];

        return (
          <main className="max-w-[1080px] mx-auto px-4 sm:px-10 py-8 sm:py-14 pb-16 sm:pb-[120px] animate-page-in">
            {/* ── Header ── */}
            <div className="mb-10">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="folio folio-accent block mb-1">{meta.category}</span>
                  <h2 className="font-serif text-[40px] font-medium tracking-[-0.008em] leading-[1.1] text-ink mt-1">{meta.name}</h2>
                  <p className="font-serif italic text-ink-muted text-[17px] mt-2 max-w-[60ch]">
                    {meta.blurb}&nbsp;·&nbsp;on <em>&ldquo;{decisionText}&rdquo;</em>
                  </p>
                </div>
                <div className="mt-1 shrink-0">
                  <ModeToggle />
                </div>
              </div>

              {/* Advanced-only: help panel + chat button */}
              {mode === "advanced" && (() => {
                const help = HELP[result.framework];
                const chatButton = (
                  <button
                    onClick={() => setChatOpen(true)}
                    className="font-serif text-sm font-medium text-vermilion hover:text-paper hover:bg-vermilion border border-vermilion rounded-sm px-3 py-1.5 cursor-pointer inline-flex items-center gap-2 transition-colors duration-200 bg-transparent"
                  >
                    <span aria-hidden>✎</span>
                    Fill by chatting
                  </button>
                );
                return help
                  ? <FrameworkHelpPanel help={help} trailing={chatButton} />
                  : <div className="mt-4">{chatButton}</div>;
              })()}
            </div>

            {/* ── Easy mode: result strip → modify → explanation → recommendation → alt frameworks ── */}
            {mode === "easy" && (
              <>
                {metrics.length > 0 && (
                  <div className="mb-10">
                    <ResultStrip metrics={metrics} />
                  </div>
                )}

                <ModifyInput
                  decisionText={decisionText}
                  currentData={result}
                  onUpdate={handleModify}
                />

                {/* Plain-language explanation */}
                <div className="border border-rule rounded-sm px-4 sm:px-[52px] py-8 sm:py-10 mb-10 mt-10" style={{ boxShadow: "var(--shadow-letter)" }}>
                  <div className="font-code text-[11px] tracking-[0.22em] uppercase text-vermilion mb-3.5">
                    How the analysis works
                  </div>
                  {explanationLoading || !explanation ? (
                    <div className="flex gap-[6px] items-center py-2">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="dm-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  ) : (
                    <div className="font-serif text-[17px] leading-[1.7] text-ink max-w-[62ch]">
                      {explanation.split(/\n\s*\n/).filter(Boolean).map((p, i) => (
                        <p key={i} className="mb-4 last:mb-0">{p}</p>
                      ))}
                    </div>
                  )}
                </div>

                <RecommendationCard
                  key={decisionText}
                  note={result.recommendation ?? null}
                  loading={recLoading}
                  error={analyzeError?.message ?? null}
                  dataChanged={serverResultKey !== null && JSON.stringify(result) !== serverResultKey}
                  onRerecommend={rerecommend}
                />

                {result.altFrameworks && result.altFrameworks.length > 0 && (
                  <div className="mt-10">
                    <span className="folio block mb-2">Or try a different angle</span>
                    <div className="flex gap-2 flex-wrap">
                      {result.altFrameworks.map((alt) => (
                        <button
                          key={alt.id}
                          // eslint-disable-next-line react-hooks/refs -- switchFramework reads a ref but only at click time
                          onClick={() => switchFramework(alt)}
                          title={alt.reason}
                          className="font-serif text-sm text-ink hover:text-paper hover:bg-ink border border-rule hover:border-ink rounded-sm px-3 py-1.5 cursor-pointer transition-colors duration-200 bg-transparent text-left"
                        >
                          <span className="font-medium">{alt.name}</span>
                          <span className="italic text-ink-muted ml-1.5">— {alt.reason}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Advanced mode: framework view → result strip → modify → recommendation → alt frameworks ── */}
            {mode === "advanced" && (
              <>
                <DecisionProvider
                  value={{
                    result,
                    updateResult: (d) =>
                      setResult((prev) =>
                        prev ? { ...d, recommendation: prev.recommendation, ...(prev.altFrameworks ? { altFrameworks: prev.altFrameworks } : {}) } : d,
                      ),
                  }}
                >
                  <ActiveView
                    key={`${result.framework}:${viewVersion}`}
                    data={result}
                    onUpdate={(d: FrameworkResult) =>
                      setResult((prev) =>
                        prev ? { ...d, recommendation: prev.recommendation, ...(prev.altFrameworks ? { altFrameworks: prev.altFrameworks } : {}) } : d,
                      )
                    }
                  />
                </DecisionProvider>

                <ResultStrip metrics={metrics} />

                <ModifyInput
                  decisionText={decisionText}
                  currentData={result}
                  onUpdate={handleModify}
                />

                <RecommendationCard
                  key={decisionText}
                  note={result.recommendation ?? null}
                  loading={recLoading}
                  error={analyzeError?.message ?? null}
                  dataChanged={serverResultKey !== null && JSON.stringify(result) !== serverResultKey}
                  onRerecommend={rerecommend}
                />

                {result.altFrameworks && result.altFrameworks.length > 0 && (
                  <div className="mt-10">
                    <span className="folio block mb-2">Or try a different angle</span>
                    <div className="flex gap-2 flex-wrap">
                      {result.altFrameworks.map((alt) => (
                        <button
                          key={alt.id}
                           
                          onClick={() => switchFramework(alt)}
                          title={alt.reason}
                          className="font-serif text-sm text-ink hover:text-paper hover:bg-ink border border-rule hover:border-ink rounded-sm px-3 py-1.5 cursor-pointer transition-colors duration-200 bg-transparent text-left"
                        >
                          <span className="font-medium">{alt.name}</span>
                          <span className="italic text-ink-muted ml-1.5">— {alt.reason}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-3 mt-10 items-center flex-wrap">
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

      {route === "result" && result && meta && chatOpen && mode === "advanced" && (
        <ChatFiller
          frameworkId={result.framework}
          frameworkName={meta.name}
          decisionText={decisionText}
          data={result}
          onUpdate={(next) => {
            setResult(next);
            setViewVersion((v) => v + 1);
          }}
          onClose={() => setChatOpen(false)}
        />
      )}

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
