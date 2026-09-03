"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FRAMEWORKS } from "@/frameworks";
import { BIASES, biasesByFamily, type BiasDefinition } from "@/biases";
import { LibraryHeader } from "@/components/LibraryHeader";
import { MicroLabel } from "@/components/ui";

function matches(b: BiasDefinition, q: string): boolean {
  const hay = [b.name, b.family, b.blurb, b.description, ...(b.aka ?? []), ...b.cues].join(" ").toLowerCase();
  return hay.includes(q);
}

export default function BiasesPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return biasesByFamily()
      .map((g) => ({ ...g, biases: q ? g.biases.filter((b) => matches(b, q)) : g.biases }))
      .filter((g) => g.biases.length > 0);
  }, [query]);
  const shown = groups.reduce((n, g) => n + g.biases.length, 0);

  return (
    <>
      <LibraryHeader active="biases" />

      <main className="w-full max-w-[1080px] mx-auto px-5 sm:px-8 md:px-10 py-10 sm:py-16 pb-32">
        <div className="mb-16 pb-10">
          <span className="folio folio-accent">§ Library</span>
          <h1 className="font-serif text-[34px] sm:text-[42px] md:text-[52px] leading-[1.06] font-medium tracking-[-0.012em] mt-3.5 text-ink text-balance">
            The biases.
          </h1>
          <p className="font-serif italic text-[19px] leading-[30px] text-ink-muted max-w-[56ch] mt-4">
            {BIASES.length} ways a mind tilts a decision before the evidence gets a vote.
            Every analysis is checked against this list; the ones that show up in
            your own words are flagged on the result page, with a counter-move and
            a framework that structurally resists them.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 max-w-[56ch]">
            <label htmlFor="bias-search" className="folio folio-accent shrink-0">Search</label>
            <input
              id="bias-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="name, family, symptom…"
              className="flex-1 bg-transparent border-b border-rule focus:border-ink outline-none font-serif italic text-[17px] text-ink placeholder:text-ink-muted/60 py-1.5 transition-colors duration-200"
            />
            {query ? <span className="folio text-ink-muted shrink-0">{shown} of {BIASES.length}</span> : null}
          </div>
        </div>

        {groups.length === 0 ? (
          <p className="font-serif italic text-[19px] text-ink-muted">No biases match &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="space-y-20">
            {groups.map((g) => (
              <section key={g.family} id={g.family} className="scroll-mt-8">
                <div className="mb-8">
                  <span className="folio folio-accent block mb-1">Family</span>
                  <h2 className="font-serif text-[28px] sm:text-[34px] font-medium tracking-[-0.008em] leading-[1.1] text-ink">{g.name}</h2>
                  <p className="font-serif italic text-ink-muted text-[17px] mt-2 max-w-[60ch]">{g.blurb}</p>
                </div>

                <ol className="list-none m-0 p-0 border-t border-ink">
                  {g.biases.map((b) => {
                    const isOpen = open[b.id] ?? false;
                    const antidotes = b.antidotes
                      .map((id) => FRAMEWORKS.find((f) => f.id === id))
                      .filter((f): f is NonNullable<typeof f> => Boolean(f));
                    return (
                      <li key={b.id} id={b.id} className="border-b border-rule py-6 scroll-mt-8">
                        <button
                          type="button"
                          onClick={() => setOpen((o) => ({ ...o, [b.id]: !isOpen }))}
                          aria-expanded={isOpen}
                          className="w-full text-left bg-transparent border-none p-0 cursor-pointer group"
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="font-serif text-[22px] font-medium text-ink group-hover:text-vermilion transition-colors duration-200">
                              {b.name}
                            </span>
                            <span aria-hidden className="font-serif text-ink-muted">{isOpen ? "▾" : "▸"}</span>
                          </div>
                          <p className="font-serif italic text-[16px] text-ink-muted mt-1 max-w-[62ch]">{b.blurb}</p>
                        </button>

                        {isOpen && (
                          <div className="mt-5 space-y-5 max-w-[66ch] animate-stack-in">
                            <p className="font-serif text-[17px] leading-[28px] text-ink">{b.description}</p>

                            <div>
                              <MicroLabel accent bold>How it shows up in a write-up</MicroLabel>
                              <ul className="font-serif text-[16px] leading-[26px] text-ink list-disc pl-5 mt-1.5 space-y-0.5">
                                {b.cues.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                            </div>

                            <p className="font-serif italic text-[17px] leading-[28px] text-ink border-l-2 border-vermilion pl-4">
                              {b.question}
                            </p>

                            <div>
                              <MicroLabel accent bold>Counter-moves</MicroLabel>
                              <ol className="font-serif text-[16px] leading-[26px] text-ink list-decimal pl-5 mt-1.5 space-y-0.5">
                                {b.counters.map((c, i) => <li key={i}>{c}</li>)}
                              </ol>
                            </div>

                            {antidotes.length > 0 && (
                              <div>
                                <MicroLabel>Frameworks that resist it</MicroLabel>
                                <div className="flex gap-2 flex-wrap mt-2">
                                  {antidotes.map((f) => (
                                    <Link
                                      key={f.id}
                                      href={`/frameworks#${f.id}`}
                                      className="font-serif text-sm text-ink hover:text-paper hover:bg-ink border border-rule hover:border-ink rounded-sm px-3 py-1.5 transition-colors duration-200"
                                    >
                                      {f.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-4 flex-wrap">
                              {b.aka && b.aka.length > 0 && <MicroLabel>Also: {b.aka.join(" · ")}</MicroLabel>}
                              {b.source && <MicroLabel>{b.source}</MicroLabel>}
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        )}

        <div className="mt-24 pt-8 border-t border-rule flex flex-wrap items-center justify-between gap-y-2">
          <span className="folio">Decision Making</span>
          <Link href="/" className="font-serif italic text-sm text-ink-muted hover:text-ink border-b border-transparent hover:border-ink transition-colors duration-200">
            Begin →
          </Link>
        </div>
      </main>
    </>
  );
}
