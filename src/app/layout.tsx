import type { Metadata, Viewport } from 'next';
import { Figtree, Fraunces, Shantell_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Curtain } from '@/components/shell/Curtain';
import { Footer } from '@/components/shell/Footer';
import { Header } from '@/components/shell/Header';
import { PawTrail } from '@/components/shell/PawTrail';
import { PupJourney } from '@/components/shell/PupJourney';
import { Reveal } from '@/components/shell/Reveal';
import { SmoothScroll } from '@/components/shell/SmoothScroll';
import { WhatsAppBar } from '@/components/shell/WhatsAppBar';
import { SITE_URL } from '@/lib/site';
import '@/styles/globals.css';

const fraunces = Fraunces({ subsets: ['latin'], axes: ['SOFT', 'WONK', 'opsz'], variable: '--font-fraunces' });
const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree' });
const shantell = Shantell_Sans({ subsets: ['latin'], axes: ['BNCE', 'INFM'], variable: '--font-shantell' });

const description =
  'Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'TeddyPups U.A.E. — Premium teacup puppies in Dubai', template: '%s | TeddyPups U.A.E.' },
  description,
  // This is a portfolio clone, so it stays out of search results for the real business.
  robots: { index: false, follow: false },
  openGraph: { title: 'TeddyPups U.A.E.', description, images: ['/brand/logo.png'] },
};

export const viewport: Viewport = { themeColor: '#fffdf8', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable} ${shantell.variable}`}>
      <body>
        <Curtain />
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
          <Reveal>{children}</Reveal>
          <PupJourney />
        </main>
        <Footer />
        <WhatsAppBar />
        <PawTrail />
        <SmoothScroll />
      </body>
    </html>
  );
}
