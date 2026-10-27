import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BackToTop } from "@/components/back-to-top";
import { Providers } from "@/components/booking";
import { ServiceWorkerRegistrar } from "@/components/pwa/install";
import { ThemeColor } from "@/components/theme-toggle";
import { installPromptCapture } from "@/lib/pwa-capture";
import { themeInit } from "@/lib/theme-script";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Dr. Obaid Ur Rehman is a consultant urologist and kidney stone specialist in Lahore. FCPS Urology, Assistant Professor at Omar Hospital, Johar Town. Laser stone surgery, PCNL, prostate care and male infertility.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dr. Obaid Ur Rehman | Urologist and Kidney Stone Specialist in Lahore",
    template: "%s | Dr. Obaid Ur Rehman",
  },
  description,
  applicationName: "Dr. Obaid Ur Rehman",
  keywords: [
    "urologist Lahore",
    "kidney stone specialist Lahore",
    "prostate specialist Lahore",
    "Dr. Obaid Ur Rehman",
    "Omar Hospital Johar Town urologist",
    "PCNL Lahore",
    "laser stone surgery",
  ],
  alternates: { canonical: "/" },
  appleWebApp: { capable: true, title: "Dr. Obaid", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "Dr. Obaid Ur Rehman",
    title: "Dr. Obaid Ur Rehman, Urologist in Lahore",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // theme-color is rendered by <ThemeColor /> so it can follow the theme switch.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The head script adds data-theme before React hydrates, so <html> may not match the server render.
    <html lang="en" className={`${jakarta.variable} antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Static constants; React escapes any closing script tag in children. */}
        <script>{themeInit}</script>
        <script>{installPromptCapture}</script>
      </head>
      <body className="min-h-dvh font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <BackToTop />
        <ThemeColor />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
