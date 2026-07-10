import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Frontend health check – use this for ALB/ECS health checks targeting the app.
 * GET /health returns 200 when the frontend is up.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      frontend: true,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Type": "application/json",
      },
    }
  );
}
