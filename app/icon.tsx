import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#022c22", // emerald-950
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fbbf24", // amber-400
          fontWeight: 900,
          fontFamily: "sans-serif",
          border: "2px solid #fbbf24", // amber border
        }}
      >
        TS
      </div>
    ),
    {
      ...size,
    }
  );
}
