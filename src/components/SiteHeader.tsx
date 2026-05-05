"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const THEME_KEY = "dm-theme";

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

export interface SiteHeaderItem {
  label: string;
  // When set, renders a Link.
  href?: string;
  // When set, renders a button.
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

interface Props {
  // Optional running head shown centred on wide screens.
  runningHead?: string;
  // Brand click target. Defaults to "/".
  onBrandClick?: () => void;
  items: SiteHeaderItem[];
}

export function SiteHeader({ runningHead, onBrandClick, items }: Props) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const stored = localStorage.getItem(THEME_KEY);
      return stored === "dark" || stored === "light" ? stored : "light";
    } catch { return "light"; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch {/* ignore */}
  }, [theme]);

  return (
    <header
      className="sticky top-0 z-20 border-b border-rule px-4 sm:px-10 py-[18px] flex items-center justify-between gap-4 sm:gap-7"
      style={{ background: "color-mix(in oklab, var(--paper) 85%, transparent)", backdropFilter: "blur(6px)" }}
    >
      {onBrandClick ? (
        <button
          onClick={onBrandClick}
          className="font-serif font-medium text-[18px] tracking-[0.02em] text-ink bg-transparent border-none cursor-pointer p-0"
        >
          Decision Making
        </button>
      ) : (
        <Link
          href="/"
          className="font-serif font-medium text-[18px] tracking-[0.02em] text-ink hover:text-ink-muted transition-colors duration-200"
        >
          Decision Making
        </Link>
      )}

      {runningHead && (
        <div className="hidden sm:block flex-1 text-center font-serif italic text-ink-muted text-sm overflow-hidden text-ellipsis whitespace-nowrap px-6">
          {runningHead}
        </div>
      )}
      {!runningHead && <div className="flex-1" />}

      <nav className="flex gap-6 items-center">
        {items.map((item) => {
          const baseCls = "font-serif italic text-[15px] border-b pb-0.5 bg-transparent border-t-0 border-l-0 border-r-0 transition-colors duration-200";
          const stateCls = item.disabled
            ? "text-ink-muted border-transparent opacity-50 cursor-default"
            : item.active
              ? "text-ink border-vermilion cursor-pointer"
              : "text-ink-muted border-transparent hover:text-ink cursor-pointer";

          if (item.href && !item.disabled) {
            return (
              <Link key={item.label} href={item.href} className={`${baseCls} ${stateCls}`}>
                {item.label}
              </Link>
            );
          }
          return (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={item.onClick}
              className={`${baseCls} ${stateCls}`}
            >
              {item.label}
            </button>
          );
        })}

        <button
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          className="w-8 h-8 rounded-full border border-rule text-ink-muted hover:border-ink hover:text-ink flex items-center justify-center transition-colors duration-200 bg-transparent cursor-pointer"
          aria-label={theme === "light" ? "Switch to evening theme" : "Switch to daylight theme"}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
      </nav>
    </header>
  );
}
