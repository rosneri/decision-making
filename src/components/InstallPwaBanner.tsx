"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "dm-pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isMobileUA() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

type Status =
  | { kind: "hidden" }
  | { kind: "ios" }
  | { kind: "android"; deferred: BeforeInstallPromptEvent | null };

export function InstallPwaBanner() {
  const [status, setStatus] = useState<Status>({ kind: "hidden" });

  useEffect(() => {
    if (!isMobileUA() || isStandalone()) return;

    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* ignore */
    }

    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;

    if (ios) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus({ kind: "ios" });
      return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setStatus({
        kind: "android",
        deferred: e as BeforeInstallPromptEvent,
      });
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const onInstalled = () => setStatus({ kind: "hidden" });
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setStatus({ kind: "hidden" });
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (status.kind !== "android" || !status.deferred) return;
    const deferred = status.deferred;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") {
      setStatus({ kind: "hidden" });
    } else {
      dismiss();
    }
  }

  if (status.kind === "hidden") return null;
  const isIOS = status.kind === "ios";
  const canPrompt = status.kind === "android" && !!status.deferred;

  return (
    <div
      role="dialog"
      aria-label="Install Decision Making"
      className="fixed inset-x-3 bottom-3 z-30 sm:hidden rounded-lg border border-rule bg-paper-deep/95 px-4 py-3 shadow-lg backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm">
          <div className="font-serif font-medium text-ink">
            Install Decision Making
          </div>
          {isIOS ? (
            <p className="mt-1 text-ink-muted text-[13px] leading-snug">
              Tap the Share icon, then{" "}
              <span className="whitespace-nowrap">“Add to Home Screen”</span>.
            </p>
          ) : (
            <p className="mt-1 text-ink-muted text-[13px] leading-snug">
              Add to your home screen for a faster, app-like experience.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          {canPrompt && (
            <button
              type="button"
              onClick={install}
              className="rounded-md bg-vermilion px-3 py-1.5 text-[13px] font-medium text-paper hover:bg-vermilion-deep transition-colors cursor-pointer"
            >
              Install
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-md border border-rule bg-transparent px-3 py-1.5 text-[13px] text-ink-muted hover:text-ink hover:border-ink transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
