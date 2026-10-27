# Dr. Obaid Ur Rehman, Urologist

Website and installable app (PWA) for Dr. Obaid Ur Rehman, consultant urologist in Lahore.
Built with Next.js 16, React Three Fiber (3D), Motion (animation) and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 (service worker disabled in dev)
npm run build && npm start   # production build, PWA enabled
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) before a production build so canonical
links, the sitemap and structured data use the real domain.

## Editing content

| What | Where |
| --- | --- |
| Name, qualifications, clinics, timings, fees, phone numbers, reviews, FAQs | `src/lib/doctor.ts` |
| Treatment guides (steps, recovery, risks, FAQs) | `src/lib/treatments.ts` |
| Doctor's portrait | Put a photo in `public/images/` and set `doctor.photo` in `src/lib/doctor.ts` |
| App icons | Edit `scripts/generate-icons.mjs`, then run `npm run icons` |

Fields marked `VERIFY` in `src/lib/doctor.ts` differ between Oladoc and Marham and should be
confirmed with the clinic.

## How it is put together

- `src/app/page.tsx`: home page. Sections live in `src/components/sections/`.
- `src/app/treatments/[slug]/page.tsx`: one guide per treatment, statically generated.
- `src/components/three/`: 3D scenes. The kidney and other organs are generated in code
  (`geometry.ts`), so there are no model files to download and the scenes work offline.
  - `hero-scene.tsx`: kidney with stones you can tap to break.
  - `anatomy-scene.tsx`: tappable urinary system linked to the explorer panel.
  - `procedure-scene.tsx`: one animated scene per treatment, driven by the scroll step.
- `src/components/scroll-flow.tsx`: section transitions and the side progress rail.
- Page changes use React `<ViewTransition>`: treatment titles and icons morph between the
  home page and each guide.

## PWA

- Manifest: `src/app/manifest.ts`. Service worker: `public/sw.js` (registered in production only).
- Pages are network first with an offline fallback (`/offline`), which keeps clinic timings and
  the booking number available without a connection.
- After changing caching behaviour in `sw.js`, bump `VERSION` so old caches are cleared.
- The "Install app" button appears where the browser supports installation. On iPhone it shows
  Add to Home Screen steps instead.
