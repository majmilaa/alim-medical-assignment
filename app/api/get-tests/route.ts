import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const result = await pool.query(`
    SELECT mt.name, tc.name AS category, u.name AS unit, mt.normalmin, mt.normalmax
    FROM medicaltests mt
    JOIN testcategories tc ON mt.idcategory = tc.id
    JOIN uom u ON mt.iduom = u.id;
  `);
  return NextResponse.json(result.rows);
}