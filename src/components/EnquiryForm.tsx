'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { submitEnquiry, type EnquiryErrors } from '@/lib/enquiry';

const FIELD =
  'mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]';

const Optional = () => <span className="font-normal text-cocoa-soft"> (optional)</span>;
const Required = () => <span className="text-toffee-ink"> *</span>;

export function EnquiryForm({ puppyId, message }: { puppyId: string; message: string }) {
  const id = useId();
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const result = await submitEnquiry(new FormData(e.currentTarget));
    setPending(false);
    setErrors(result.errors ?? {});
    if (result.ok) setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="text-center">
        <p className="font-plush text-[2rem]">Message received!</p>
        <p className="mx-auto mt-2 max-w-[40ch] text-cocoa-soft">Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="block text-[0.95rem] font-semibold">
            Your name
            <Required />
          </label>
          <input id={`${id}-name`} name="name" className={FIELD} autoComplete="name" required minLength={2} maxLength={80} aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-sm text-[#b3261e]">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="block text-[0.95rem] font-semibold">
            Phone or WhatsApp
            <Required />
          </label>
          <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" className={FIELD} autoComplete="tel" required aria-invalid={!!errors.phone} />
          <p className={`mt-1 text-sm ${errors.phone ? 'text-[#b3261e]' : 'text-cocoa-soft'}`}>{errors.phone ?? 'With country code, e.g. +971 50 123 4567'}</p>
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="block text-[0.95rem] font-semibold">
            Email
            <Optional />
          </label>
          <input id={`${id}-email`} name="email" type="email" className={FIELD} autoComplete="email" aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-sm text-[#b3261e]">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-area`} className="block text-[0.95rem] font-semibold">
            Your area
            <Optional />
          </label>
          <input id={`${id}-area`} name="area" className={FIELD} autoComplete="address-level2" maxLength={80} />
          <p className="mt-1 text-sm text-cocoa-soft">e.g. Dubai Marina</p>
        </div>
      </div>
      <input type="hidden" name="puppyId" value={puppyId} />
      <div>
        <label htmlFor={`${id}-message`} className="block text-[0.95rem] font-semibold">
          Message <Optional />
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          maxLength={2000}
          defaultValue={message}
          className="mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 py-3 text-base outline-none focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)]"
        />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      {errors.form && <p role="alert" className="text-sm text-[#b3261e]">{errors.form}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-70 sm:w-auto">
        {pending ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
