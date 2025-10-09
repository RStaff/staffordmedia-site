import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json(
    { service: 'staffordmedia', connected_to: 'abando.ai' },
    { headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*',
      } }
  );
}
