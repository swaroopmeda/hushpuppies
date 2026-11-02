'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { PupBuddy } from '@/components/PupBuddy';
import type { PuppyCardData } from '@/lib/data';
import { PuppySketch } from './PuppySketch';

type FilterKey = 'origin' | 'breed' | 'gender' | 'collection';
const KEYS: FilterKey[] = ['origin', 'breed', 'gender', 'collection'];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="tp-sticker-chip">
      {children}
    </button>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{label}</span>
      {children}
    </div>
  );
}

export function PuppyGrid({ puppies }: { puppies: PuppyCardData[] }) {
  return (
    <ul className="tp-sketches mt-8">
      {puppies.map((p, i) => (
        <li key={p.slug}>
          <PuppySketch pup={p} index={i} eager={i < 3} />
        </li>
      ))}
    </ul>
  );
}

// Filters live in the URL, so a filtered list can be shared or linked to.
export function PuppyBrowser({ puppies, askHref }: { puppies: PuppyCardData[]; askHref: string }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const active = {
    origin: params.get('origin') ?? '',
    breed: params.get('breed') ?? '',
    gender: params.get('gender') ?? '',
    collection: params.get('collection') ?? '',
  };

  const toggle = (key: FilterKey, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (active[key] === value) next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    window.history.replaceState(null, '', query ? `${pathname}?${query}` : pathname);
  };
  const clear = () => window.history.replaceState(null, '', pathname);

  const matches = useMemo(
    () =>
      puppies.filter(
        (p) =>
          (!active.origin || p.origin?.slug === active.origin) &&
          (!active.breed || p.breeds.some((b) => b.slug === active.breed)) &&
          (!active.gender || p.gender === active.gender || p.gender === 'male-female') &&
          (!active.collection || p.collections.some((c) => c.slug === active.collection)),
      ),
    [puppies, active.origin, active.breed, active.gender, active.collection],
  );

  const filtering = KEYS.some((k) => active[k]);
  const breeds = [...new Map(puppies.flatMap((p) => p.breeds).map((b) => [b.slug, b])).values()];
  const hasKorean = puppies.some((p) => p.collections.some((c) => c.slug === 'korean-teacup'));
  const hasLocal = puppies.some((p) => p.origin?.slug === 'local');

  return (
    <div>
      <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
        <Row label="where">
          <Chip active={!active.origin && !active.collection} onClick={clear}>
            Everywhere
          </Chip>
          {hasLocal && (
            <Chip active={active.origin === 'local'} onClick={() => toggle('origin', 'local')}>
              In Dubai
            </Chip>
          )}
          <Chip active={active.origin === 'imported'} onClick={() => toggle('origin', 'imported')}>
            Imported
          </Chip>
          {hasKorean && (
            <Chip active={active.collection === 'korean-teacup'} onClick={() => toggle('collection', 'korean-teacup')}>
              Korean Teacup
            </Chip>
          )}
        </Row>
        <Row label="breed">
          {breeds.map((b) => (
            <Chip key={b.slug} active={active.breed === b.slug} onClick={() => toggle('breed', b.slug)}>
              {b.name}
            </Chip>
          ))}
        </Row>
        <Row label="boy or girl">
          <Chip active={active.gender === 'male'} onClick={() => toggle('gender', 'male')}>
            Boys
          </Chip>
          <Chip active={active.gender === 'female'} onClick={() => toggle('gender', 'female')}>
            Girls
          </Chip>
          {filtering && (
            <button type="button" onClick={clear} className="link-ink ml-auto text-[0.95rem] font-semibold">
              Clear filters
            </button>
          )}
        </Row>
      </div>
      <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
        {matches.length === 1 ? '1 puppy' : `${matches.length} puppies`} {filtering ? 'match' : 'looking for a home'}
      </p>
      {matches.length ? (
        <PuppyGrid puppies={matches} />
      ) : (
        <div className="tp-sketchpad mt-10 grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
          <PupBuddy className="mx-auto w-44 md:w-52" label="Teddy, tilting his head" />
          <div>
            <p className="font-plush text-big">No puppies match just now.</p>
            <p className="mt-3 max-w-[48ch] text-cocoa-soft">
              Tell us what you&apos;re hoping for and we&apos;ll let you know what&apos;s in our showroom or what we can bring in for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={askHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                Ask on WhatsApp
              </a>
              <button type="button" onClick={clear} className="btn btn-ghost">
                Show all puppies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
