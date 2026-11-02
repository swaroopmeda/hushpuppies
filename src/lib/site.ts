export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teddypups-clone.vercel.app';

export const PHONE = '+971 54 167 6733';
export const PHONE_HREF = 'tel:+971541676733';
export const WHATSAPP_NUMBER = '971541676733';
export const EMAIL = 'teddypupsadmin@gmail.com';
export const ADDRESS = 'Downtown Dubai, United Arab Emirates';
export const MAPS_URL = 'https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7';

export const whatsapp = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
export const WHATSAPP_HREF = whatsapp("Hi TeddyPups! I'd love to know more about your puppies.");

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/puppies', label: 'Puppies' },
  { href: '/happy-families', label: 'Happy families' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Visit & contact' },
];

export const FOOTER_LINKS = [
  { href: '/puppies', label: 'Available puppies' },
  { href: '/gone-home', label: 'Gone home' },
  { href: '/happy-families', label: 'Happy families' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/how-it-works#delivery', label: 'Delivery & collection' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Visit & contact' },
];

export const SOCIALS = [
  { href: 'https://www.instagram.com/teddypups.worldwide/', label: 'Instagram' },
  { href: 'https://www.tiktok.com/@teddypupsuae', label: 'TikTok' },
  { href: 'https://www.facebook.com/profile.php?id=61567496944539', label: 'Facebook' },
];

export const TESTIMONIAL = {
  quote:
    'TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.',
  author: 'Sarah M.',
  place: 'Dubai, UAE',
};
