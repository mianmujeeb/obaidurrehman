import { PlusIcon } from "@phosphor-icons/react/ssr";
import { faqs } from "@/lib/doctor";
import { MoreLink } from "../more-link";
import { Reveal } from "../motion";

type Qa = { q: string; a: string };

/** Accordion of questions. Defaults to the general FAQs; `more` links to the full list. */
export function Faq({
  id = "faq",
  title = "Common questions",
  items = faqs,
  more = false,
}: {
  id?: string;
  title?: string;
  items?: Qa[];
  more?: boolean;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">{title}</h2>
          {more && <MoreLink href="/reviews#questions" className="mt-8">All questions</MoreLink>}
        </Reveal>
        <Reveal className="faq lg:col-span-8" delay={0.08}>
          <QuestionList items={items} name={id} openFirst />
        </Reveal>
      </div>
    </section>
  );
}

/** Exclusive accordion: opening one answer in the group closes the others. */
export function QuestionList({ items, name, openFirst = false }: { items: Qa[]; name: string; openFirst?: boolean }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => (
        <details key={f.q} name={name} className="group" open={openFirst && i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition duration-300 group-open:rotate-45 group-open:border-accent group-open:text-accent">
              <PlusIcon size={16} weight="bold" aria-hidden />
            </span>
          </summary>
          <p className="max-w-[65ch] pb-6 leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
