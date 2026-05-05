import Link from "next/link";
import { FRAMEWORKS } from "@/frameworks";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-4xl mx-auto">
      <div className="mb-16">
        <div className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
          Decision Making
        </div>
        <h1 className="text-5xl font-semibold tracking-tight mb-4">
          Make better decisions, faster.
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Describe what you&apos;re wrestling with — typed or spoken — and an AI
          coach picks the right decision-making framework, fills it in, and
          gives you a concrete recommendation.
        </p>

        <div className="flex gap-3 mt-8">
          <Link
            href="/decide"
            className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Make a decision →
          </Link>
          <Link
            href="/frameworks"
            className="px-5 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            Browse frameworks
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FRAMEWORKS.map((f) => (
          <Link
            key={f.id}
            href={`/frameworks#${f.id}`}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-emerald-500 transition"
          >
            <div className="font-semibold mb-2">{f.name}</div>
            <div className="text-sm text-neutral-500">{f.blurb}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
