import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Prometheus metrics endpoint for scraping (ECS/Grafana).
 * GET /api/metrics returns Prometheus text format.
 */
export async function GET() {
  const lines: string[] = [
    "# HELP frontend_info Frontend app info",
    "# TYPE frontend_info gauge",
    `frontend_info{service="tally-cash-flow"} 1`,
    "# HELP frontend_uptime_seconds Process uptime approximation",
    "# TYPE frontend_uptime_seconds gauge",
    `frontend_uptime_seconds ${Math.floor(process.uptime?.() ?? 0)}`,
  ];

  const body = lines.join("\n") + "\n";
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
