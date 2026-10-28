import { ArrowUpRightIcon, StarIcon } from "@phosphor-icons/react/ssr";
import { reviewPlatforms, reviews } from "@/lib/doctor";
import { getGoogleReviews } from "@/lib/google-reviews";
import { Reveal } from "../motion";
import { ReviewCarousel } from "../review-carousel";

/** Every written review across platforms in one carousel, with each platform's rating. */
export async function AllReviews() {
  const google = await getGoogleReviews();
  // Live Google reviews are added only when not already stored, and Google
  // reviews are shown only when rated five stars.
  const stored = new Set(reviews.filter((r) => r.source === "google").map((r) => r.name));
  const live = (google?.reviews ?? []).filter((r) => !stored.has(r.name));
  const all = [...live, ...reviews].filter((r) => r.source !== "google" || r.rating === 5);
  const platforms = [
    google ? { ...reviewPlatforms.google, rating: google.rating, count: google.count, url: google.url } : reviewPlatforms.google,
    reviewPlatforms.oladoc,
    reviewPlatforms.marham,
  ];

  return (
    <section id="reviews" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">What patients say</h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
              Ratings from each platform, and patients&rsquo; written reviews word for word. Most ratings on{" "}
              {reviewPlatforms.oladoc.name} are left without a comment.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-6">
            <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
              {platforms.map((p) => (
                <li key={p.name} className="bg-bg">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-surface-2"
                  >
                    <span className="flex items-center justify-between text-sm font-semibold">
                      {p.name}
                      <ArrowUpRightIcon
                        size={16}
                        weight="bold"
                        className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                    <span className="flex items-end gap-2">
                      <span className="text-4xl font-semibold leading-none tracking-tight">{p.rating.toFixed(1)}</span>
                      <StarIcon size={20} weight="fill" className="mb-1 text-accent" aria-hidden />
                    </span>
                    <span className="text-sm text-muted">
                      {p.count} {p.count === 1 ? "review" : "reviews"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-12 md:mt-16">
          <ReviewCarousel reviews={all} />
        </div>
      </div>
    </section>
  );
}
