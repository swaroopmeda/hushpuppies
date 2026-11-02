import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Art } from '@/components/Art';
import { PupBuddy } from '@/components/PupBuddy';
import { PuppyBrowser, PuppyGrid } from '@/components/puppies/PuppyBrowser';
import { PuppySketch } from '@/components/puppies/PuppySketch';
import { sketchUnderline } from '@/data/art';
import { available, goneHome, toCard } from '@/lib/data';
import { WHATSAPP_HREF } from '@/lib/site';

export const metadata: Metadata = { title: 'Available puppies' };

export default function PuppiesPage() {
  const cards = available.map(toCard);
  return (
    <div data-page="pups" className="tp-page">
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                from Teddy&apos;s sketchbook
              </p>
              <h1 id="pups-title" className="font-plush text-giant tp-sketchbook__title" data-reveal="true">
                Available puppies
                <Art svg={sketchUnderline} />
              </h1>
              <p className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft" data-reveal="true">
                Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self" data-reveal="true">
              <PupBuddy facing="left" />
              <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
            </div>
          </div>
          <div className="mt-12">
            <Suspense fallback={<PuppyGrid puppies={cards} />}>
              <PuppyBrowser puppies={cards} askHref={WHATSAPP_HREF} />
            </Suspense>
          </div>
        </div>
      </section>
      <section aria-labelledby="gone-title" className="tp-gone-strip">
        <div className="gutter mx-auto flex max-w-[110rem] flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/3" data-reveal="true">
            <h2 id="gone-title" className="font-plush text-big">
              Already gone home
            </h2>
            <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
            <Link className="btn btn-primary mt-6" href="/gone-home">
              See the puppies who&apos;ve gone home
            </Link>
          </div>
          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
            {goneHome.slice(0, 5).map((p, i) => (
              <li key={p.slug}>
                <PuppySketch pup={toCard(p)} index={i} small />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
