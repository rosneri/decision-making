import Link from "next/link";
import { FRAMEWORKS } from "@/lib/schemas";
import { SAMPLES } from "@/lib/samples";
import { FrameworkRenderer } from "@/components/FrameworkRenderer";

export default function FrameworksPage() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← back
      </Link>
      <h1 className="text-3xl font-semibold mt-4 mb-2">Frameworks</h1>
      <p className="text-neutral-500 mb-12">
        Three classic decision-making models, fully interactive. Try them with
        sample data here, or{" "}
        <Link href="/decide" className="underline">
          make a real decision
        </Link>
        .
      </p>

      <div className="space-y-16">
        {FRAMEWORKS.map((f) => (
          <section key={f.id} id={f.id} className="scroll-mt-8">
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wide text-neutral-500">
                {f.name}
              </div>
              <p className="text-sm text-neutral-500 mt-1">{f.blurb}</p>
            </div>
            <FrameworkRenderer result={SAMPLES[f.id]} />
          </section>
        ))}
      </div>
    </main>
  );
}
