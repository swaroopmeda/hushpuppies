# TeddyPups clone

A front-end clone of [puppy.instabizweb.com](https://puppy.instabizweb.com/), built as a development assignment. It covers every public page, at desktop and mobile widths, with the same design and interactions.

This is a portfolio exercise and is not affiliated with TeddyPups U.A.E. All photos, copy and branding belong to their owners. The site is set to `noindex` so it can't appear in search results for the real business.

## Stack

| Tool | Why |
| --- | --- |
| Next.js 16 (App Router) | Same framework as the reference. Pages are prerendered, so they load fast and work as plain HTML. |
| React 19 + TypeScript | Typed components. Only interactive parts are client components. |
| Tailwind CSS 4 | Utility classes for layout, with design tokens in `@theme`. |
| Lenis | Smooth scrolling. |
| next/font, next/image | Self-hosted Fraunces, Figtree and Shantell Sans; responsive images. |
| Puppeteer | Smoke test and visual comparison in real Chrome. |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production check:

```bash
npm run build
npm run start -- -p 3100
node scripts/smoke-test.mjs http://localhost:3100
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed URL so WhatsApp messages link back to the right address.

## Project structure

```
scripts/
  extract-data.mjs    Turns a crawl of the reference into src/data
  download-media.mjs  Fetches the media those files reference into public/
  port-css.mjs        Splits the reference stylesheet into readable source
  smoke-test.mjs      End-to-end checks in Chrome
src/
  app/                One folder per route, plus /api/enquiry
  components/
    shell/            Curtain, header, footer, smooth scroll, reveal, mascot
    home/             Hero lineup, door treadmill, chat, photo wall
    puppies/          Catalog filters, sketch cards, gallery
  data/               Generated: puppies, families, FAQs, SVG art
  lib/                Site constants, data access, sketch generator, validation
  styles/             Tokens (globals.css) and ported rules (components, scenes)
```

## What was rebuilt and what was reused

Being clear about this matters for an assignment.

**Written for this project:** all React components and pages, the catalog filters, the FAQ search, the lightbox, forms and validation, the route curtain, the scroll logic for the pinned treadmill and chat, the mobile lane, the paw trail, and the tooling in `scripts/`.

**Generated from the reference by script:**

- `src/styles/components.css` and `src/styles/scenes.css` are the reference's compiled custom CSS, prettified. About 95 KB of hand-tuned scene styling and keyframes would not have been practical to reproduce by eye, so it was ported. Tailwind utilities are regenerated at build time.
- `src/data/*` holds content from the reference's page payloads, plus its inline SVG art.
- `public/media` holds the reference's photos and videos.
- The walk cycle in `art.ts` is 10 frames sampled from the running page, because the original poses its mascot in JavaScript.

**Ported closely:** `src/lib/sketch.ts` restates the reference's seeded sketch generator in readable TypeScript, so each card's blob and doodles come out identical.

## Decisions worth knowing

- **Data comes from the page payload, not the DOM.** Next embeds structured props in each page, which gave focal points, blur placeholders and dimensions that scraping HTML would have lost. Gone-home puppies are not in the listing payload, so they are rebuilt from their own pages.
- **The art is split into named exports.** A single JSON file would have put 270 KB of SVG into every client bundle. Named exports let the bundler drop what a component does not use.
- **The mascot is much simpler than the original.** The reference plans hold ranges and curved paths ahead of time. This version reads stop positions live each frame and hands over at scene boundaries, which is far less code and handles pinned sections for free. The trade-off is that its path is less fluid, and it has no speech bubbles or cursor following.
- **Filters live in the URL,** so a filtered list can be linked to, and the homepage breed chips deep-link into it.

## Known differences from the reference

- Enquiry forms validate and confirm, but nothing is stored or sent. The original saves to a server-side action. See `src/app/api/enquiry/route.ts`.
- There is no admin area.
- The mascot does not say anything, follow the cursor, or play its idle animations, and it leaves no paw prints of its own.
- The paw trail behind the cursor is a simpler drawing than the original.
- The curtain covers link clicks but not the browser's back and forward buttons.
- WhatsApp, phone and email links still point to the real business, as they do on the reference.

## Testing

- `scripts/smoke-test.mjs` runs 31 checks in Chrome: filters, FAQ search, tabs, lightbox, forms, API validation, navigation, mobile menu and the 404 page.
- Screenshots were compared side by side with the reference at 1440px and 390px.
- Page heights match the reference exactly at both widths on all 8 main page types, with no horizontal overflow and no console errors.

`scripts/extract-data.mjs` and `scripts/port-css.mjs` need a local crawl of the reference, which is not in this repo. Their output is committed, so they are only needed to refresh the content.
