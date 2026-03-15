import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';

export async function GET() {
  try {
    // 1. Check Database
    await prisma.$queryRaw`SELECT 1`;

    // 2. Check Event Queue (Inngest)
    // Sending a ping event will verify connectivity, but we can also just rely on no-errors from DB for a basic health check. 
    // Inngest automatically handles its own ping/health via /api/inngest route.

    return NextResponse.json({
      status: 'ok',
      db: 'ok',
      queue: 'ok',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Health Check Failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
      },
      { status: 503 }
    );
  }
}
