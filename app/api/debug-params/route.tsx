import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  // Simple parameter debugging
  const url = new URL(request.url);
  const allParams = Object.fromEntries(url.searchParams.entries());
  
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2D1B47",
          fontFamily: "monospace",
          color: "white",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", margin: "0 0 20px 0" }}>
          URL Debug
        </h1>
        <p style={{ fontSize: "16px", margin: "0 0 10px 0" }}>
          Full URL: {request.url}
        </p>
        <p style={{ fontSize: "14px", margin: "0 0 10px 0" }}>
          Params found: {Object.keys(allParams).length}
        </p>
        <div style={{ fontSize: "12px", textAlign: "left" }}>
          {Object.entries(allParams).map(([key, value]) => (
            <div key={key} style={{ margin: "5px 0" }}>
              {key}: {value}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  );
}
