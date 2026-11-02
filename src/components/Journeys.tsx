'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Art } from '@/components/Art';
import { PupBuddy } from '@/components/PupBuddy';
import * as art from '@/data/art';

const TINTS = ['#fbe3b4', '#fde6de', '#e3f0fb', '#e6f2df'];

const JOURNEYS = [
  {
    key: 'local',
    label: 'In Dubai',
    hint: 'meet in person',
    heading: 'Meet your puppy in person',
    body: "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks.",
    note: undefined,
    icons: [art.step0, art.step1, art.step2, art.step3],
    steps: [
      { title: 'Explore our puppies', text: 'Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information.' },
      { title: 'Choose your puppy', text: 'Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions.' },
      { title: 'Meet before you choose', text: 'Spend time bonding before making your decision.' },
      { title: 'Pick-up or delivery', text: 'Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably.' },
    ],
  },
  {
    key: 'imported',
    label: 'Imported',
    hint: 'order upon request',
    heading: 'Order upon request',
    body: "Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world's most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond.",
    note: "From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world's finest puppies to Dubai, just for you.",
    icons: [art.step4, art.step5, art.step6, art.step7],
    steps: [
      { title: 'Reserve your puppy', text: 'Browse our selection of available breeds and place a reservation for the teacup puppy that captures your heart. Our reservation-only model ensures that each puppy is specifically sourced to meet your preferences.' },
      { title: 'Personalized consultation', text: "Once your reservation is confirmed, we will work closely with you to finalize details and provide updates on your puppy's journey." },
      { title: 'Import and arrival', text: 'We manage all aspects of the import process, including health checks, travel arrangements, and necessary documentation. Your puppy will be carefully transported and will arrive ready to join your family.' },
      { title: 'Welcome home', text: 'Upon arrival, we provide support to help your new puppy acclimate to their new environment. Our team is available for any additional assistance and to ensure a smooth transition into your home.' },
    ],
  },
];

function Postcard({ imported }: { imported: boolean }) {
  if (imported) {
    return (
      <div aria-hidden="true" className="tp-postcard tp-postcard--sky">
        <Art svg={art.postcardRoute} />
        <Art svg={art.postcardPlane} />
        <span className="font-scrawl tp-postcard__from">Europe · Korea</span>
        <span className="font-scrawl tp-postcard__to">Dubai</span>
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="tp-postcard">
      <span className="tp-postcard__sun" />
      <Art svg={art.postcardCity} />
      <span className="font-scrawl tp-postcard__to tp-postcard__to--left">Downtown Dubai</span>
    </div>
  );
}

// Both panels are server rendered, then the switch hides one after hydration.
export function Journeys() {
  const [active, setActive] = useState(JOURNEYS[0].key);
  const [ready, setReady] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => setReady(true), []);

  const at = JOURNEYS.findIndex((j) => j.key === active);
  const move = (i: number) => {
    const next = (i + JOURNEYS.length) % JOURNEYS.length;
    setActive(JOURNEYS[next].key);
    tabs.current[next]?.focus();
  };

  return (
    <section className="tp-journeys" aria-labelledby="two-ways-title" data-ready={ready || undefined}>
      <div className="tp-journeys__top">
        <div>
          <p className="font-scrawl tp-journeys__kicker">choose your way</p>
          <h2 id="two-ways-title" className="font-plush text-big">
            Two ways home
          </h2>
        </div>
        <div className="tp-journeys__pick">
          <div role="tablist" aria-label="Ways to bring your puppy home" className="tp-switch" style={{ '--at': at, '--n': JOURNEYS.length } as CSSProperties}>
            <span aria-hidden="true" className="tp-switch__thumb" />
            {JOURNEYS.map((j, i) => (
              <button
                key={j.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${j.key}`}
                aria-selected={active === j.key}
                aria-controls={`panel-${j.key}`}
                tabIndex={active === j.key ? 0 : -1}
                onClick={() => setActive(j.key)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') move(i + 1);
                  if (e.key === 'ArrowLeft') move(i - 1);
                }}
                className="tp-switch__tab"
              >
                <span className="font-plush tp-switch__label">{j.label}</span>
                <span className="tp-switch__hint">{j.hint}</span>
              </button>
            ))}
          </div>
          <PupBuddy className="tp-journeys__teddy" label="Teddy, waiting to see which way you pick" />
        </div>
      </div>
      {JOURNEYS.map((j) => (
        <div key={j.key} role="tabpanel" id={`panel-${j.key}`} aria-labelledby={`tab-${j.key}`} hidden={ready && active !== j.key} className="tp-journey">
          <div className="tp-journey__head">
            <div>
              <h3 className="font-plush tp-journey__title">{j.heading}</h3>
              <p className="text-lede mt-4 text-[var(--ink-soft)]">{j.body}</p>
              {j.note && <p className="font-scrawl mt-4 text-toffee-ink">{j.note}</p>}
            </div>
            <Postcard imported={j.key === 'imported'} />
          </div>
          <ol className="tp-steps">
            {j.steps.map((s, i) => (
              <li key={s.title} className="tp-step" style={{ '--i': i, '--tint': TINTS[i] } as CSSProperties}>
                <span aria-hidden="true" className="tp-step__icon">
                  <Art svg={j.icons[i]} />
                </span>
                <span className="tp-step__num font-plush">Step {i + 1}</span>
                <h4 className="font-plush-text tp-step__title">{s.title}</h4>
                <p className="tp-step__text">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
