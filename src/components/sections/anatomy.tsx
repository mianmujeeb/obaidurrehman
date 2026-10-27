import { AnatomyExplorer } from "../anatomy-explorer";
import { Reveal } from "../motion";

export function Anatomy() {
  return (
    <section id="anatomy" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <Reveal className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Interactive 3D</p>
        <h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          Tap an organ to see what is treated there.
        </h2>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">
          Turn the model, then pick a part of the urinary system to see common conditions and the
          procedures Dr. Obaid performs.
        </p>
      </Reveal>
      <Reveal className="mt-10" delay={0.1}>
        <AnatomyExplorer />
      </Reveal>
    </section>
  );
}
