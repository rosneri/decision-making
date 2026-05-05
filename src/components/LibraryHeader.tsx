"use client";

import { useState } from "react";
import { SiteHeader } from "./SiteHeader";

const APP_STATE_KEY = "dm-app-state-v2";

function readHasResult(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { result?: unknown };
    return Boolean(parsed?.result);
  } catch { return false; }
}

// Wrapper around SiteHeader that surfaces the Result item on the Library page
// when there's a saved decision result. Clicking Result navigates back to the
// app at /, where DecisionApp restores the result from localStorage.
export function LibraryHeader() {
  const [hasResult] = useState<boolean>(readHasResult);

  return (
    <SiteHeader
      items={[
        ...(hasResult ? [{ label: "Result", href: "/?view=result" }] : []),
        { label: "Compose", href: "/" },
        { label: "Library", href: "/frameworks", active: true },
      ]}
    />
  );
}
