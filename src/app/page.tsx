import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Art } from '@/components/Art';
import * as art from '@/data/art';
import { Photo } from '@/components/Photo';
import { PupBuddy } from '@/components/PupBuddy';
import { Stars } from '@/components/Stars';
import { ChatJourney } from '@/components/home/ChatJourney';
import { HeroLineup } from '@/components/home/HeroLineup';
import { MeetTreadmill } from '@/components/home/MeetTreadmill';
import { PhotoWall } from '@/components/home/PhotoWall';
import { available, faqs, families, showroom, toCard } from '@/lib/data';
import { TESTIMONIAL, WHATSAPP_HREF } from '@/lib/site';

const sky = (top: string, bottom: string) => ({ '--sky-top': top, '--sky-bottom': bottom }) as CSSProperties;

const TRUST = [
  { title: 'Vet-checked & healthy', text: 'Every puppy comes vaccinated, dewormed, and with a verified health certificate.', ink: '#a24a1a', tilt: '-8deg', kind: 'round', icon: art.stamp0 },
  { title: 'Korea to Dubai, safely', text: 'Trusted breeders, safe travel, and premium care from start to finish.', ink: '#1f6b45', tilt: '5deg', kind: 'ticket', icon: art.stamp1 },
  { title: 'Support 24/7', text: 'Always here to help, from choosing your puppy to post-delivery support.', ink: '#5a3a28', tilt: '-4deg', kind: 'oval', icon: art.stamp2 },
  { title: 'Trusted by families worldwide', text: 'Puppies delivered to loving homes all around the world.', ink: '#c2622b', tilt: '7deg', kind: 'scallop', icon: art.stamp3 },
];

export default function HomePage() {
  const cards = available.map(toCard);
  const max = available[0];
  const wallPhotos = [...families.filter((f) => f.caption), ...families.filter((f) => !f.caption)];

  return (
    <div data-page="home" className="tp-page">
      <div data-section="hero">
        <section
          data-pup-scene="true"
          data-tone="light"
          className="tp-scene tp-hero"
          style={{ ...sky('#fffdf8', '#fff1d8'), '--quilt': '#fff1d8' } as CSSProperties}
          aria-labelledby="hero-title"
        >
          <span aria-hidden="true" className="tp-hero__sun" />
          <div className="tp-hero__copy gutter">
            <p className="tp-hero__note font-scrawl">
              every puppy is family
              <Art svg={art.heroNote} />
            </p>
            <h1 id="hero-title" className="tp-hero__title font-plush">
              <span className="tp-hero__line">Premium teacup</span>
              <span className="tp-hero__line tp-hero__line--2">puppies in Dubai</span>
            </h1>
            <p className="tp-hero__lede">
              Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
            </p>
            <div className="tp-hero__actions">
              <Link className="btn btn-primary" href="/puppies">
                View available puppies
              </Link>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Enquire on WhatsApp
              </a>
            </div>
          </div>
          <div className="tp-hero__stage">
            <HeroLineup friends={cards} />
            <PupBuddy stop pose="peek" act="peekaboo" behind lane className="tp-hero__teddy" />
            <div aria-hidden="true" className="tp-quilt">
              <Art svg={art.quilt} />
            </div>
          </div>
        </section>
      </div>

      <div data-section="meet">
        <MeetTreadmill puppies={cards} />
      </div>

      <div data-section="paths">
        <section data-pup-scene="true" data-tone="light" className="tp-scene tp-paths" style={sky('#fbe3b4', '#f7d18d')} aria-labelledby="paths-title">
          <div className="gutter mx-auto max-w-[110rem]">
            <h2 id="paths-title" className="tp-paths__title font-plush text-huge">
              Two ways to meet your puppy
            </h2>
            <div className="tp-fork">
              <div aria-hidden="true" className="tp-fork__post" />
              <article className="tp-way tp-way--left" aria-labelledby="way-local">
                <h3 id="way-local" className="tp-sign tp-sign--left font-plush">
                  Puppies in Dubai
                </h3>
                <div className="tp-way__scene" data-pup-look="true">
                  <Art svg={art.skyline} />
                  <figure className="tp-window">
                    <span className="tp-window__glass">
                      <Photo media={showroom[0]} sizes="(min-width: 1024px) 16rem, 60vw" />
                    </span>
                    <figcaption className="font-scrawl">In our showroom</figcaption>
                  </figure>
                </div>
                <p className="tp-way__text">See them, love them, take them home. Come meet our locally available puppies before you decide.</p>
                <Link className="btn btn-primary" href="/puppies?origin=local">
                  Meet local puppies
                </Link>
              </article>
              <article className="tp-way tp-way--right" aria-labelledby="way-imported">
                <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">
                  Imported for you
                </h3>
                <div className="tp-way__scene" data-pup-look="true">
                  <div className="tp-flight">
                    <Art svg={art.flight} />
                  </div>
                </div>
                <p className="tp-way__text">
                  Exclusive Korean teacup puppies, delivered. Order from the world&apos;s most reputable breeders and let us handle the import.
                </p>
                <Link className="btn btn-primary" href="/puppies?origin=imported">
                  See imported puppies
                </Link>
              </article>
              <PupBuddy stop className="tp-fork__teddy" />
            </div>
          </div>
        </section>
      </div>

      <div data-section="journey">
        <ChatJourney showroom={showroom} />
      </div>

      <div data-section="trust">
        <section data-pup-scene="true" data-tone="light" className="tp-scene tp-passport" style={sky('#f0b866', '#a65a30')} aria-labelledby="trust-title">
          <div className="gutter mx-auto max-w-[96rem]">
            <div className="tp-book">
              <div className="tp-book__page tp-book__page--left">
                <p aria-hidden="true" className="tp-book__kicker font-scrawl">
                  puppy passport
                </p>
                <h2 id="trust-title" className="font-plush tp-book__title">
                  Why families trust TeddyPups
                </h2>
                <PupBuddy stop className="tp-book__teddy" />
              </div>
              <ul className="tp-book__page tp-book__page--right">
                {TRUST.map((item, i) => (
                  <li key={item.title} className="tp-entry" style={{ '--ink-stamp': item.ink, '--tilt': item.tilt, '--i': i } as CSSProperties}>
                    <span className={`tp-stamp tp-stamp--${item.kind}`}>
                      <Art svg={item.icon} />
                      <span className="tp-stamp__title font-plush">{item.title}</span>
                    </span>
                    <p className="tp-entry__text">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div aria-hidden="true" className="tp-horizon">
            <span className="tp-horizon__sun" />
            <Art svg={art.horizonCity} />
          </div>
        </section>
      </div>

      <div data-section="families">
        <section data-pup-scene="true" data-tone="dark" className="tp-scene tp-dusk" style={sky('#a65a30', '#4d2b19')} aria-labelledby="dusk-title">
          <div className="tp-dusk__sky gutter">
            <div className="tp-dusk__head">
              <h2 id="dusk-title" className="font-plush text-huge">
                Happy families &amp; puppies
              </h2>
              <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
                We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by
                our valued clients who welcomed a Teddy Pup into their homes and hearts.
              </p>
            </div>
            <figure className="tp-dusk__note">
              <blockquote className="font-plush-text">“{TESTIMONIAL.quote}”</blockquote>
              <figcaption className="font-scrawl">
                {TESTIMONIAL.author}, {TESTIMONIAL.place}
              </figcaption>
            </figure>
          </div>
          <PhotoWall photos={wallPhotos} />
        </section>
      </div>

      <div data-section="questions">
        <section data-pup-scene="true" data-tone="dark" className="tp-scene tp-night" style={sky('#4d2b19', '#2f1a10')} aria-labelledby="questions-title">
          <div className="tp-night__stars">
            <Stars />
          </div>
          <div className="tp-night__grid gutter">
            <div className="tp-night__intro">
              <h2 id="questions-title" className="font-plush text-huge">
                Questions, answered
              </h2>
              <Link className="btn btn-ghost tp-night__cta" href="/faq">
                Read all questions
              </Link>
              <div className="tp-night__pup">
                <span aria-hidden="true" className="tp-night__wonder font-plush">
                  ?
                </span>
                <PupBuddy stop act="tilt" className="tp-night__teddy" />
              </div>
            </div>
            <dl className="tp-night__list">
              {faqs.slice(0, 3).map((faq) => (
                <div key={faq.q} className="tp-qa">
                  <dt className="font-plush tp-qa__q">
                    <Art svg={art.qaStar} />
                    {faq.q}
                  </dt>
                  <dd className="tp-qa__a">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>

      <div data-section="cta">
        <section data-pup-scene="true" data-tone="dark" className="tp-scene tp-home" style={sky('#2f1a10', '#24130b')} aria-labelledby="cta-title">
          <div className="tp-home__copy gutter">
            <h2 id="cta-title" className="font-plush text-huge">
              Ready to meet your new best friend?
            </h2>
            <p className="tp-home__lede">
              Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and
              ensure a smooth, safe delivery across the UAE.
            </p>
          </div>
          <div className="tp-house">
            <span aria-hidden="true" className="tp-house__plant tp-house__plant--left" />
            <span aria-hidden="true" className="tp-house__lamp" />
            <div className="tp-house__doorway">
              <span className="tp-house__inside">
                <Photo media={max.cover} sizes="16rem" alt={`${max.displayName}, waiting inside`} />
              </span>
              <span aria-hidden="true" className="tp-house__door">
                <span className="tp-house__peep" />
                <span className="tp-house__knob" />
              </span>
            </div>
            <span aria-hidden="true" className="tp-house__plant tp-house__plant--right" />
            <span aria-hidden="true" className="tp-house__mat font-scrawl">
              welcome home
            </span>
            <PupBuddy stop pose="bow" className="tp-house__teddy" />
          </div>
          <div className="tp-home__actions gutter">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              Enquire on WhatsApp
            </a>
            <Link className="btn btn-ghost tp-home__ghost" href="/contact">
              Visit &amp; contact
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
