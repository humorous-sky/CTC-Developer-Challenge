import { NextResponse } from 'next/server';

/**
 * Throw this from a route (or a validator) and `handleError` will turn it into
 * the matching JSON response. Known failures should go through here so status
 * codes are not duplicated in every handler.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

type PgError = { code: string };

function isPgError(err: unknown): err is PgError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as { code: unknown }).code === 'string'
  );
}

/**
 * Central error -> HTTP response mapper. Call it from a route's `catch` block.
 *
 * Known `HttpError`s keep their status and message. Malformed JSON and common
 * Postgres constraint failures are mapped to 4xx. Anything else is a generic
 * 500 — the original error is logged, never sent to the client.
 */
export function handleError(err: unknown): NextResponse {
  if (err instanceof HttpError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  // `req.json()` throws SyntaxError on malformed / empty bodies.
  if (err instanceof SyntaxError) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (isPgError(err)) {
    switch (err.code) {
      case '23502': // not_null_violation
        return NextResponse.json(
          { error: 'Missing required field' },
          { status: 400 }
        );
      case '22P02': // invalid_text_representation
        return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
      case '22003': // numeric_value_out_of_range
        return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
      case '23505': // unique_violation
        return NextResponse.json({ error: 'Conflict' }, { status: 409 });
      case '23503': // foreign_key_violation
        return NextResponse.json({ error: 'Conflict' }, { status: 409 });
      default:
        break;
    }
  }

  console.error('Unhandled API error:', err);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
