"use client";

import { useState, type ReactNode } from "react";
import type { FrameworkHelp } from "@/frameworks/help";

interface Props {
  help: FrameworkHelp;
  // Optional content rendered to the right of the "Show guide" toggle, on
  // the same line — lets callers slot in adjacent actions like
  // "Fill by chatting" without relaying out the header.
  trailing?: ReactNode;
}

// Collapsible plain-English explainer rendered just below the framework
// blurb. Defaults to collapsed so it doesn't overwhelm the layout, but the
// "How to use" steps are the first thing a newcomer sees once expanded.
export function FrameworkHelpPanel({ help, trailing }: Props) {
  const [open, setOpen] = useState(false);
  const glossaryEntries = help.glossary ? Object.entries(help.glossary) : [];

  return (
    <div className="mt-4 max-w-[68ch]">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="font-serif text-sm font-medium text-ink hover:text-vermilion transition-colors duration-200 bg-transparent border border-rule rounded-sm px-3 py-1.5 cursor-pointer inline-flex items-center gap-2"
        >
          <span aria-hidden className="text-base leading-none">{open ? "▾" : "▸"}</span>
          {open ? "Hide guide" : "Show guide — what this is & how to use it"}
        </button>
        {trailing}
      </div>

      {open && (
        <div className="mt-3 border-l-2 border-rule pl-4 space-y-4 text-ink">
          {help.expandedName && (
            <p className="font-serif text-[15px] text-ink-muted">
              <span className="not-italic font-medium text-ink">Full name:</span>{" "}
              {help.expandedName}
            </p>
          )}

          <div>
            <h3 className="folio folio-accent mb-1">What it is</h3>
            <p className="font-serif text-[16px] leading-[1.55]">{help.whatItIs}</p>
          </div>

          <div>
            <h3 className="folio folio-accent mb-1">How to use it</h3>
            <ol className="font-serif text-[16px] leading-[1.55] list-decimal pl-5 space-y-1">
              {help.howToUse.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {glossaryEntries.length > 0 && (
            <div>
              <h3 className="folio folio-accent mb-1">Glossary</h3>
              <dl className="font-serif text-[15px] leading-[1.55] grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                {glossaryEntries.map(([term, def]) => (
                  <div key={term} className="contents">
                    <dt className="font-medium text-ink whitespace-nowrap">{term}</dt>
                    <dd className="text-ink-muted">{def}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
