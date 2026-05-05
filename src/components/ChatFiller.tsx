"use client";

import { useEffect, useRef, useState } from "react";
import type { FrameworkResult } from "@/frameworks";

interface Props {
  frameworkId: FrameworkResult["framework"];
  frameworkName: string;
  decisionText: string;
  data: FrameworkResult;
  onUpdate: (next: FrameworkResult) => void;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  patched?: boolean;
}

interface TurnResponse {
  reply: string;
  updatedData: FrameworkResult | null;
  done: boolean;
  error?: { code: string; message: string };
}

export function ChatFiller({ frameworkId, frameworkName, decisionText, data, onUpdate, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const reqIdRef = useRef(0);
  const dataRef = useRef(data);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const kickedRef = useRef(false);

  // Keep the latest framework data available to in-flight turns without
  // re-triggering the kickoff effect every time the user edits a field.
  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  // Open the conversation: ask the model for its first question.
  useEffect(() => {
    if (kickedRef.current) return;
    kickedRef.current = true;
    void sendTurn({ kickoff: true, history: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendTurn(opts: { kickoff?: boolean; history: ChatMessage[]; userText?: string }) {
    const id = ++reqIdRef.current;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/chat-fill", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          frameworkId,
          decisionText,
          currentData: dataRef.current,
          messages: opts.history.map((m) => ({ role: m.role, content: m.content })),
          kickoff: opts.kickoff ?? false,
        }),
      });
      const body = (await res.json().catch(() => null)) as TurnResponse | null;
      if (id !== reqIdRef.current) return;
      if (!res.ok || !body || !body.reply) {
        setError(body?.error?.message ?? "Couldn't reach the assistant. Try again.");
        return;
      }
      const patched = body.updatedData !== null;
      if (patched && body.updatedData) onUpdate(body.updatedData);
      setMessages((prev) => [...prev, { role: "assistant", content: body.reply, patched }]);
      if (body.done) setDone(true);
    } catch (e) {
      if (id !== reqIdRef.current) return;
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      if (id === reqIdRef.current) setBusy(false);
    }
  }

  function submit() {
    const text = input.trim();
    if (!text || busy) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    void sendTurn({ history: nextHistory, userText: text });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <aside
      className="fixed right-4 sm:right-6 bottom-0 w-[calc(100%-2rem)] sm:w-[420px] h-[80vh] z-30 border border-rule rounded-t-sm bg-paper flex flex-col shadow-[0_-8px_32px_rgba(0,0,0,0.12)] animate-page-in overflow-hidden"
      role="complementary"
      aria-label="Chat with the framework"
    >
      <header className="flex items-center justify-between px-5 py-4 border-b border-rule">
        <div className="min-w-0">
          <div className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Chat fill</div>
          <div className="font-serif text-[17px] text-ink truncate">{frameworkName}</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="w-8 h-8 rounded-full border border-rule text-ink-muted hover:border-ink hover:text-ink flex items-center justify-center bg-transparent cursor-pointer transition-colors duration-200"
        >
          ×
        </button>
      </header>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 && busy && (
          <p className="font-serif italic text-ink-muted text-sm">Thinking of the first question…</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-vermilion text-paper px-4 py-2.5 font-serif text-[15px] leading-relaxed whitespace-pre-wrap"
                  : "max-w-[90%] rounded-2xl rounded-bl-sm border border-rule bg-paper text-ink px-4 py-2.5 font-serif text-[15px] leading-relaxed whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
            {m.role === "assistant" && m.patched && (
              <span className="font-code text-[10px] tracking-[0.18em] uppercase text-vermilion mt-1 ml-1">
                · framework updated
              </span>
            )}
          </div>
        ))}
        {busy && messages.length > 0 && (
          <div className="flex items-start">
            <div className="rounded-2xl rounded-bl-sm border border-rule px-4 py-2.5 text-ink-muted font-serif italic text-sm">
              writing…
            </div>
          </div>
        )}
        {error && (
          <div className="font-serif italic text-vermilion text-sm">{error}</div>
        )}
        {done && (
          <div className="font-serif italic text-ink-muted text-sm">
            Looks good. Close this when you&rsquo;re ready.
          </div>
        )}
      </div>

      <div className="border-t border-rule px-4 py-3">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder={busy ? "…" : "Type your answer. Enter to send."}
            disabled={busy}
            className="flex-1 resize-none border border-rule rounded-sm px-3 py-2 font-serif text-[15px] text-ink bg-paper outline-none focus:border-ink placeholder:italic placeholder:text-ink-muted disabled:opacity-60"
          />
          <button
            onClick={submit}
            disabled={busy || !input.trim()}
            className="font-serif text-sm font-medium px-4 py-2 rounded-sm bg-vermilion text-paper hover:bg-vermilion-deep transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
