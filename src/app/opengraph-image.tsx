import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "80px",
          background: "#0E0F0E",
          color: "#EDEDE8",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 500 }}>{profile.name}</div>
        <div style={{ fontSize: 32, color: "#9AA39C", marginTop: 16 }}>{profile.role}</div>
        <div style={{ fontSize: 28, color: "#2F5D45", marginTop: 40, maxWidth: 900 }}>
          {profile.positioning}
        </div>
      </div>
    ),
    size
  );
}
