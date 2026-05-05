"use client";

import { useEffect, useRef, useState } from "react";
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

export default function DecidePage() {
  const [text, setText] = useState("");
  const [framework, setFramework] = useState<FrameworkId | "auto">("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FrameworkResult | null>(null);

  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SR;
      webkitSpeechRecognition?: new () => SR;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    // One-time feature detection on mount; SSR cannot read window.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(true);
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
    if (recording) {
      r.stop();
      setRecording(false);
    } else {
      try {
        r.start();
        setRecording(true);
      } catch {
        /* already started */
      }
    }
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
        body: JSON.stringify({
          text,
          framework: framework === "auto" ? undefined : framework,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          ← back
        </Link>
        <Link
          href="/frameworks"
          className="text-sm text-neutral-500 hover:underline"
        >
          browse frameworks
        </Link>
      </div>

      <h1 className="text-3xl font-semibold mb-2">Make a decision</h1>
      <p className="text-neutral-500 mb-8">
        Describe what you&apos;re trying to decide. The AI picks the right
        framework and walks you through it.
      </p>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. I'm choosing between three job offers — one at a startup with high equity, one at a mid-size company with great work-life balance, and one at a FAANG with the highest salary..."
            className="w-full min-h-[180px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent p-4 pr-14 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {supported && (
            <button
              onClick={toggleRecord}
              type="button"
              title={recording ? "Stop recording" : "Record voice"}
              className={`absolute top-3 right-3 h-10 w-10 rounded-full flex items-center justify-center border transition ${
                recording
                  ? "bg-rose-500 text-white border-rose-500 animate-pulse"
                  : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {recording ? "■" : "🎙"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-500 mr-2">Framework:</span>
          <button
            onClick={() => setFramework("auto")}
            className={`px-3 py-1.5 rounded-full text-xs border ${
              framework === "auto"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent"
                : "border-neutral-300 dark:border-neutral-700"
            }`}
          >
            Auto (let AI pick)
          </button>
          {FRAMEWORKS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFramework(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs border ${
                framework === f.id
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        <button
          onClick={submit}
          disabled={loading || !text.trim()}
          className="w-full py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing…" : "Analyze decision"}
        </button>

        {error && (
          <div className="rounded-lg border border-rose-300 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900 p-4 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-12">
          <FrameworkRenderer result={result} />
        </div>
      )}
    </main>
  );
}
