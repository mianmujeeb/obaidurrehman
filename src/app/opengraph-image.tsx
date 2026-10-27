import { ImageResponse } from "next/og";
import { doctor } from "@/lib/doctor";

export const alt = "Dr. Obaid Ur Rehman, Urologist and Kidney Stone Specialist in Lahore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link preview for WhatsApp, Facebook and search results.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b6e6a 0%, #08524f 100%)",
          color: "#f2fbfa",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, opacity: 0.85 }}>{doctor.qualifications.join("  /  ")}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>{doctor.name}</div>
          <div style={{ fontSize: 40, marginTop: 12, opacity: 0.9 }}>Kidney stone and prostate specialist, Lahore</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.85 }}>Omar Hospital &amp; Cardiac Centre, Johar Town</div>
      </div>
    ),
    size,
  );
}
