"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { FRAMEWORKS, type FrameworkId } from "@/frameworks";

const EXAMPLES = [
  "Whether to take the new role.",
  "How to spend an unstructured week.",
  "Whether to move closer to family.",
];

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
    <svg width="22" height="22" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
      <rect x="88" y="16" width="80" height="136" rx="40" />
      <path d="M48 128a80 80 0 0 0 160 0" />
      <line x1="128" y1="208" x2="128" y2="232" />
      <line x1="96" y1="232" x2="160" y2="232" />
    </svg>
  );
}

interface Props {
  onSubmit: (text: string, frameworkId?: FrameworkId) => void;
  initialText?: string;
}

export function Composer({ onSubmit, initialText = "" }: Props) {
  const [text, setText]           = useState(initialText);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [frameworkId, setFrameworkId] = useState<FrameworkId | "">("");

  const grouped = useMemo(() => {
    const map = new Map<string, typeof FRAMEWORKS>();
    for (const f of FRAMEWORKS) {
      const arr = map.get(f.category) ?? [];
      arr.push(f);
      map.set(f.category, arr);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cat, items]) => [cat, [...items].sort((a, b) => a.name.localeCompare(b.name))] as const);
  }, []);
  const srSupported = useSyncExternalStore(
    () => () => {},
    () => {
      const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
      return !!(w.SpeechRecognition ?? w.webkitSpeechRecognition);
    },
    () => false,
  );
  const taRef  = useRef<HTMLTextAreaElement>(null);
  const recRef = useRef<SR | null>(null);

  // Set up Web Speech API once on mount
  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e) => {
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        interim += e.results[i]?.[0]?.transcript ?? "";
      }
      setTranscript(interim);
    };
    r.onend = () => {
      setRecording(false);
    };
    r.onerror = () => {
      setRecording(false);
    };
    recRef.current = r;
  }, []);

  const startRecord = () => {
    const r = recRef.current;
    if (!r) return;
    setTranscript("");
    try { r.start(); setRecording(true); } catch { /* already started */ }
  };

  const stopRecord = () => {
    recRef.current?.stop();
    setRecording(false);
    if (transcript.trim()) {
      setText(transcript.trim());
      setTranscript("");
      setTimeout(() => taRef.current?.focus(), 50);
    }
  };

  const cancelRecord = () => {
    recRef.current?.stop();
    setRecording(false);
    setTranscript("");
  };

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSubmit(t, mode === "manual" && frameworkId ? frameworkId : undefined);
  };

  const canSubmit = !!text.trim() && (mode === "auto" || !!frameworkId);

  return (
    <main className="max-w-[760px] mx-auto px-4 sm:px-10 py-12 sm:py-24 animate-page-in">
      <span className="folio folio-accent">§ Compose</span>
      <h1 className="font-serif text-[52px] leading-[1.06] font-medium tracking-[-0.012em] mt-3.5 text-ink text-balance">
        Begin with what you&rsquo;re weighing.
      </h1>
      <p className="font-serif italic text-[19px] leading-[30px] text-ink-muted max-w-[56ch] mt-[18px] text-justify">
        A few sentences are enough. The book will choose a framework — a way of
        looking — and walk you through it.
      </p>

      {/* Input area */}
      {!recording ? (
        <div className="border-t border-ink border-b border-b-rule pt-7 pb-7 mt-12">
          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What are you trying to decide?"
            rows={5}
            autoFocus
            className="w-full border-none outline-none bg-transparent font-serif text-[22px] leading-[34px] text-ink resize-none placeholder:text-ink-muted placeholder:italic"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
            }}
          />
        </div>
      ) : (
        <div className="font-serif italic text-[22px] leading-[34px] text-ink min-h-[102px] pt-7 pb-7 mt-12 border-t border-ink border-b border-b-rule">
          {transcript ? (
            <>
              <span>&ldquo;{transcript}</span>
              <span className="dm-caret" />
            </>
          ) : (
            <span className="text-ink-muted">
              <em>Speak when you&rsquo;re ready…</em>
              <span className="dm-caret" />
            </span>
          )}
        </div>
      )}

      {/* Framework choice */}
      {!recording && (
        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <span className="folio">Framework</span>
          <div className="inline-flex border border-rule rounded-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("auto")}
              aria-pressed={mode === "auto"}
              className={[
                "font-serif text-sm px-3 py-1.5 cursor-pointer transition-colors duration-200",
                mode === "auto" ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-rule/40",
              ].join(" ")}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              aria-pressed={mode === "manual"}
              className={[
                "font-serif text-sm px-3 py-1.5 cursor-pointer border-l border-rule transition-colors duration-200",
                mode === "manual" ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-rule/40",
              ].join(" ")}
            >
              Manual
            </button>
          </div>

          {mode === "manual" && (
            <select
              value={frameworkId}
              onChange={(e) => setFrameworkId(e.target.value as FrameworkId)}
              className="font-serif text-[15px] text-ink bg-transparent border border-rule rounded-sm px-3 py-1.5 cursor-pointer hover:border-ink focus:outline-none focus:border-ink max-w-full"
            >
              <option value="" disabled>Choose a framework…</option>
              {grouped.map(([cat, items]) => (
                <optgroup key={cat} label={cat}>
                  {items.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-[18px] mt-7 flex-wrap">
        {/* Mic button — only shown when SR is supported */}
        {srSupported && (
          <button
            className={[
              "w-14 h-14 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer",
              recording
                ? "bg-vermilion border-vermilion text-paper animate-mic-pulse"
                : "border-rule text-ink-muted hover:border-ink hover:text-ink",
            ].join(" ")}
            onClick={recording ? stopRecord : startRecord}
            aria-label={recording ? "Stop dictation" : "Dictate"}
          >
            {recording ? (
              <span className="flex items-center gap-[3px] h-6">
                {[8, 16, 22, 14, 18, 10, 14].map((h, i) => (
                  <span key={i} className="dm-wave-bar" style={{ height: h, animationDelay: `${i * 0.1}s` }} />
                ))}
              </span>
            ) : (
              <MicIcon />
            )}
          </button>
        )}

        <span className="hidden sm:inline font-serif italic text-[15px]" style={{ color: recording ? "var(--vermilion)" : "var(--ink-muted)" }}>
          {recording ? "Tap to finish." : srSupported ? "Or tap to dictate." : ""}
        </span>

        <div className="ml-auto flex gap-3">
          {recording ? (
            <button
              className="font-serif text-base font-medium px-[22px] py-3 rounded-sm border border-rule text-ink hover:border-ink transition-colors duration-200 cursor-pointer bg-transparent"
              onClick={cancelRecord}
            >
              Cancel
            </button>
          ) : (
            <>
              <button
                className="font-serif text-base font-medium px-[22px] py-3 rounded-sm border border-rule text-ink hover:border-ink transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent"
                onClick={() => setText("")}
                disabled={!text}
              >
                Clear
              </button>
              <button
                className="font-serif text-base font-medium px-[22px] py-3 rounded-sm bg-vermilion text-paper hover:bg-vermilion-deep transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] cursor-pointer"
                onClick={submit}
                disabled={!canSubmit}
              >
                Decide →
              </button>
            </>
          )}
        </div>
      </div>

      {/* Examples */}
      <div className="mt-20">
        <span className="folio">Or begin with one of these</span>
        <ul className="list-none p-0 mt-4">
          {EXAMPLES.map((ex, i) => (
            <li
              key={i}
              onClick={() => { setText(ex); taRef.current?.focus(); }}
              className="py-[18px] border-t border-rule font-serif text-[17px] italic cursor-pointer flex gap-4 items-baseline last:border-b last:border-b-rule hover:pl-3 hover:text-vermilion transition-all duration-200"
            >
              <span className="font-code text-[11px] tracking-[0.22em] text-ink-muted not-italic w-7 flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
