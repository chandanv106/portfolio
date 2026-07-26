import { ImageResponse } from "next/og";
import { profile } from "@/data/resume";

export const alt = "Chandan Verma — Java Backend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link preview card for LinkedIn / Twitter / WhatsApp shares.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#050510",
          backgroundImage:
            "radial-gradient(circle at 78% 28%, rgba(34,211,238,0.22), transparent 55%), radial-gradient(circle at 15% 85%, rgba(167,139,250,0.16), transparent 55%)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: "#22d3ee",
            fontSize: 24,
            letterSpacing: "0.22em",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#34d399",
            }}
          />
          ALL SYSTEMS OPERATIONAL
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            color: "#e6edf7",
            marginTop: 28,
            letterSpacing: "-0.02em",
          }}
        >
          {profile.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 42,
            color: "#67e8f9",
            marginTop: 10,
          }}
        >
          {profile.role}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#8b97ad",
            marginTop: 26,
            maxWidth: 900,
            lineHeight: 1.45,
          }}
        >
          Event-driven microservices · Spring Boot · Apache Kafka · Distributed
          systems
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: 40,
          }}
        >
          {["spring-boot", "kafka", "microservices", "java"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                border: "1px solid rgba(103,232,249,0.4)",
                background: "rgba(34,211,238,0.08)",
                color: "#67e8f9",
                fontSize: 22,
                padding: "8px 18px",
                borderRadius: 4,
                fontFamily: "monospace",
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* neon corner accents */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            width: 46,
            height: 46,
            borderTop: "3px solid #22d3ee",
            borderLeft: "3px solid #22d3ee",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 36,
            width: 46,
            height: 46,
            borderBottom: "3px solid #22d3ee",
            borderRight: "3px solid #22d3ee",
            display: "flex",
          }}
        />
      </div>
    ),
    size
  );
}
