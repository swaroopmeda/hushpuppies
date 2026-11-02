import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Art } from '@/components/Art';
import { LetterForm } from '@/components/LetterForm';
import { Photo } from '@/components/Photo';
import { PupBuddy } from '@/components/PupBuddy';
import * as art from '@/data/art';
import { available, showroom } from '@/lib/data';
import { ADDRESS, EMAIL, MAPS_URL, PHONE, PHONE_HREF, WHATSAPP_HREF } from '@/lib/site';

export const metadata: Metadata = { title: 'Visit & contact' };

const options = available.map((p) => ({
  id: p.id,
  label: p.name ? `${p.name} (${p.breed}, ${p.genderLabel.toLowerCase()})` : `${p.breed} (${p.genderLabel.toLowerCase()})`,
}));

export default function ContactPage() {
  return (
    <div data-page="contact" className="tp-page">
      <section
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene"
        style={{ '--sky-top': '#fff9ee', '--sky-bottom': '#f9dca4' } as CSSProperties}
        aria-labelledby="contact-title"
      >
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to
              adopt or just seeking info, we&apos;d love to hear from you!
            </p>
          </header>
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <LetterForm puppies={options} whatsappHref={WHATSAPP_HREF} />
              <PupBuddy facing="left" className="ml-auto mr-6 -mt-3 w-36 md:w-40" />
            </div>
            <div className="lg:col-span-5 lg:row-start-1">
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
                WhatsApp {PHONE}
              </a>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href={PHONE_HREF}>
                      {PHONE}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 break-all text-lg font-semibold">
                    <a className="link-ink" href={`mailto:${EMAIL}`}>
                      {EMAIL}
                    </a>
                  </dd>
                </div>
              </dl>
              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <Art svg={art.shopSkyline} />
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">
                      Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.
                    </p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <Art svg={art.pin} />
                      {ADDRESS}
                    </p>
                    <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">
                      Open in Google Maps
                    </a>
                  </div>
                  <figure className="tp-visit__photo">
                    <Photo media={showroom[3]} sizes="14rem" />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
