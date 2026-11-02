'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Art } from '@/components/Art';
import * as art from '@/data/art';
import { Photo } from '@/components/Photo';
import { PupBuddy } from '@/components/PupBuddy';
import type { Media } from '@/lib/data';
import { prefersReducedMotion } from '@/lib/motion';
import { WHATSAPP_HREF } from '@/lib/site';

const STEPS = [
  { title: 'Choose your breed', text: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle." },
  { title: 'Get photos & details', text: 'Our team will share real photos, health details, and all necessary information directly on WhatsApp.' },
  { title: 'Secure & safe delivery', text: 'Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.' },
];

const BREEDS = [
  { slug: 'maltipoo', name: 'Maltipoo' },
  { slug: 'pomeranian', name: 'Pomeranian' },
  { slug: 'poodle', name: 'Poodle' },
  { slug: 'cavapoo', name: 'Cavapoo' },
  { slug: 'shih-tzu', name: 'Shih Tzu' },
];

function Clip({ media }: { media: Media }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const el = video.current!;
    if (el.paused) el.play().then(() => setPlaying(true)).catch(() => {});
    else {
      el.pause();
      setPlaying(false);
    }
  };
  return (
    <div className="tp-msg tp-msg--them tp-msg--media">
      <div className="tp-clip">
        <video ref={video} src={media.url} poster={media.poster?.url} muted loop playsInline preload="none" aria-label={media.alt} />
        <button type="button" className="tp-clip__play" onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause video' : 'Play video'}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={playing ? 'M7 5h3v14H7zM14 5h3v14h-3z' : 'M8 5v14l11-7z'} />
          </svg>
        </button>
      </div>
    </div>
  );
}

// The steps double as a scroll trigger that plays the WhatsApp conversation.
export function ChatJourney({ showroom }: { showroom: Media[] }) {
  const [wide, setWide] = useState(false);
  const [step, setStep] = useState(-1);
  const [typing, setTyping] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const previous = useRef(-1);
  const current = wide ? step : STEPS.length - 1;

  useEffect(() => {
    setWide(matchMedia('(min-width: 1024px)').matches && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!wide) return;
    const items = [...list.current!.children];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStep(items.indexOf(e.target))),
      { rootMargin: '-28% 0px -62% 0px' },
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, [wide]);

  useEffect(() => {
    if (!wide) return;
    const forward = step > previous.current;
    previous.current = step;
    if (!forward || step < 0) return;
    setTyping(true);
    const timer = setTimeout(() => setTyping(false), 750);
    return () => clearTimeout(timer);
  }, [step, wide]);

  const shown = (i: number) => current >= i && !(typing && i === current);

  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-chat"
      style={{ '--sky-top': '#f7d18d', '--sky-bottom': '#f0b866' } as CSSProperties}
      aria-labelledby="journey-title"
    >
      <div className="tp-chat__grid gutter" data-pin-range="true">
        <div className="tp-chat__story">
          <h2 id="journey-title" className="font-plush text-huge">
            Your puppy journey
          </h2>
          <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">
            A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
          </p>
          <ol ref={list} className="tp-chat__steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="tp-chat__step" data-active={i === current || undefined} data-done={i < current || undefined}>
                <span className="tp-chat__num font-plush" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="font-plush tp-chat__title">{s.title}</h3>
                <p className="tp-chat__text">{s.text}</p>
              </li>
            ))}
          </ol>
          <Link className="btn btn-ghost tp-chat__cta" href="/how-it-works">
            How it works
          </Link>
        </div>
        <div className="tp-chat__side">
          <div className="tp-phone" aria-label="A WhatsApp conversation with TeddyPups U.A.E." role="group">
            <div className="tp-phone__bar">
              <Image src="/brand/logo.png" alt="" width={40} height={40} className="tp-phone__avatar" />
              <span>
                <span className="tp-phone__name">TeddyPups U.A.E.</span>
                <span className="tp-phone__status">online</span>
              </span>
            </div>
            <div className="tp-phone__screen">
              <p className="tp-msg tp-msg--me">Hi TeddyPups! I&apos;d love to know more about your puppies.</p>
              <div className="tp-msg-group" data-step="0" data-show={shown(0)}>
                <div className="tp-msg tp-msg--them">
                  <p>{STEPS[0].text}</p>
                  <ul className="tp-chips" aria-label="Breeds we have now">
                    {BREEDS.map((b) => (
                      <li key={b.slug}>
                        <Link href={`/puppies?breed=${b.slug}`}>{b.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="tp-msg-group" data-step="1" data-show={shown(1)}>
                <div className="tp-msg tp-msg--them tp-msg--media">
                  <div className="tp-snaps">
                    {showroom
                      .filter((m) => m.kind === 'image')
                      .map((m) => (
                        <span key={m.url} className="tp-snaps__one">
                          <Photo media={m} sizes="9rem" />
                        </span>
                      ))}
                  </div>
                </div>
                <Clip media={showroom.find((m) => m.kind === 'video')!} />
                <p className="tp-msg tp-msg--them">{STEPS[1].text}</p>
              </div>
              <div className="tp-msg-group" data-step="2" data-show={shown(2)}>
                <div className="tp-msg tp-msg--them">
                  <p>{STEPS[2].text}</p>
                  <Art svg={art.route} />
                </div>
              </div>
              <p className="tp-typing" data-show={typing} aria-hidden="true">
                <span />
                <span />
                <span />
              </p>
            </div>
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="tp-phone__compose">
              <span>Say hello on WhatsApp</span>
              <Art svg={art.compose} />
            </a>
          </div>
          <PupBuddy stop className="tp-chat__teddy" />
        </div>
      </div>
    </section>
  );
}
