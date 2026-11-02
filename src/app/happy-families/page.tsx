import type { Metadata } from 'next';
import { Art } from '@/components/Art';
import { FamilyWall } from '@/components/FamilyWall';
import { PupBuddy } from '@/components/PupBuddy';
import { heart } from '@/data/art';
import { families } from '@/lib/data';
import { TESTIMONIAL } from '@/lib/site';

export const metadata: Metadata = { title: 'Happy families' };

export default function HappyFamiliesPage() {
  return (
    <div data-page="families" className="tp-page">
      <section aria-labelledby="families-title" className="tp-memories">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-memories__head">
            <div>
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                our wall of happy endings
              </p>
              <h1 id="families-title" className="font-plush text-giant tp-memories__title" data-reveal="true">
                Happy families
                <Art svg={heart} />
              </h1>
              <p className="text-lede mt-6 max-w-[50ch] text-cocoa-soft" data-reveal="true">
                Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after
                welcoming their furry friends.
              </p>
              <p className="font-scrawl mt-5 text-lg text-toffee-ink" data-reveal="true">
                {families.length} moments and counting
              </p>
            </div>
            <figure className="tp-memories__note" data-reveal="true">
              <span aria-hidden="true" className="tp-tape tp-tape--center" style={{ '--tape': '#cfe5f6' } as React.CSSProperties} />
              <blockquote className="font-plush-text">“{TESTIMONIAL.quote}”</blockquote>
              <figcaption className="font-scrawl">
                {TESTIMONIAL.author}, {TESTIMONIAL.place}
              </figcaption>
            </figure>
          </div>
          <div className="mt-16 md:mt-20">
            <FamilyWall photos={families} />
          </div>
          <div className="tp-memories__foot">
            <PupBuddy facing="left" className="w-36 md:w-44" />
            <p className="font-scrawl text-lg text-cocoa-soft">every one of them was a Teddy Pup once</p>
          </div>
        </div>
      </section>
    </div>
  );
}
