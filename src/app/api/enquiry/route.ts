import { NextResponse } from 'next/server';
import { validateEnquiry } from '@/lib/enquiry';

// There is no database in this clone: a valid enquiry is acknowledged and dropped.
export async function POST(request: Request) {
  let data: Record<string, string>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { form: 'Invalid request.' } }, { status: 400 });
  }

  // Bots fill the hidden field; tell them it worked and ignore the message.
  if (data.website) return NextResponse.json({ ok: true });

  const errors = validateEnquiry(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  return NextResponse.json({ ok: true });
}
