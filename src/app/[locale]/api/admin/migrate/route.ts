import { NextResponse } from 'next/server';
import { getPendingMigrationsCount, applyMigrations } from '@/lib/db/migrations';

export async function GET() {
  try {
    const pendingMigrations = await getPendingMigrationsCount();
    return NextResponse.json({ pendingMigrations });
  } catch (error) {
    console.error('Error checking for pending migrations:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const message = await applyMigrations();
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error applying database migrations:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
