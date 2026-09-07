import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError } from '@/lib/errors';
import { toVisit } from '@/lib/types';

/**
 * GET /api/visits
 * Returns all visits, newest date first.
 */
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM visits ORDER BY date DESC, id DESC`
    );
    return NextResponse.json(rows.map(toVisit));
  } catch (err) {
    return handleError(err);
  }
}
