import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Art } from '@/components/Art';
import { EnquiryForm } from '@/components/EnquiryForm';
import { Photo } from '@/components/Photo';
import { PupBuddy } from '@/components/PupBuddy';
import { Gallery } from '@/components/puppies/Gallery';
import { checkIcon, chipPaw, letterStamp } from '@/data/art';
import { available, goneHome, puppies, puppyBySlug, type Puppy } from '@/lib/data';
import { SITE_URL, whatsapp } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

const INCLUDED = ['Vaccinated', 'Dewormed', 'Verified health certificate from licensed vets', 'Thoroughly checked before joining your family'];

const IMPORT_STEPS = [
  { title: 'Reserve your puppy', text: 'Tell us which puppy has captured your heart.' },
  { title: 'Personalized consultation', text: "We finalize details with you and share updates on your puppy's journey." },
  { title: 'Import and arrival', text: 'We manage health checks, travel arrangements, and documentation.' },
  { title: 'Welcome home', text: 'We help your new puppy settle in and ensure a smooth transition into your home.' },
];

export const generateStaticParams = () => puppies.map(({ slug }) => ({ slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pup = puppyBySlug((await params).slug);
  if (!pup) return {};
  return { title: pup.name ? `${pup.name}, ${pup.breed} puppy` : `${pup.breed} puppy` };
}

function Neighbour({ pup, label }: { pup: Puppy; label: string }) {
  return (
    <Link
      href={`/puppies/${pup.slug}`}
      className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        <Photo media={pup.cover} sizes="5rem" />
      </span>
      <span>
        <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
        <span className="font-plush text-[1.6rem]">{pup.displayName}</span>
      </span>
    </Link>
  );
}

export default async function PuppyPage({ params }: Props) {
  const pup = puppyBySlug((await params).slug);
  if (!pup) notFound();

  const gone = pup.status === 'rehomed';
  const list = gone ? goneHome : available;
  const at = list.findIndex((p) => p.slug === pup.slug);
  const previous = list[(at - 1 + list.length) % list.length];
  const next = list[(at + 1) % list.length];
  const url = `${SITE_URL}/puppies/${pup.slug}`;
  const label = pup.name ? `${pup.name}, the ${pup.breed}` : `the ${pup.breed}`;
  const askHref = gone
    ? whatsapp(`Hi TeddyPups! I loved ${pup.displayName} (${url}). Do you have a puppy like them?`)
    : whatsapp(`Hi TeddyPups! I'm interested in ${label}: ${url}`);
  const facts = [
    ['Breed', pup.breed],
    ['Boy or girl', pup.genderLabel],
    ['Age', pup.age],
    ['Where', pup.origin?.slug === 'local' ? 'In Dubai' : 'Imported for you'],
  ].filter(([, value]) => value);
  let chapter = 2;

  return (
    <div data-page="pup" className="tp-page">
      <article
        className="tp-storybook"
        style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${pup.cover.color} 24%, var(--color-milk)) 0, var(--color-milk) 85%)` }}
      >
        <div className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
            <Link className="link-ink" href={gone ? '/gone-home' : '/puppies'}>
              {gone ? 'Gone home' : 'Available puppies'}
            </Link>
            <span> / </span>
            <span aria-current="page">{pup.displayName}</span>
          </nav>
          <p className="tp-chapter">
            <span aria-hidden="true" className="tp-chapter__n font-plush">
              1
            </span>
            <span className="font-scrawl">{gone ? 'the day they went home' : "hello, it's me"}</span>
          </p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <Gallery name={pup.displayName} media={pup.media} />
            </div>
            <div className="min-w-0 lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
                <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20" data-reveal="true">
                  <span aria-hidden="true" className="tp-tag__ring" />
                  <PupBuddy className="absolute -top-[4.8rem] right-6 w-[9.5rem]" />
                  {gone ? (
                    <span className="inline-grid place-items-center rounded-full border-[3px] border-current px-3 py-1 font-scrawl text-sm uppercase tracking-wide -rotate-6 text-toffee-deep">
                      Gone home ♥
                    </span>
                  ) : (
                    <span className="chip">
                      <Art svg={chipPaw} />
                      Available
                    </span>
                  )}
                  <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{pup.displayName}</h1>
                  <p className="mt-2 text-lg font-semibold text-cocoa-soft">{pup.breed}</p>
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                    {facts.map(([term, value]) => (
                      <div key={term}>
                        <dt className="font-scrawl text-sm text-cocoa-soft">{term}</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {pup.description && <p className="mt-6 whitespace-pre-line text-cocoa-soft">{pup.description}</p>}
                  <div className="mt-8 flex flex-col gap-3">
                    <a href={askHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                      {gone ? 'Ask about a puppy like this' : `Ask about ${pup.displayName} on WhatsApp`}
                    </a>
                    <a href={`#enquire-${pup.slug}`} className="btn btn-ghost">
                      Send an enquiry
                    </a>
                  </div>
                </div>
                <div className="tp-paper mt-8 -rotate-1">
                  <p className="tp-chapter">
                    <span aria-hidden="true" className="tp-chapter__n font-plush">
                      {chapter}
                    </span>
                    <span className="font-scrawl">what comes with {pup.displayName}</span>
                  </p>
                  <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                  <ul className="mt-4 space-y-2.5">
                    {INCLUDED.map((item) => (
                      <li key={item} className="flex items-start gap-3 font-semibold">
                        <Art svg={checkIcon} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {!gone && (
            <section aria-labelledby={`home-steps-${pup.slug}`} className="mt-20">
              <p className="tp-chapter">
                <span aria-hidden="true" className="tp-chapter__n font-plush">
                  {++chapter}
                </span>
                <span className="font-scrawl">the way home</span>
              </p>
              <h2 id={`home-steps-${pup.slug}`} className="font-plush text-big mt-3">
                Coming home from abroad
              </h2>
              <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
                {IMPORT_STEPS.map((step, i) => (
                  <li key={step.title}>
                    <span className="tp-trail__num font-plush">{i + 1}</span>
                    <h3 className="font-plush-text text-xl font-bold leading-tight">{step.title}</h3>
                    <p className="mt-2 max-w-[38ch] text-cocoa-soft">{step.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
          <section id={`enquire-${pup.slug}`} aria-labelledby={`enquire-title-${pup.slug}`} className="tp-letter mt-20 grid gap-10 lg:grid-cols-12">
            <span aria-hidden="true" className="tp-letter__stamp">
              <Art svg={letterStamp} />
            </span>
            <div className="lg:col-span-4">
              <p className="tp-chapter">
                <span aria-hidden="true" className="tp-chapter__n font-plush">
                  {++chapter}
                </span>
                <span className="font-scrawl">dear TeddyPups…</span>
              </p>
              <h2 id={`enquire-title-${pup.slug}`} className="font-plush text-big mt-2">
                {gone ? 'Looking for a puppy like this?' : `Ask about ${pup.displayName}`}
              </h2>
              <p className="mt-4 text-cocoa-soft">
                Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EnquiryForm
                puppyId={pup.id}
                message={gone ? `Hi! I'd love a puppy like ${pup.displayName}.` : `Hi! I'd love to know more about ${pup.displayName} (${pup.breed}).`}
              />
            </div>
          </section>
          <nav className="mt-16 grid gap-4 sm:grid-cols-2" aria-label="More puppies">
            <Neighbour pup={previous} label="Previous pup" />
            <Neighbour pup={next} label="Next pup" />
          </nav>
        </div>
      </article>
    </div>
  );
}
