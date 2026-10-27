import { doctor, ratings } from "@/lib/doctor";
import { cn } from "@/lib/utils";
import { CountUp } from "../motion";

const items = [
  { value: doctor.experienceYears, unit: "years", label: "of experience" },
  { value: ratings.average, decimals: 1, unit: "/ 5", label: "average patient rating" },
  { value: ratings.reviews, unit: "", label: "patient reviews" },
  { value: ratings.satisfied, suffix: "%", unit: "", label: "of patients satisfied" },
];

// 2x2 on phones, 1x4 from lg up; borders follow the grid.
const cellBorders = [
  "pr-5",
  "border-l pl-5 md:pl-8",
  "border-t pr-5 lg:border-l lg:border-t-0 lg:pl-8",
  "border-l border-t pl-5 md:pl-8 lg:border-t-0",
];

export function Stats() {
  return (
    <section aria-label="Experience and ratings" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <div key={s.label} className={cn("border-line py-8 md:py-10", cellBorders[i])}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="text-4xl font-semibold tracking-tight md:text-5xl">
                  <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
                </span>
                {s.unit && <span className="ml-1.5 text-base font-medium text-muted">{s.unit}</span>}
                <span className="mt-1.5 block text-sm text-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="border-t border-line py-3 text-xs text-muted">
          Ratings from {ratings.reviews} patient reviews on {ratings.source}, October 2026. PMDC verified.
        </p>
      </div>
    </section>
  );
}
