This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Analytics

Google Analytics 4 is wired up via `@next/third-parties/google` in `app/layout.tsx`. To enable it:

1. Create a GA4 property and Web data stream for `joereyphotography.com`.
2. Set `NEXT_PUBLIC_GA_ID` in Vercel (Production + Preview) to the Measurement ID (`G-XXXXXXXXXX`).
3. Redeploy. The GA script is only injected when `NEXT_PUBLIC_GA_ID` is set, so local/dev builds without the var stay clean.

The same Measurement ID can be pasted into Payhip under Account → Settings → Advanced Settings → Google Analytics so store events flow into the same property.

Custom events tracked from the UI:

- `email_click` — mailto link in the footer and contact page
- `payhip_click` — Store nav link, home Shop Now CTA, gallery Download buttons

After deploy, check GA Realtime to confirm pageviews and events are firing.
