// Turns a local crawl of the reference site into the JSON files under src/data.
// Usage: node scripts/extract-data.mjs <crawl-dir>
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ref = process.argv[2];
if (!ref) throw new Error('Pass the crawl directory');
const out = path.resolve('src/data');
fs.mkdirSync(out, { recursive: true });

const read = (f) => fs.readFileSync(path.join(ref, f), 'utf8');

// Next streams page data as `self.__next_f.push([1,"..."])` string chunks.
const flight = (html) =>
  [...html.matchAll(/self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)<\/script>/g)]
    .map((m) => JSON.parse(m[1]))
    .join('');

// Reads the balanced JSON value that starts at `start`.
function balanced(s, start) {
  const open = s[start];
  const close = open === '[' ? ']' : '}';
  let depth = 0;
  let inStr = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) return s.slice(start, i + 1);
  }
  throw new Error('Unbalanced JSON');
}

const slimMedia = (m) =>
  m && {
    url: m.url,
    kind: m.kind,
    width: m.width,
    height: m.height,
    alt: m.alt,
    caption: m.caption || undefined,
    focalX: m.focalX,
    focalY: m.focalY,
    color: m.color,
    blurDataUrl: m.blurDataUrl ?? undefined,
    poster: m.poster ? slimMedia(m.poster) : undefined,
  };

const hasRefs = (o) => JSON.stringify(o).includes('"$');

// Every puppy object in a flight payload, in document order.
function puppiesIn(text) {
  const found = [];
  for (const m of text.matchAll(/\{"id":"[0-9a-f-]{36}","slug":"/g)) {
    try {
      found.push(JSON.parse(balanced(text, m.index)));
    } catch {
      /* cut off by a $ref */
    }
  }
  return found;
}

const puppies = new Map();
const addPuppy = (p) => {
  if (!p.media || hasRefs(p.media)) return;
  if (!puppies.has(p.slug)) puppies.set(p.slug, p);
};

const listFlight = flight(read('puppies.html'));
const available = [];
puppiesIn(listFlight).forEach((p) => {
  addPuppy(p);
  if (!available.includes(p.slug)) available.push(p.slug);
});

const slugs = fs.readdirSync(path.join(ref, 'puppy')).map((f) => f.replace('.html', ''));
const detailDom = {};
for (const slug of slugs) {
  const html = read(`puppy/${slug}.html`);
  const text = flight(html);
  puppiesIn(text).forEach(addPuppy);
  detailDom[slug] = html;
}

const gone$ = cheerio.load(read('gone-home.html'));
const tickets = gone$('.tp-ticket__link')
  .map((_, a) => ({
    slug: gone$(a).attr('href').replace('/puppies/', ''),
    coverAlt: gone$(a).find('img').attr('alt'),
    local: gone$(a).find('.tp-ticket__route span').first().text().includes('Dubai'),
  }))
  .get();
const goneOrder = tickets.map((t) => t.slug);

// Gone-home puppies are not in the listing payload, so rebuild them from their own page.
for (const slug of slugs.filter((s) => !puppies.has(s))) {
  const html = detailDom[slug];
  const text = flight(html);
  const $ = cheerio.load(html);
  const root = $('[id="S:0"]');
  const facts = {};
  root.find('.tp-tag dl > div').each((_, d) => {
    facts[$(d).find('dt').text()] = $(d).find('dd').text();
  });
  const at = text.indexOf('"media":[');
  if (at < 0) {
    console.warn('No gallery for', slug);
    continue;
  }
  const media = JSON.parse(balanced(text, at + '"media":'.length));
  const ticket = tickets.find((t) => t.slug === slug);
  const name = root.find('h1').first().text();
  const breed = facts.Breed ?? root.find('.tp-tag p').first().text();
  const genderLabel = facts['Boy or girl'] ?? '';
  addPuppy({
    id: slug,
    slug,
    name: name === breed ? '' : name,
    displayName: name,
    breed,
    gender: genderLabel.toLowerCase() === 'boy' ? 'male' : genderLabel.toLowerCase() === 'girl' ? 'female' : 'male-female',
    genderLabel,
    age: facts.Age ?? '',
    status: 'rehomed',
    breeds: [{ slug: breed.toLowerCase().replace(/\s+/g, '-'), name: breed }],
    origin: ticket?.local
      ? { slug: 'local', name: 'In Dubai' }
      : { slug: 'imported', name: facts.Where ?? 'Imported for you' },
    cover: media.find((m) => m.alt === ticket?.coverAlt) ?? media[0],
    media,
  });
}

const missing = slugs.filter((s) => !puppies.has(s));
if (missing.length) console.warn('No structured data for', missing);

const toPuppy = (p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  displayName: p.displayName,
  breed: p.breed,
  gender: p.gender,
  genderLabel: p.genderLabel,
  age: p.age,
  colour: p.colour || undefined,
  description: p.description || undefined,
  status: p.status,
  breeds: (p.breeds ?? []).map((b) => ({ slug: b.slug, name: b.name })),
  origin: p.origin ? { slug: p.origin.slug, name: p.origin.name } : null,
  collections: (p.collections ?? []).map((c) => ({ slug: c.slug, name: c.name })),
  cover: slimMedia(p.cover),
  media: p.media.map(slimMedia),
});

const all = [...new Set([...available, ...goneOrder, ...puppies.keys()])]
  .filter((s) => puppies.has(s))
  .map((s) => toPuppy(puppies.get(s)));

fs.writeFileSync(path.join(out, 'puppies.json'), JSON.stringify(all, null, 1));
fs.writeFileSync(path.join(out, 'gone-home.json'), JSON.stringify(goneOrder, null, 1));

// Happy families: every media object on the wall, in order.
const famText = flight(read('happy-families.html'));
const families = new Map();
for (const m of famText.matchAll(/\{"id":"[A-Za-z0-9_-]{12}","url":"\/media\//g)) {
  const item = JSON.parse(balanced(famText, m.index));
  if (!families.has(item.url)) families.set(item.url, slimMedia(item));
}
fs.writeFileSync(path.join(out, 'families.json'), JSON.stringify([...families.values()], null, 1));

// Home page media that is not attached to a puppy (showroom snaps + clip).
const homeText = flight(read('index.html'));
const known = new Set([
  ...all.flatMap((p) => p.media.flatMap((x) => [x.url, x.poster?.url])),
  ...families.keys(),
]);
const showroom = new Map();
for (const m of homeText.matchAll(/\{"id":"[A-Za-z0-9_-]{12}","url":"\/media\//g)) {
  const item = JSON.parse(balanced(homeText, m.index));
  if (!known.has(item.url) && !showroom.has(item.url)) showroom.set(item.url, slimMedia(item));
}
fs.writeFileSync(path.join(out, 'showroom.json'), JSON.stringify([...showroom.values()], null, 1));

const faq$ = cheerio.load(read('faq.html'));
const faqs = faq$('.tp-note')
  .map((_, li) => ({
    q: faq$(li).find('.tp-note__q span').first().text(),
    a: faq$(li).find('.tp-note__flap p').text(),
    tilt: li.attribs.style.match(/--tilt:([^;]+)/)[1],
    pin: li.attribs.style.match(/--pin:([^;]+)/)[1],
  }))
  .get();
fs.writeFileSync(path.join(out, 'faqs.json'), JSON.stringify(faqs, null, 1));

// Inline SVG art, keyed by name. Each entry keeps the root attributes and inner markup.
const art = {};
const take = (name, $, el) => {
  if (!el || art[name]) return;
  const attrs = { ...el.attribs };
  delete attrs['aria-hidden'];
  art[name] = { attrs, inner: $(el).html() };
};
const scan = (file, rules) => {
  const $ = cheerio.load(read(file));
  for (const [name, sel] of Object.entries(rules)) {
    const el = $(sel).get(0);
    if (!el) console.warn('art not found', name, sel);
    take(name, $, el);
  }
  return $;
};

const home$ = scan('index.html', {
  pawNav: '.tp-nav-link__paw',
  headerHem: '.tp-header__hem',
  heroNote: '.tp-hero__note svg',
  quilt: '.tp-quilt__edge',
  doorPeephole: '.tp-door__peephole',
  skyline: '.tp-way__skyline',
  flight: '.tp-flight svg',
  clipPlay: '.tp-clip__play svg',
  route: '.tp-msg .tp-route',
  compose: '.tp-phone__compose svg',
  horizonCity: '.tp-horizon__city',
  qaStar: '.tp-qa__star',
  twinkle: '.tp-night__stars svg',
  footerHill: '.tp-footer__hill',
  basketBack: '.tp-basket__back',
  basketFront: '.tp-basket__front',
  curtainTop: '.tp-curtain__edge--top',
  curtainBottom: '.tp-curtain__edge--bottom',
  runner: '.tp-curtain__runner svg',
  pawPrints: '.pup-prints svg',
});
home$('.tp-curtain__print').each((i, el) => take(`curtainPrint${i}`, home$, el));
home$('.tp-stamp__icon').each((i, el) => take(`stamp${i}`, home$, el));
home$('.tp-night__stars svg').each((i, el) => {
  art.stars ??= [];
  art.stars.push({ ...el.attribs });
});
delete art.stars;
fs.writeFileSync(
  path.join(out, 'stars.json'),
  JSON.stringify(
    home$('.tp-night__stars svg').map((_, el) => ({ className: el.attribs.class, style: el.attribs.style })).get(),
    null,
    1,
  ),
);
home$('.pup-stop').each((_, stop) => {
  const pose = stop.attribs['data-pose'];
  take(`pup-${pose}`, home$, home$(stop).find('.pup-buddy svg').get(0));
});

scan('puppies.html', { sketchUnderline: '.tp-sketchbook__underline', pupSelf: '.tp-sketchbook__self .pup-buddy svg' });
scan('happy-families.html', { heart: '.tp-memories__heart', wallPaw: '.tp-wall__paw' });
const how$ = scan('how-it-works.html', {
  postcardCity: '.tp-postcard__city',
  postcardRoute: '.tp-postcard__route',
  postcardPlane: '.tp-postcard__plane',
  deliveryHill: '.text-cocoa\\/25',
  pupBoard: '.tp-board .pup-buddy svg',
  pupTeddyRight: '.tp-journeys__teddy svg',
});
how$('.tp-step__icon svg').each((i, el) => take(`step${i}`, how$, el));
how$('#why li > svg').each((i, el) => take(`why${i}`, how$, el));
how$('#promise .tp-stamp__icon').each((i, el) => take(`promise${i}`, how$, el));
scan('faq.html', { lens: '.tp-notes__lens', pupFaq: '.tp-notes__teddy svg' });
scan('contact.html', {
  letterStamp: '.tp-letter__stamp svg',
  pin: '.tp-visit svg',
  shopSkyline: '.tp-shopfront > svg',
  pupContact: '.pup-buddy svg',
});
scan('gone-home.html', { ticketRoute: '.tp-ticket__route svg', pupBooth: '.tp-booth__teddy svg', goneHeart: 'h1 svg' });
scan('puppy/maltipoo-max-male.html', {
  chipPaw: '.chip svg',
  checkIcon: '.tp-paper li svg',
  pupTag: '.tp-tag .pup-buddy svg',
});

// One named export per drawing, so client bundles only carry the art they use.
const safeName = (k) => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
// One loop of the walk, sampled from the running page because it is posed in JS.
const walkFrames = JSON.parse(read('walk-frames.json')).slice(19, 29);
fs.writeFileSync(
  path.join(out, 'art.ts'),
  `// Generated by scripts/extract-data.mjs\n${Object.entries(art)
    .map(([k, v]) => `export const ${safeName(k)} = ${JSON.stringify(v)};`)
    .join('\n')}\nexport const walkFrames = ${JSON.stringify(walkFrames)};\n`,
);

console.log({
  puppies: all.length,
  available: available.length,
  gone: goneOrder.length,
  families: families.size,
  showroom: showroom.size,
  faqs: faqs.length,
  art: Object.keys(art).length,
  statuses: [...new Set(all.map((p) => p.status))],
  breeds: [...new Set(all.flatMap((p) => p.breeds.map((b) => b.slug)))],
  origins: [...new Set(all.map((p) => p.origin?.slug))],
  collections: [...new Set(all.flatMap((p) => p.collections.map((c) => c.slug)))],
  withDescription: all.filter((p) => p.description).length,
});
