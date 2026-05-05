"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Composer } from "./Composer";
import { ReadingInterstitial } from "./ReadingInterstitial";
import { RecommendationCard } from "./RecommendationCard";
import { View as MatrixView } from "@/frameworks/decision-matrix/view";
import { View as BalanceView } from "@/frameworks/cost-benefit/view";
import { View as SwotView } from "@/frameworks/swot/view";
import type { DecisionMatrix } from "@/frameworks/decision-matrix/schema";
import type { CostBenefit } from "@/frameworks/cost-benefit/schema";
import type { Swot } from "@/frameworks/swot/schema";
import type { AnalysisResult } from "./analyze-utils";
import { fetchAnalysis } from "./analyze-utils";

type Route = "compose" | "reading" | "result";
type Framework = "decision_matrix" | "cost_benefit" | "swot";
type Theme = "light" | "dark";

const FRAMEWORKS: { key: Framework; numeral: string; name: string; blurb: string }[] = [
  { key: "decision_matrix", numeral: "I",   name: "Decision Matrix", blurb: "weighted scoring across criteria you choose." },
  { key: "cost_benefit",    numeral: "II",  name: "Cost–Benefit",    blurb: "what is gained against what is given up." },
  { key: "swot",            numeral: "III", name: "SWOT",            blurb: "strengths, weaknesses, opportunities, threats." },
];

const BLANK_MATRIX: DecisionMatrix = {
  framework: "decision_matrix",
  category: "",
  title: "",
  criteria: [
    { name: "", weight: 5 },
    { name: "", weight: 5 },
  ],
  options: [
    { name: "", scores: [5, 5] },
    { name: "", scores: [5, 5] },
  ],
  recommendation: "",
};

const BLANK_BALANCE: CostBenefit = {
  framework: "cost_benefit",
  category: "",
  title: "",
  benefits: [{ text: "", weight: 5 }],
  costs:    [{ text: "", weight: 5 }],
  recommendation: "",
};

const BLANK_SWOT: Swot = {
  framework: "swot",
  category: "",
  title: "",
  strengths:     [""],
  weaknesses:    [""],
  opportunities: [""],
  threats:       [""],
  recommendation: "",
};

// ── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "dm-app-state";

interface SavedState {
  route: Route;
  decisionText: string;
  framework: Framework;
  theme: Theme;
  matrix: DecisionMatrix;
  balance: CostBenefit;
  swot: Swot;
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
  const [framework, setFramework] = useState<Framework>("decision_matrix");
  const [theme, setTheme]         = useState<Theme>("light");
  const [matrix, setMatrix]       = useState<DecisionMatrix>(BLANK_MATRIX);
  const [balance, setBalance]     = useState<CostBenefit>(BLANK_BALANCE);
  const [swot, setSwot]           = useState<Swot>(BLANK_SWOT);
  const [recNote, setRecNote]     = useState<string | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [analyzeReady, setAnalyzeReady] = useState(false);
  const recReqRef = useRef(0);
  const hydratedRef = useRef(false);

  // ── Restore from localStorage after mount (startTransition = deferred, no cascading renders) ──
  useEffect(() => {
    const saved = loadSavedState();
    if (saved) {
      const restoredRoute: Route =
        saved.route === "reading"
          ? (saved.decisionText ? "result" : "compose")
          : saved.route;
      startTransition(() => {
        setRoute(restoredRoute);
        setText(saved.decisionText ?? "");
        setFramework(saved.framework ?? "decision_matrix");
        setTheme(saved.theme ?? "light");
        if (saved.matrix)  setMatrix(saved.matrix);
        if (saved.balance) setBalance(saved.balance);
        if (saved.swot)    setSwot(saved.swot);
        if (saved.recNote) setRecNote(saved.recNote);
      });
    }
    hydratedRef.current = true;
   
  }, []);

  // ── Persist whenever state changes (after hydration) ──
  useEffect(() => {
    if (!hydratedRef.current) return;
    persistState({ route, decisionText, framework, theme, matrix, balance, swot, recNote });
  }, [route, decisionText, framework, theme, matrix, balance, swot, recNote]);

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
    setMatrix(BLANK_MATRIX);
    setBalance(BLANK_BALANCE);
    setSwot(BLANK_SWOT);
    const id = ++recReqRef.current;
    setRecLoading(true);
    fetchAnalysis(text)
      .then((result: AnalysisResult) => {
        if (id !== recReqRef.current) return;
        applyAnalysis(result);
        setRecLoading(false);
        setAnalyzeReady(true);
      })
      .catch(() => {
        if (id !== recReqRef.current) return;
        setRecLoading(false);
        setAnalyzeReady(true); // advance anyway so user isn't stuck
      });
  };

  const applyAnalysis = (result: AnalysisResult) => {
    setFramework(result.framework);
    setRecNote(result.recommendation);
    if (result.framework === "decision_matrix") {
      setMatrix({ ...BLANK_MATRIX, ...result, category: "" });
    } else if (result.framework === "cost_benefit") {
      setBalance({ ...BLANK_BALANCE, ...result, category: "" });
    } else {
      setSwot({ ...BLANK_SWOT, ...result, category: "" });
    }
  };

  const active = FRAMEWORKS.find((f) => f.key === framework) ?? FRAMEWORKS[0]!;

  const runningHead =
    route === "result"  ? `on "${decisionText.length > 60 ? decisionText.slice(0, 60) + "…" : decisionText}"` :
    route === "reading" ? "reading" :
                          "a new entry";

  return (
    <div className="min-h-screen relative paper-grain">
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20 border-b border-rule px-10 py-[18px] flex items-center gap-7"
        style={{ background: "color-mix(in oklab, var(--paper) 85%, transparent)", backdropFilter: "blur(6px)" }}
      >
        <button
          onClick={() => setRoute("compose")}
          className="font-serif font-medium text-[18px] tracking-[0.02em] text-ink bg-transparent border-none cursor-pointer p-0"
        >
          Decision Making
        </button>

        <div className="flex-1 text-center font-serif italic text-ink-muted text-sm overflow-hidden text-ellipsis whitespace-nowrap px-6">
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
      {route === "result"  && (
        <main className="max-w-[1080px] mx-auto px-10 py-14 pb-[120px] animate-page-in">
          {/* Topbar */}
          <div className="flex items-center gap-4 pb-4 mb-8 border-b border-rule">
            <button
              onClick={() => setRoute("compose")}
              className="inline-flex items-center gap-2 font-serif italic text-sm text-ink-muted hover:text-ink transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
            >
              <span className="text-lg leading-none">↩</span>
              Back to compose
            </button>
          </div>

          {/* Plate header */}
          <div className="mb-10">
            <span className="folio folio-accent block mb-1">Framework</span>
            <h2 className="font-serif text-[40px] font-medium tracking-[-0.008em] leading-[1.1] text-ink mt-1">{active.name}</h2>
            <p className="font-serif italic text-ink-muted text-[17px] mt-2 max-w-[60ch]">
              {active.blurb}&nbsp;·&nbsp;on <em>&ldquo;{decisionText}&rdquo;</em>
            </p>
          </div>

          {/* Active plate */}
          {framework === "decision_matrix" && <MatrixView data={matrix}  onUpdate={setMatrix}  />}
          {framework === "cost_benefit"    && <BalanceView data={balance} onUpdate={setBalance} />}
          {framework === "swot"            && <SwotView   data={swot}    onUpdate={setSwot}    />}

          {/* Recommendation */}
          <RecommendationCard
            key={decisionText}
            decisionText={decisionText}
            framework={framework}
            matrix={matrix}
            costBenefit={balance}
            swot={swot}
            initialNote={recNote}
            initialLoading={recLoading}
          />

          {/* Actions */}
          <div className="flex gap-3 mt-10 items-center">
            <button className="font-serif text-base font-medium px-[22px] py-3 rounded-sm bg-vermilion text-paper hover:bg-vermilion-deep transition-colors duration-200">
              Keep this
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
                Print · share
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
