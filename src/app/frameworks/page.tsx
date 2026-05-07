"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FRAMEWORKS, METRICS, SAMPLES } from "@/frameworks";
import { HELP } from "@/frameworks/help";
import { FrameworkRenderer } from "@/components/FrameworkRenderer";
import { FrameworkHelpPanel } from "@/components/FrameworkHelpPanel";
import { LibraryHeader } from "@/components/LibraryHeader";
import { ResultStrip } from "@/components/ResultStrip";

function toRoman(n: number): string {
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of map) {
    while (n >= v) { out += s; n -= v; }
  }
  return out;
}

export default function FrameworksPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FRAMEWORKS;
    return FRAMEWORKS.filter((f) => {
      const hay = `${f.name} ${f.category ?? ""} ${f.blurb ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <>
      <LibraryHeader />

      <main className="w-full max-w-[1080px] mx-auto px-5 sm:px-8 md:px-10 py-10 sm:py-16 pb-32">
        {/* Page head */}
        <div className="mb-16 border-b border-rule pb-10">
          <span className="folio folio-accent">§ Library</span>
          <h1 className="font-serif text-[34px] sm:text-[42px] md:text-[52px] leading-[1.06] font-medium tracking-[-0.012em] mt-3.5 text-ink text-balance">
            The frameworks.
          </h1>
          <p className="font-serif italic text-[19px] leading-[30px] text-ink-muted max-w-[56ch] mt-4">
            Three ways of looking at a decision. Each is interactive — adjust the
            data and the numbers move. When you&rsquo;re ready,{" "}
            <Link href="/" className="border-b border-rule hover:border-ink hover:text-ink transition-colors duration-200">
              bring a real one
            </Link>
            .
          </p>

          {/* Search */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 max-w-[56ch]">
            <label
              htmlFor="library-search"
              className="folio folio-accent shrink-0"
            >
              Search
            </label>
            <input
              id="library-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="name, category, or idea…"
              className="flex-1 bg-transparent border-b border-rule focus:border-ink outline-none font-serif italic text-[17px] text-ink placeholder:text-ink-muted/60 py-1.5 transition-colors duration-200"
            />
            {query ? (
              <span className="folio text-ink-muted shrink-0">
                {filtered.length} of {FRAMEWORKS.length}
              </span>
            ) : null}
          </div>
        </div>

        {/* Framework sections */}
        {filtered.length === 0 ? (
          <p className="font-serif italic text-[19px] text-ink-muted">
            No frameworks match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <div className="space-y-16 sm:space-y-24">
            {filtered.map((f, idx) => (
              <section key={f.id} id={f.id} className="scroll-mt-8">
                {/* Section head */}
                <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-7 items-baseline mb-10">
                  <span className="font-serif font-medium text-[44px] sm:text-[64px] leading-[0.9] text-vermilion tracking-[-0.02em]">
                    {toRoman(idx + 1)}.
                  </span>
                  <div>
                    <span className="folio folio-accent block mb-1">Framework</span>
                    <h2 className="font-serif text-[28px] sm:text-[34px] md:text-[40px] font-medium tracking-[-0.008em] leading-[1.1] mt-1.5 text-ink">
                      {f.name}
                    </h2>
                    <p className="font-serif italic text-ink-muted text-[17px] mt-2 max-w-[60ch]">
                      {f.blurb}
                    </p>
                    {HELP[f.id] ? <FrameworkHelpPanel help={HELP[f.id]!} /> : null}
                  </div>
                </div>

                <FrameworkRenderer result={SAMPLES[f.id]} />
                <ResultStrip metrics={METRICS[f.id]?.(SAMPLES[f.id]) ?? []} />
              </section>
            ))}
          </div>
        )}

        {/* Footer rule */}
        <div className="mt-24 pt-8 border-t border-rule flex flex-wrap items-center justify-between gap-y-2">
          <span className="folio">Decision Making</span>
          <Link
            href="/"
            className="font-serif italic text-sm text-ink-muted hover:text-ink border-b border-transparent hover:border-ink transition-colors duration-200"
          >
            Begin →
          </Link>
        </div>
      </main>
    </>
  );
}
