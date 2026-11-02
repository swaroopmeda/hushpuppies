'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Art } from '@/components/Art';
import * as art from '@/data/art';
import { NAV_LINKS, PHONE, WHATSAPP_HREF } from '@/lib/site';

const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 140);
        last = y;
      }
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => {
    const dialog = menu.current;
    if (!dialog?.open) return;
    dialog.dataset.closing = '';
    window.setTimeout(() => {
      delete dialog.dataset.closing;
      dialog.close();
    }, 240);
  };

  useEffect(closeMenu, [pathname]);

  return (
    <header
      id="site-header"
      data-scrolled={scrolled}
      data-hidden={hidden}
      data-home={pathname === '/' || undefined}
      className="tp-header fixed inset-x-0 top-0 z-50"
    >
      <div className="tp-header__bar gutter">
        <Link href="/" className="tp-header__brand" aria-label="TeddyPups U.A.E. — home">
          <Image src="/brand/logo.png" alt="" width={56} height={56} priority className="tp-header__logo" />
          <span className="font-plush tp-header__name">TeddyPups</span>
        </Link>
        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link href={href} className="tp-nav-link" data-active={active} aria-current={active ? 'page' : undefined}>
                    <span>{label}</span>
                    <Art svg={art.pawNav} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="tp-header__end">
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-header__wa">
            WhatsApp us
          </a>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden"
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
          >
            <svg viewBox="0 0 20 14" className="w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M2 2h16M2 7h16M2 12h16" />
            </svg>
            Menu
          </button>
          <dialog
            ref={menu}
            aria-label="Site menu"
            className="tp-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
          >
            <div className="flex h-full flex-col gutter pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-center justify-between">
                <span className="font-scrawl text-lg">where to, friend?</span>
                <button type="button" onClick={closeMenu} className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk">
                  Close
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-10 flex-1">
                <ul className="space-y-1">
                  {NAV_LINKS.map(({ href, label }) => {
                    const active = isActive(pathname, href);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={closeMenu}
                          data-active={active}
                          aria-current={active ? 'page' : undefined}
                          className="tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]"
                        >
                          <span>{label}</span>
                          <Art svg={art.pawNav} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="space-y-3">
                <a href={WHATSAPP_HREF} className="btn btn-whatsapp w-full" target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
                <p className="text-center text-sm font-medium">{PHONE}</p>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      <Art svg={art.headerHem} />
    </header>
  );
}
