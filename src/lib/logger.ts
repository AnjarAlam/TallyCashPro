/**
 * Structured JSON logger for CloudWatch / Grafana trace.
 * Use in API routes and server code: log.info("message", { requestId, path, ... })
 */
const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const;

function formatMessage(
  level: string,
  message: string,
  meta?: Record<string, unknown>
): string {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    service: "tally-cash-flow",
    message,
    ...meta,
  };
  return JSON.stringify(payload);
}

function shouldLog(level: keyof typeof LEVELS): boolean {
  const configuredLevel =
    LOG_LEVEL in LEVELS ? LEVELS[LOG_LEVEL as keyof typeof LEVELS] : LEVELS.info;
  return LEVELS[level] <= configuredLevel;
}

export const log = {
  error(message: string, meta?: Record<string, unknown>) {
    process.stderr.write(formatMessage("error", message, meta) + "\n");
  },
  warn(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("warn"))
      process.stdout.write(formatMessage("warn", message, meta) + "\n");
  },
  info(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("info"))
      process.stdout.write(formatMessage("info", message, meta) + "\n");
  },
  debug(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("debug"))
      process.stdout.write(formatMessage("debug", message, meta) + "\n");
  },
};
