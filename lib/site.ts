export type Site = {
  name: string;
  location: string;
  email: string;
  social: {
    instagram: string;
  };
  hero: {
    image: string;
    logo: string;
    headline: string;
    tagline?: string;
    sub: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };
};

export const site: Site = {
  name: 'Joe Rey Photography',
  location: 'Cambridgeshire, UK',
  email: 'joereyphotography@hotmail.com',
  social: {
    instagram: 'https://instagram.com/joe.rey.photography',
  },
  hero: {
    image: '/photos/land-light/rapeseed-gold.jpg', // hero background image
    logo: '/photos/logo.png', // top-left logo
    headline: 'Joe Rey Photography',
    tagline: 'UK landscapes, cityscapes, macro, prints',
    sub: 'A hand-picked set of favourites from my photography collection.',
    ctaPrimary: { label: 'View gallery', href: '#portfolio' },
    ctaSecondary: { label: 'Contact me', href: '#contact' },
  },
};
