import { cn } from "@/lib/utils";

/** Kidney glyph used for the logo and app icons (see scripts/generate-icons.mjs). */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="120 56 316 404" aria-hidden className={cn("shrink-0", className)} fill="currentColor">
      <path
        d="M226 246 C 186 252, 160 286, 156 336 C 153 376, 162 410, 176 446"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth={26}
        strokeLinecap="round"
      />
      <path d="M300 70 C 392 70, 420 168, 414 246 C 408 334, 362 404, 286 404 C 214 404, 178 360, 190 314 C 198 284, 236 274, 234 248 C 232 222, 196 214, 188 182 C 176 124, 226 70, 300 70 Z" />
    </svg>
  );
}

export function LogoTile({ className }: { className?: string }) {
  return (
    <span className={cn("grid place-items-center rounded-xl bg-accent text-accent-ink", className)}>
      <BrandMark className="h-[62%] w-[62%]" />
    </span>
  );
}
