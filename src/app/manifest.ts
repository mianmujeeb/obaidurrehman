import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Dr. Obaid Ur Rehman, Urologist",
    short_name: "Dr. Obaid",
    description:
      "Consultant urologist and kidney stone specialist in Lahore. Clinic timings, treatments and appointment booking.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f6f6",
    theme_color: "#0b6e6a",
    categories: ["medical", "health"],
    lang: "en-PK",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Book appointment",
        short_name: "Book",
        url: "/?book=1",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Contact and clinic timings",
        short_name: "Contact",
        url: "/contact",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
