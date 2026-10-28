import { ArrowUpRightIcon, QuotesIcon, StarIcon } from "@phosphor-icons/react/ssr";
import { links, ratings, reviews, reviewSourceName } from "@/lib/doctor";
import { cn } from "@/lib/utils";
import { MoreLink } from "../more-link";
import { CountUp, Reveal } from "../motion";

const featured = reviews.filter((r) => r.featured);

/** Home page rating and a few patient quotes, linking to every review on /reviews. */
export function Reviews() {
  return (
    <section id="reviews" className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">What patients say</h2>
          <div className="mt-10 flex items-end gap-4">
            <span className="text-7xl font-semibold leading-none tracking-tight md:text-8xl">
              <CountUp to={ratings.average} decimals={1} />
            </span>
            <div className="pb-2">
              <div className="flex gap-0.5 text-accent" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} size={20} weight="fill" />
                ))}
              </div>
              <p className="mt-1 text-sm text-muted">out of 5</p>
            </div>
          </div>
          <p className="mt-6 max-w-[40ch] leading-relaxed text-muted">
            Based on {ratings.reviews} reviews on {ratings.source}, where {ratings.satisfied}% of patients
            reported being satisfied with their visit.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <MoreLink href="/reviews#reviews">Read all reviews</MoreLink>
            <a
              href={links.oladoc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              {ratings.source} profile
              <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
            </a>
          </div>
        </Reveal>

        <ul className="grid gap-4 lg:col-span-7">
          {featured.map((r, i) => (
            <Reveal
              key={r.name}
              as="li"
              delay={i * 0.08}
              className={cn(
                "rounded-3xl border border-line bg-bg p-6 sm:p-8",
                i === 1 && "lg:ml-16",
                i === 2 && "lg:ml-8",
              )}
            >
              <QuotesIcon size={28} weight="fill" className="text-accent" aria-hidden />
              <blockquote className="mt-4 text-xl font-medium leading-snug tracking-tight sm:text-2xl">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <p className="mt-5 text-sm">
                <span className="font-semibold">{r.name}</span>
                <span className="text-muted">, verified patient, {reviewSourceName[r.source]}</span>
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
