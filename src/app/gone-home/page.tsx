import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Art } from '@/components/Art';
import { Photo } from '@/components/Photo';
import { PupBuddy } from '@/components/PupBuddy';
import { goneHeart, ticketRoute } from '@/data/art';
import { goneHome } from '@/lib/data';

export const metadata: Metadata = { title: 'Gone home' };

const TILTS = [-1.4, 1.1, -0.6, 1.6, -1.1, 0.8];

export default function GoneHomePage() {
  return (
    <div data-page="gone" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
        <header className="tp-boothhead">
          <div className="max-w-3xl">
            <h1 className="font-plush text-giant">
              Gone home
              <Art svg={goneHeart} />
            </h1>
            <p className="text-lede mt-6 text-cocoa-soft">
              Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we&apos;ll help you find your match.
            </p>
            <Link className="btn btn-primary mt-8" href="/puppies">
              See available puppies
            </Link>
          </div>
          <div className="tp-booth">
            <PupBuddy className="tp-booth__teddy" />
            <div className="tp-booth__counter">
              <span className="font-plush">tickets home</span>
            </div>
          </div>
        </header>
        <div>
          <ul className="tp-tickets" aria-label="Puppies who have gone home">
            {goneHome.map((p, i) => (
              <li key={p.slug} className="tp-ticket" data-reveal="true" style={{ '--tilt': `${TILTS[i % TILTS.length]}deg`, '--i': i } as CSSProperties}>
                <Link className="tp-ticket__link" href={`/puppies/${p.slug}`}>
                  <span className="tp-ticket__main">
                    <span className="tp-ticket__photo">
                      <Photo media={p.cover} sizes="9rem" />
                    </span>
                    <span className="tp-ticket__body">
                      <span className="font-scrawl tp-ticket__kicker">one ticket home</span>
                      <span className="font-plush tp-ticket__name">{p.displayName}</span>
                      <span className="tp-ticket__meta">{p.name ? `${p.breed}, ${p.genderLabel.toLowerCase()}` : p.genderLabel}</span>
                      <span className="tp-ticket__route">
                        <span>{p.origin?.slug === 'local' ? 'Dubai showroom' : 'TeddyPups'}</span>
                        <Art svg={ticketRoute} />
                        <span>home ♥</span>
                      </span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="tp-ticket__stub">
                    <span className="font-plush">admit one</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
