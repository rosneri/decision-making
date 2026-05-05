"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { FRAMEWORKS, type FrameworkId, type FrameworkResult } from "@/frameworks";
import { FrameworkRenderer } from "@/components/FrameworkRenderer";

type SR = {
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
      <rect x="88" y="16" width="80" height="136" rx="40" />
      <path d="M48 128a80 80 0 0 0 160 0" />
      <line x1="128" y1="208" x2="128" y2="232" />
      <line x1="96" y1="232" x2="160" y2="232" />
    </svg>
  );
}

export default function DecidePage() {
  const [text, setText]           = useState("");
  const [framework, setFramework] = useState<FrameworkId | "auto">("auto");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [result, setResult]       = useState<FrameworkResult | null>(null);
  const [recording, setRecording] = useState(false);
  const supported = useSyncExternalStore(
    () => () => {},
    () => {
      const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
      return !!(w.SpeechRecognition ?? w.webkitSpeechRecognition);
    },
    () => false,
  );
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-US";
    r.onresult = (e) => {
      let chunk = "";
      for (let i = 0; i < e.results.length; i++) {
        const alt = e.results[i]?.[0];
        if (alt) chunk += alt.transcript;
      }
      setText((prev) => (prev ? prev.trim() + " " : "") + chunk.trim());
    };
    r.onend = () => setRecording(false);
    r.onerror = () => setRecording(false);
    recRef.current = r;
  }, []);

  const toggleRecord = () => {
    const r = recRef.current;
    if (!r) return;
    if (recording) { r.stop(); setRecording(false); }
    else { try { r.start(); setRecording(true); } catch { /* already started */ } }
  };

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/decide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, framework: framework === "auto" ? undefined : framework }),
      });
      const data = await res.json() as {
        result?: FrameworkResult;
        error?: string | { code?: string; message?: string; detail?: string };
      };
      if (!res.ok) {
        const e = data.error;
        const message = typeof e === "string"
          ? e
          : (e && typeof e === "object" && typeof e.message === "string" ? e.message : "Request failed");
        throw new Error(message);
      }
      setResult(data.result ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  const AI_FRAMEWORKS = FRAMEWORKS.filter((f) => f.id !== "cost_benefit"); // cost_benefit not wired to AI yet

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-rule px-10 py-[18px] flex items-center gap-7"
        style={{ background: "color-mix(in oklab, var(--paper) 85%, transparent)", backdropFilter: "blur(6px)" }}>
        <Link href="/" className="font-serif font-medium text-[18px] tracking-[0.02em] text-ink hover:text-ink-muted transition-colors duration-200">
          Decision Making
        </Link>
        <div className="flex-1 text-center font-serif italic text-ink-muted text-sm overflow-hidden text-ellipsis whitespace-nowrap px-6">
          {result ? `on "${text.length > 60 ? text.slice(0, 60) + "…" : text}"` : "a new entry"}
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/" className="font-serif italic text-[15px] text-ink border-b border-vermilion pb-0.5">
            Compose
          </Link>
          <Link href="/frameworks" className="font-serif italic text-[15px] text-ink-muted hover:text-ink border-b border-transparent pb-0.5 transition-colors duration-200">
            Library
          </Link>
        </nav>
      </header>

      <main className="max-w-[760px] mx-auto px-10 py-24">
        {/* Page head */}
        <span className="folio folio-accent">§ AI Analysis</span>
        <h1 className="font-serif text-[52px] leading-[1.06] font-medium tracking-[-0.012em] mt-3.5 text-ink text-balance">
          Let the machine read it.
        </h1>
        <p className="font-serif italic text-[19px] leading-[30px] text-ink-muted max-w-[56ch] mt-4">
          Describe the decision. The AI picks the right framework and fills it in.
          You can also choose one yourself.
        </p>

        {/* Input field */}
        <div className="border-t border-ink border-b border-b-rule pt-7 pb-7 mt-12 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What are you trying to decide?"
            rows={5}
            autoFocus
            className="w-full border-none outline-none bg-transparent font-serif text-[22px] leading-[34px] text-ink resize-none placeholder:text-ink-muted placeholder:italic pr-14"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
          />
          {supported && (
            <button
              onClick={toggleRecord}
              className={`absolute top-7 right-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                recording
                  ? "bg-vermilion border-vermilion text-paper animate-mic-pulse"
                  : "border-rule text-ink-muted hover:border-ink hover:text-ink"
              }`}
              aria-label={recording ? "Stop recording" : "Dictate"}
            >
              <MicIcon />
            </button>
          )}
        </div>

        {/* Framework selector */}
        <div className="mt-6">
          <span className="folio">Framework</span>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setFramework("auto")}
              className={`font-serif italic text-sm px-4 py-1.5 border rounded-sm transition-colors duration-150 ${
                framework === "auto"
                  ? "bg-ink text-paper border-ink"
                  : "border-rule text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              Auto — let AI decide
            </button>
            {AI_FRAMEWORKS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFramework(f.id)}
                className={`font-serif italic text-sm px-4 py-1.5 border rounded-sm transition-colors duration-150 ${
                  framework === f.id
                    ? "bg-ink text-paper border-ink"
                    : "border-rule text-ink-muted hover:border-ink hover:text-ink"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={submit}
            disabled={loading || !text.trim()}
            className="font-serif text-base font-medium px-[22px] py-3 rounded-sm bg-vermilion text-paper hover:bg-vermilion-deep transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {loading ? "Reading…" : "Analyse decision →"}
          </button>
          {text && (
            <button
              onClick={() => { setText(""); setResult(null); setError(null); }}
              className="font-serif italic text-sm text-ink-muted hover:text-ink transition-colors duration-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 border-l-2 border-vermilion pl-4 font-serif italic text-[15px] text-ink-muted">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-16 border-t border-rule pt-10 animate-page-in">
            <span className="folio folio-accent block mb-8">§ Result</span>
            <FrameworkRenderer result={result} />
          </div>
        )}
      </main>
    </>
  );
}
