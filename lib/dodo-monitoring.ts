/**
 * Structured logging for Dodo webhook and subscription flows (search logs in Vercel / APM).
 */
const PREFIX = "[dodo]";

export function logDodoInfo(message: string, meta?: Record<string, unknown>): void {
  if (meta && Object.keys(meta).length > 0) {
    console.info(PREFIX, message, meta);
  } else {
    console.info(PREFIX, message);
  }
}

export function logDodoWarning(message: string, meta?: Record<string, unknown>): void {
  if (meta && Object.keys(meta).length > 0) {
    console.warn(PREFIX, message, meta);
  } else {
    console.warn(PREFIX, message);
  }
}

export function logDodoError(message: string, error: unknown, meta?: Record<string, unknown>): void {
  const err =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { value: String(error) };
  console.error(PREFIX, message, { ...meta, ...err });
}
