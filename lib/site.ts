export type Site = {
  name: string;
  location: string;
  email: string;
  social: {
    instagram: string;
    clickasnap: string;
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
    clickasnap: 'https://www.clickasnap.com/profile/joereyphotos',
  },
  hero: {
    image: '/photos/Gap.jpg', // keep this in /public/photos
    logo: '/photos/logo.png', // top-left logo
    headline: 'Joe Rey Photography',
    tagline: 'UK landscapes, cityscapes, macro, prints',
    sub: 'A hand-picked set of favourites from my Clickasnap portfolio.',
    ctaPrimary: { label: 'View portfolio', href: '#portfolio' },
    ctaSecondary: { label: 'Book a shoot', href: '#contact' },
  },
};
