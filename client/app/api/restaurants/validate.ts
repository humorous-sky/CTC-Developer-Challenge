import { HttpError } from '@/lib/errors';

export type RestaurantInput = {
  name: string;
  cuisine: string | null;
  address: string | null;
  rating: number | null;
};

/**
 * Restaurant ids are SERIAL integers. Anything that is not a positive integer
 * cannot match a row, so the contract answers 404 (not 400).
 */
export function parseRestaurantId(id: string): number {
  if (!/^[1-9]\d*$/.test(id)) {
    throw new HttpError(404, 'Restaurant not found');
  }
  const parsed = Number(id);
  // Postgres INTEGER max; larger values error at the driver instead of matching.
  if (!Number.isSafeInteger(parsed) || parsed > 2_147_483_647) {
    throw new HttpError(404, 'Restaurant not found');
  }
  return parsed;
}

function optionalNullableString(
  body: Record<string, unknown>,
  field: string
): string | null {
  if (!(field in body) || body[field] === undefined || body[field] === null) {
    return null;
  }
  if (typeof body[field] !== 'string') {
    throw new HttpError(400, `${field} must be a string or null`);
  }
  return body[field];
}

function optionalNullableRating(body: Record<string, unknown>): number | null {
  if (!('rating' in body) || body.rating === undefined || body.rating === null) {
    return null;
  }
  if (typeof body.rating !== 'number' || !Number.isFinite(body.rating)) {
    throw new HttpError(400, 'rating must be a number');
  }
  if (body.rating < 0 || body.rating > 5) {
    throw new HttpError(400, 'rating must be between 0 and 5');
  }
  return body.rating;
}

/**
 * Validate a create/update body before it reaches Postgres.
 *
 * - `name` is required, a non-empty string
 * - `cuisine` and `address` are optional strings (or null)
 * - `rating` is optional; when present it must be a finite number in [0, 5]
 */
export function parseRestaurantBody(input: unknown): RestaurantInput {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new HttpError(400, 'Request body must be a JSON object');
  }

  const body = input as Record<string, unknown>;

  if (!('name' in body) || body.name === undefined || body.name === null) {
    throw new HttpError(400, 'name is required');
  }
  if (typeof body.name !== 'string') {
    throw new HttpError(400, 'name must be a string');
  }
  const name = body.name.trim();
  if (name.length === 0) {
    throw new HttpError(400, 'name must not be empty');
  }

  return {
    name,
    cuisine: optionalNullableString(body, 'cuisine'),
    address: optionalNullableString(body, 'address'),
    rating: optionalNullableRating(body),
  };
}
