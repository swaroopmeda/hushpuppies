'use client';

import { Fragment, useId, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Art } from '@/components/Art';
import { PupBuddy } from '@/components/PupBuddy';
import { lens } from '@/data/art';
import type { Faq } from '@/lib/data';

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

export function NoticeBoard({ faqs, askHref }: { faqs: Faq[]; askHref: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const inputId = useId();
  const needle = query.trim().toLowerCase();
  const shown = useMemo(() => (needle ? faqs.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(needle)) : faqs), [faqs, needle]);

  return (
    <div className="tp-notes" data-open={open || needle ? '' : undefined}>
      <aside className="tp-notes__side" aria-label="Find a question">
        <label htmlFor={inputId} className="font-scrawl tp-notes__label">
          sniff out a question
        </label>
        <div className="tp-notes__search">
          <Art svg={lens} />
          <input id={inputId} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="delivery, Korea, vaccinated…" autoComplete="off" />
        </div>
        <p className="tp-notes__count" aria-live="polite">
          {query.trim() ? `${shown.length} ${shown.length === 1 ? 'note' : 'notes'} found` : `${faqs.length} notes on the board`}
        </p>
        <div className="tp-notes__teddy">
          <span aria-hidden="true" className="tp-notes__bubble font-plush">
            <span className="tp-notes__q">?</span>
            <span className="tp-notes__a">!</span>
          </span>
          <PupBuddy />
        </div>
        <a href={askHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-notes__ask">
          Ask your own question
        </a>
      </aside>
      <div className="tp-notes__board">
        <ul className="tp-notes__list">
          {shown.map((faq, i) => {
            const unfolded = open === faq.q || !!needle;
            const key = `faq-${faqs.indexOf(faq)}`;
            return (
              <li
                key={faq.q}
                className="tp-note"
                data-reveal="true"
                data-unfolded={unfolded || undefined}
                style={{ '--tilt': faq.tilt, '--pin': faq.pin, '--i': i } as CSSProperties}
              >
                <span aria-hidden="true" className="tp-note__pin" />
                <h2 className="tp-note__q">
                  <button type="button" id={`q-${key}`} aria-expanded={unfolded} aria-controls={`a-${key}`} onClick={() => setOpen(open === faq.q ? null : faq.q)}>
                    <span className="font-plush-text">
                      <Highlight text={faq.q} query={query} />
                    </span>
                    <span aria-hidden="true" className="tp-note__chevron" />
                  </button>
                </h2>
                <div id={`a-${key}`} role="region" aria-labelledby={`q-${key}`} className="tp-note__answer" inert={!unfolded}>
                  <div className="tp-note__flap">
                    <p>
                      <Highlight text={faq.a} query={query} />
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
          {!shown.length && (
            <li className="tp-note tp-note--empty" data-revealed="true">
              <p className="p-6">
                Teddy couldn&apos;t sniff that one out. Try another word, or ask us on WhatsApp.
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
