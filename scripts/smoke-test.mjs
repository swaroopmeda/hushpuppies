// End-to-end smoke test in real Chrome. Start the app, then:
//   node scripts/smoke-test.mjs http://localhost:3100
// Needs puppeteer-core (npm i -D puppeteer-core) and a local Chrome.
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
const results = [];
const check = (name, ok, detail = '') => {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

async function open(path, width = 1440, height = 900) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: width < 500, hasTouch: width < 500 });
  await page.goto(BASE + path, { waitUntil: 'networkidle2' });
  await sleep(1300);
  return page;
}
const text = (page, sel) => page.$eval(sel, (el) => el.textContent.trim());
const count = (page, sel) => page.$$eval(sel, (els) => els.length);
const clickText = (page, sel, label) =>
  page.evaluate(
    (s, l) => {
      const el = [...document.querySelectorAll(s)].find((e) => e.textContent.trim() === l);
      if (!el) throw new Error(`No ${s} "${l}"`);
      el.click();
    },
    sel,
    label,
  );

// Catalog filters
{
  const page = await open('/puppies');
  check('catalog lists 15 puppies', (await count(page, '.tp-sketches .tp-sketch')) === 15);
  await clickText(page, '.tp-sticker-chip', 'Pomeranian');
  await sleep(300);
  check('breed filter narrows the list', (await count(page, '.tp-sketches .tp-sketch')) === 4, await text(page, '[aria-live=polite]'));
  check('filter is written to the URL', page.url().includes('breed=pomeranian'), page.url());
  await clickText(page, '.tp-sticker-chip', 'Boys');
  await sleep(300);
  check('filters combine', (await count(page, '.tp-sketches .tp-sketch')) === 1);
  await clickText(page, 'button', 'Clear filters');
  await sleep(300);
  check('clear restores every puppy', (await count(page, '.tp-sketches .tp-sketch')) === 15);
  await page.close();

  const deep = await open('/puppies?origin=local');
  check('empty state shows for a filter with no match', (await text(deep, '[aria-live=polite]')).startsWith('0 puppies'));
  check('empty state offers WhatsApp', (await deep.$$eval('a', (a) => a.some((x) => x.textContent === 'Ask on WhatsApp'))));
  await deep.close();
}

// FAQ
{
  const page = await open('/faq');
  check('FAQ shows 9 notes', (await count(page, '.tp-note')) === 9);
  await page.click('.tp-note__q button');
  await sleep(200);
  check('a note unfolds on click', (await count(page, '.tp-note[data-unfolded]')) === 1);
  await page.type('input[type=search]', 'korea');
  await sleep(300);
  const notes = await count(page, '.tp-note');
  check('search filters notes', notes > 0 && notes < 9, await text(page, '.tp-notes__count'));
  check('search highlights matches', (await count(page, 'mark')) > 0);
  await page.close();
}

// How it works tabs
{
  const page = await open('/how-it-works');
  await page.click('#tab-imported');
  await sleep(200);
  const hidden = await page.$eval('#panel-local', (el) => el.hidden);
  const shown = await page.$eval('#panel-imported', (el) => !el.hidden);
  check('tabs swap the journey panel', hidden && shown);
  await page.close();
}

// Photo viewer + gallery
{
  const page = await open('/happy-families');
  check('wall shows 64 photos', (await count(page, '.tp-wall__item')) === 64);
  await page.click('.tp-wall__print');
  await sleep(400);
  check('lightbox opens', await page.$eval('dialog[aria-label="Photo viewer"]', (d) => d.open));
  await page.keyboard.press('ArrowRight');
  await sleep(200);
  check('arrow key moves to next photo', (await page.$eval('dialog[aria-label="Photo viewer"]', (d) => d.textContent)).includes('2 / 64'));
  await page.keyboard.press('Escape');
  await sleep(200);
  check('Escape closes lightbox', !(await page.$eval('dialog[aria-label="Photo viewer"]', (d) => d.open)));
  await page.close();

  const pup = await open('/puppies/maltipoo-max-male');
  check('detail page shows the puppy', (await text(pup, 'h1')) === 'Max');
  await pup.click('[aria-label="Next photo"]');
  await sleep(200);
  check('gallery advances to the video', (await pup.$eval('.tp-storypage', (e) => e.textContent)).includes('2 / 2'));
  check('WhatsApp link names the puppy', decodeURIComponent(await pup.$eval('.tp-tag .btn-whatsapp', (a) => a.href)).includes('interested in Max, the Maltipoo'));
  await pup.close();
}

// Forms
{
  const page = await open('/contact');
  await page.click('button[type=submit]');
  await sleep(400);
  check('empty letter is rejected', (await count(page, '.tp-letterform [aria-invalid=true]')) >= 2);
  await page.type('input[name=name]', 'Test Person');
  await page.type('input[name=phone]', '+971 50 123 4567');
  await page.click('button[type=submit]');
  await sleep(2600);
  check('valid letter is posted', (await text(page, '.tp-post__sent .font-plush')) === 'Message received!');
  await page.close();

  const res = await fetch(`${BASE}/api/enquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'x', phone: 'nope' }) });
  check('API rejects bad input with 422', res.status === 422);
  const bot = await fetch(`${BASE}/api/enquiry`, { method: 'POST', body: JSON.stringify({ website: 'spam' }) });
  check('honeypot is silently accepted', bot.status === 200);
}

// Navigation
{
  const page = await open('/');
  check('home has six seats in the lineup', (await count(page, '.tp-lineup:not(.tp-lineup--tags) .tp-lineup__seat')) === 6);
  check('treadmill pins on desktop', await page.$eval('.tp-meet', (s) => s.hasAttribute('data-pinned')));
  await page.evaluate(() => document.querySelector('.tp-header__nav a[href="/faq"]').click());
  await page.waitForFunction(() => location.pathname === '/faq', { timeout: 8000 });
  await sleep(900);
  check('route change lands on /faq', (await text(page, 'h1')) === 'Questions & answers');
  check('curtain lifts after navigating', (await page.$eval('.tp-curtain', (c) => c.dataset.state)) === 'idle');
  await page.close();

  const mobile = await open('/', 390, 844);
  await clickText(mobile, 'button', 'Menu');
  await sleep(400);
  check('mobile menu opens', await mobile.$eval('dialog.tp-menu', (d) => d.open));
  check('mobile has no pinned treadmill', !(await mobile.$eval('.tp-meet', (s) => s.hasAttribute('data-pinned'))));
  await mobile.close();

  const lost = await browser.newPage();
  const res = await lost.goto(`${BASE}/not-a-page`, { waitUntil: 'networkidle2' });
  check('unknown route returns 404 with the poster', res.status() === 404 && (await lost.$eval('.tp-poster__title', (e) => e.textContent)).startsWith('Lost'));
  await lost.close();

  const gone = await open('/puppies/pomeranian-ace-boy');
  check('gone-home puppy shows the stamp', (await gone.$eval('.tp-tag', (e) => e.textContent)).includes('Gone home'));
  await gone.close();
}

await browser.close();
const failed = results.filter((ok) => !ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
