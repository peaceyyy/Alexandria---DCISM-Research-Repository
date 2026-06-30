import type { ServiceError, ServiceResult, PaginationMeta } from "./types";

/** Wrap a successful value in the standard envelope. */
export function ok<T>(data: T, meta?: PaginationMeta): ServiceResult<T> {
  return {
    data,
    error: null,
    ...(meta ? { meta } : {}),
  };
}

/** Wrap a known ServiceError. */
export function err<T>(error: ServiceError): ServiceResult<T> {
  return {
    data: null,
    error,
  };
}

/** Construct a typed ServiceError literal. */
export function makeError(
  code: string,
  message: string,
  details?: Record<string, unknown>,
): ServiceError {
  return {
    code,
    message,
    ...(details ? { details } : {}),
  };
}
