import { NextResponse } from 'next/server';

export const GET = async (_) => NextResponse.json({
  status: 'ok',
  data: 'Server is up and running',
  serverDate: new Date().toISOString(),
});
