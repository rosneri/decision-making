"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  ready?: boolean;
  onDone: () => void;
}

const LINES = [
  "Reading what you wrote.",
  "Looking for the shape of it.",
  "Drawing the plate.",
];

export function ReadingInterstitial({ text, ready = false, onDone }: Props) {
  const [phase, setPhase] = useState(0);
  const [animDone, setAnimDone] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);

  // Advance to result when both animation and API are done
  useEffect(() => {
    if (animDone && ready) onDone();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animDone, ready]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t1 = setTimeout(() => setPhase(1), 900);
      const t2 = setTimeout(() => setPhase(2), 1700);
      const t3 = setTimeout(() => setAnimDone(true), 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    };

    // Start immediately if already in view; otherwise wait for it
    if (typeof IntersectionObserver === "undefined") {
      return start();
    }

    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          cleanup = start();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => { observer.disconnect(); cleanup?.(); };
  // onDone is stable across renders — intentional omission
   
  }, []);

  return (
    <main ref={rootRef} className="max-w-[760px] mx-auto px-10 py-[200px] text-center animate-page-in">
      <span className="folio folio-accent flex justify-center">
        <span className="flex gap-[6px] items-center mb-4">
          {[0, 1, 2].map((i) => (
            <span key={i} className="dm-dot" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </span>
      </span>
      <p
        key={phase}
        className="font-serif italic text-[28px] leading-[1.4] text-ink mt-8 text-balance animate-fade-phase"
      >
        {LINES[phase]}
      </p>
      <div className="mt-12 font-serif italic text-ink-muted text-[16px] max-w-[520px] mx-auto text-pretty">
        &ldquo;{text}&rdquo;
      </div>
    </main>
  );
}
