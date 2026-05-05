import Link from "next/link";
import { FRAMEWORKS, SAMPLES } from "@/frameworks";
import { FrameworkRenderer } from "@/components/FrameworkRenderer";

const ROMAN = ["I", "II", "III", "IV"];

export default function FrameworksPage() {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-rule px-10 py-[18px] flex items-center gap-7"
        style={{ background: "color-mix(in oklab, var(--paper) 85%, transparent)", backdropFilter: "blur(6px)" }}>
        <Link href="/" className="font-serif font-medium text-[18px] tracking-[0.02em] text-ink hover:text-ink-muted transition-colors duration-200">
          Decision Making
        </Link>
        <div className="flex-1" />
        <nav className="flex gap-6 items-center">
          <Link href="/" className="font-serif italic text-[15px] text-ink-muted hover:text-ink border-b border-transparent pb-0.5 transition-colors duration-200">
            Compose
          </Link>
          <Link href="/frameworks" className="font-serif italic text-[15px] text-ink border-b border-vermilion pb-0.5">
            Library
          </Link>
        </nav>
      </header>

      <main className="max-w-[1080px] mx-auto px-10 py-16 pb-32">
        {/* Page head */}
        <div className="mb-16 border-b border-rule pb-10">
          <span className="folio folio-accent">§ Library</span>
          <h1 className="font-serif text-[52px] leading-[1.06] font-medium tracking-[-0.012em] mt-3.5 text-ink text-balance">
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
        </div>

        {/* Framework sections */}
        <div className="space-y-24">
          {FRAMEWORKS.filter((f) => f.id !== "eisenhower").map((f, idx) => (
            <section key={f.id} id={f.id} className="scroll-mt-8">
              {/* Section head */}
              <div className="grid mb-10" style={{ gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "baseline" }}>
                <span className="font-serif font-medium text-[64px] leading-[0.9] text-vermilion tracking-[-0.02em]">
                  {ROMAN[idx]}.
                </span>
                <div>
                  <span className="folio folio-accent block mb-1">Framework</span>
                  <h2 className="font-serif text-[40px] font-medium tracking-[-0.008em] leading-[1.1] mt-1.5 text-ink">
                    {f.name}
                  </h2>
                  <p className="font-serif italic text-ink-muted text-[17px] mt-2 max-w-[60ch]">
                    {f.blurb}
                  </p>
                </div>
              </div>

              <FrameworkRenderer result={SAMPLES[f.id]} />
            </section>
          ))}
        </div>

        {/* Footer rule */}
        <div className="mt-24 pt-8 border-t border-rule flex items-center justify-between">
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
