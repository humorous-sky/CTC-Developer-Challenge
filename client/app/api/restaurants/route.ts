import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError } from '@/lib/errors';
import { toRestaurant } from '@/lib/types';
import { parseRestaurantBody } from './validate';

/**
 * GET /api/restaurants
 * Returns all restaurants.
 */
export async function GET() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM restaurants ORDER BY created_at DESC'
    );
    return NextResponse.json(rows.map(toRestaurant));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/restaurants
 * Create a new restaurant.
 */
export async function POST(req: Request) {
  try {
    const input = parseRestaurantBody(await req.json());
    const { rows } = await pool.query(
      `INSERT INTO restaurants (name, cuisine, address, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [input.name, input.cuisine, input.address, input.rating]
    );
    return NextResponse.json(toRestaurant(rows[0]), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
