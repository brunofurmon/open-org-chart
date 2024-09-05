import { NextResponse } from 'next/server';

export const GET = async (_) => {
  // TODO: how to access cache?
  // const cacheReady = await cacheIsReady();
  const cacheReady = true;
  if (!cacheReady) {
    const response = NextResponse.json({
      status: 'error',
      data: 'Cache is not ready. Check connection to Redis. Or simply try again in a few seconds.',
      serverDate: new Date().toISOString(),
    }, {
      status: 500,
    });

    return response;
  }

  return NextResponse.json({
    status: 'ok',
    data: 'Cache is ready',
    serverDate: new Date().toISOString(),
  });
};
