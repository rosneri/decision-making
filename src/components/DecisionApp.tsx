"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatFiller } from "./ChatFiller";
import { Composer } from "./Composer";
import { ReadingInterstitial } from "./ReadingInterstitial";
import { DecisionProvider } from "./DecisionContext";
import { RecommendationCard } from "./RecommendationCard";
import { ResultStrip } from "./ResultStrip";
import { FRAMEWORKS, METRICS, VIEWS, type FrameworkId, type FrameworkResult } from "@/frameworks";
import { HELP } from "@/frameworks/help";
import { FrameworkHelpPanel } from "./FrameworkHelpPanel";
import { SiteHeader } from "./SiteHeader";
import type { AnalysisResult, FrameworkAlternative } from "./analyze-utils";
import { AnalyzeError, fetchAnalysis } from "./analyze-utils";

type Route = "compose" | "reading" | "result";

// ── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "dm-app-state-v2";

interface SavedState {
  route: Route;
  decisionText: string;
  result: AnalysisResult | null;
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
  // Bumped each time the chat patches the result; used as a key on the
  // active framework view so it remounts and picks up the new data.
  // Framework views currently store their data in useState(data) and ignore
  // later prop changes — remounting is the cheapest way to make external
  // edits visible without rewriting every view.
  const [viewVersion, setViewVersion] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const recReqRef = useRef(0);

  // ── Restore from localStorage on mount, before persisting any state ──
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
    persistState({ route, decisionText, result });
  }, [hydrated, route, decisionText, result]);

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
    const reqId = ++recReqRef.current;
    setRecLoading(true);
    fetchAnalysis(decisionText, { frameworkId: alt.id })
      .then((r: AnalysisResult) => {
        if (reqId !== recReqRef.current) return;
        const merged: AnalysisResult = { ...r, altFrameworks: carryOverAlts };
        setResult(merged);
        setServerResultKey(JSON.stringify(merged));
        setRecLoading(false);
        setAnalyzeReady(true);
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

  const meta = result ? FRAMEWORKS.find((f) => f.id === result.framework) : undefined;

  const runningHead =
    route === "result"  ? `on "${decisionText.length > 60 ? decisionText.slice(0, 60) + "…" : decisionText}"` :
    route === "reading" ? "reading" :
                          "a new entry";

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
              {(() => {
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

            {result.altFrameworks && result.altFrameworks.length > 0 && (
              <div className="mb-10 -mt-4">
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

            <ResultStrip metrics={METRICS[result.framework]?.(result) ?? []} />

            <RecommendationCard
              key={decisionText}
              note={result.recommendation ?? null}
              loading={recLoading}
              error={analyzeError?.message ?? null}
              dataChanged={serverResultKey !== null && JSON.stringify(result) !== serverResultKey}
              onRerecommend={rerecommend}
            />

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

      {route === "result" && result && meta && chatOpen && (
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
