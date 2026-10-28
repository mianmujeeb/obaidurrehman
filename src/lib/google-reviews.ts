import { cacheLife } from "next/cache";
import type { Review } from "./doctor";

export type GoogleReviews = { rating: number; count: number; url: string; reviews: Review[] };

type PlaceResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    publishTime?: string;
    text?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string };
  }[];
};

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "Asia/Karachi" });

// The doctor's Google Business Profile listing.
const PLACE_ID = "ChIJd7mKOV2QrEMRDIeg1nVqN3c";

/**
 * Reviews from the doctor's Google Business Profile through the Places API (New).
 * Google returns at most five, its "most relevant". Off until GOOGLE_PLACES_API_KEY
 * is set (GOOGLE_PLACE_ID overrides the listing); any failure falls back to the
 * stored figures in lib/doctor.ts.
 */
export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  "use cache";
  cacheLife("days");

  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || PLACE_ID;
  if (!key) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
    });
    if (!res.ok) return null;
    const place = (await res.json()) as PlaceResponse;
    if (!place.rating || !place.googleMapsUri) return null;

    return {
      rating: place.rating,
      count: place.userRatingCount ?? 0,
      url: place.googleMapsUri,
      reviews: (place.reviews ?? [])
        .filter((r) => r.text?.text)
        .map((r) => ({
          name: r.authorAttribution?.displayName ?? "Google user",
          text: r.text!.text!,
          source: "google" as const,
          rating: r.rating,
          date: r.publishTime ? monthYear(r.publishTime) : undefined,
          // Google's terms ask for a link back to each reviewer's profile.
          link: r.authorAttribution?.uri,
        })),
    };
  } catch {
    return null;
  }
}
