import Image from 'next/image';
import Link from 'next/link';
import { Art } from '@/components/Art';
import * as art from '@/data/art';
import { PupBuddy } from '@/components/PupBuddy';
import { Stars } from '@/components/Stars';
import { ADDRESS, EMAIL, FOOTER_LINKS, PHONE, SOCIALS, WHATSAPP_HREF } from '@/lib/site';

export function Footer() {
  return (
    <footer className="tp-footer relative pb-[calc(var(--bar-h)+2rem)] text-milk md:pb-10">
      <Art svg={art.footerHill} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 h-64 overflow-hidden">
        <Stars />
        <span className="tp-moon" />
      </div>
      <div className="gutter relative mx-auto grid max-w-[110rem] gap-12 pt-20 md:grid-cols-12 md:gap-x-12 md:gap-y-6 md:pt-28">
        <div className="md:col-span-5">
          <p className="font-plush text-big text-honey-soft">Home, at last.</p>
          <p className="mt-5 max-w-md text-milk/80">
            TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.
          </p>
        </div>
        <div className="order-last md:order-none md:col-span-5 md:col-start-1 md:row-start-2">
          <div className="tp-basket">
            <Art svg={art.basketBack} />
            <PupBuddy pose="snug" stop act="basket" behind lane className="tp-basket__pup" />
            <Art svg={art.basketFront} />
          </div>
        </div>
        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Say hello</h2>
          <ul className="mt-4 space-y-2.5 text-milk/90">
            <li>
              <a className="font-semibold hover:text-honey" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                WhatsApp {PHONE}
              </a>
            </li>
            <li>
              <a className="break-all hover:text-honey" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </li>
            <li>{ADDRESS}</li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-3" aria-label="Social media">
            {SOCIALS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="gutter relative mx-auto mt-16 flex max-w-[110rem] flex-col items-start justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/60 md:flex-row md:items-center">
        <span className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="" width={36} height={36} className="size-9" />© {new Date().getFullYear()} TeddyPups U.A.E.
        </span>
        <span className="font-scrawl text-base text-honey/80">every puppy is family</span>
      </div>
    </footer>
  );
}
