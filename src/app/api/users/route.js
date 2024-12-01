import { NextResponse } from 'next/server';
import { listUsers } from '@/domain/user/service';

export const GET = async (request) => {
  const url = new URL(request.url);
  const debugMode = url.searchParams.get('debug') === 'true';
  const teamView = url.searchParams.get('teamView') === 'true';

  const users = await listUsers(debugMode, teamView);

  return NextResponse.json(users);
}

