export type EnquiryErrors = Partial<Record<'name' | 'phone' | 'email' | 'website' | 'form', string>>;
export type EnquiryResult = { ok: boolean; errors?: EnquiryErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

// Shared by the browser (instant feedback) and the API route (the real check).
export function validateEnquiry(data: Record<string, string>): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const name = data.name?.trim() ?? '';
  if (name.length < 2 || name.length > 80) errors.name = 'Please tell us your name.';
  if (!PHONE.test(data.phone?.trim() ?? '')) errors.phone = 'Please enter a phone number with country code.';
  if (data.email?.trim() && !EMAIL.test(data.email.trim())) errors.email = 'That email does not look right.';
  return errors;
}

export async function submitEnquiry(form: FormData): Promise<EnquiryResult> {
  const data = Object.fromEntries(form) as Record<string, string>;
  const errors = validateEnquiry(data);
  if (Object.keys(errors).length) return { ok: false, errors };
  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return (await res.json()) as EnquiryResult;
  } catch {
    return { ok: false, errors: { form: 'Something went wrong. Please try WhatsApp instead.' } };
  }
}
