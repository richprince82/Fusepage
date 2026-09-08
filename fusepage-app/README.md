# Fusepage

Fusepage is a mini-site and link-in-bio builder with a polished marketing landing page, demo auth, dashboard, editor, appearance controls, live preview, public pages, analytics, and Free/Pro pricing UX.

This repository contains the client app under `fusepage-app`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Local/demo persistence via `localStorage`
- Vercel-ready project structure

## Getting started

From the project root:

```bash
cd fusepage-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev     # Start the development server
npm run build   # Production build
npm run start   # Start the production server
npm run lint    # Run ESLint
npm run typecheck  # Run TypeScript
```

## Demo and persistence

This app uses a local demo auth flow. Signing in and up does not hit a backend. Sessions and pages are stored in `localStorage` under `fusepage.auth.demo.v1`.

If you clear site data, the demo session is lost and you will be signed out.

## Environment variables

The app runs without secrets, but a few environment variables are used for Vercel and real payment integration:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL used for metadata
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key for billing UI
- `STRIPE_SECRET_KEY` — Stripe secret key for billing provisioned flag
- `STRIPE_PRICE_PRO_MONTHLY` — Stripe price ID for Pro monthly
- `STRIPE_PRICE_PRO_YEARLY` — Stripe price ID for Pro yearly

No secrets are committed.

## Project structure

```
fusepage-app/
  app/
    (auth)/
      sign-in/
      sign-up/
    onboarding/
    (marketing)/
      page.tsx
      terms/
      privacy/
    (dashboard)/
      dashboard/
      editor/
      analytics/
      settings/
      upgrade/
      layout.tsx
    u/[slug]/
      page.tsx
    layout.tsx
  components/
    dashboard/
    editor/
    public/
    marketing/
    ui/
  hooks/
  lib/
  types/
```

## Key surfaces

- Marketing home: `/`
- Sign in: `/sign-in`
- Sign up: `/sign-up`
- Onboarding: `/onboarding`
- Dashboard: `/dashboard`
- Editor: `/editor`
- Analytics: `/analytics`
- Settings: `/settings`
- Upgrade: `/upgrade`
- Public page: `/u/[slug]`

## Acceptance criteria

- Polished marketing landing page
- Sign in / sign up UX
- Complete onboarding
- Dashboard
- Page/link editor
- Appearance/theme controls
- Working live preview
- Public Fusepage route
- Analytics interface
- Free/Pro pricing and upgrade UX
- Settings/account surfaces
- Responsive mobile navigation
- Loading/error/empty states
- Accessibility basics
- README/setup instructions
- Successful lint
- Successful TypeScript check
- Successful production build

## Lint, typecheck, and build

Before declaring completion, run:

```bash
npm run lint
npm run typecheck
npm run build
```

If any of those fail, fix the reported issues and re-run until they pass.

## Deployment

This project is structured for Vercel. Push the repo to GitHub and import it in the Vercel dashboard. Add the environment variables above before enabling real billing.

## Notes

- Billing is a demo UX until Stripe credentials are configured.
- Public pages are served from `/u/[slug]` and render the signed-in user's stored page from the browser, so the editor → public page journey works end to end for any account.
- All colors and theming flow through Tailwind CSS variables and the appearance system in `lib/demo-data` and `hooks/use-appearance`.
