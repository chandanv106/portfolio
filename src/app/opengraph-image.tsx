import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name}, Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link preview for LinkedIn, WhatsApp, X and Slack shares.
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
          padding: "64px 72px",
          background: "#0b0b0d",
          backgroundImage:
            "radial-gradient(circle at 78% 38%, rgba(255,107,44,0.55), transparent 42%), radial-gradient(circle at 92% 88%, rgba(79,123,255,0.35), transparent 40%)",
          color: "#f4f2ee",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: "0.12em", color: "#b9b7b2" }}>
          <span>SOFTWARE ENGINEER</span>
          <span>{profile.location.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.86 }}>CHANDAN</div>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.86, color: "#ff6b2c" }}>VERMA</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 28, color: "#d8d6d1" }}>
          <span style={{ maxWidth: 760, lineHeight: 1.35 }}>Mobile apps, SaaS products and the backends behind them.</span>
          <span style={{ fontSize: 22, color: "#8e8e98" }}>chandanverma.vercel.app</span>
        </div>
      </div>
    ),
    size
  );
}
