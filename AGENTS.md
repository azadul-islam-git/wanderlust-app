# wanderlust-app-client

Travel blog ("Wanderlust") marketing/landing app. Single Next.js App Router app — not a monorepo. README is boilerplate; this file is the real context.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands (npm only)

- `npm run dev` — dev server (Turbopack), http://localhost:3000
- `npm run build` — production build; primary verification step since there are **no tests**
- `npm run lint` — flat config, `eslint-config-next` (core-web-vitals + typescript)
- No typecheck script: run `npx tsc --noEmit` manually (tsconfig is already `noEmit`)

## Framework quirks (verified from `next.config.ts`)

- Next 16 + React 19 with **`cacheComponents: true` and `partialPrefetching: true`** — the new cache model. Any dynamic data access needs a `<Suspense>` boundary or `'use cache'` (see `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`); prerender will fail otherwise and build output depends on it.
- **`reactCompiler: true`** (babel-plugin-react-compiler) — don't hand-optimize with `useMemo`/`useCallback` or optimistic lint conventions; the compiler memoizes automatically.
- Tailwind v4, CSS-first: no `tailwind.config`, tokens/theme live in `src/app/globals.css`; CSS is loaded via Turbopack (`@tailwindcss/turbopack`), not PostCSS.
- Page/layout prop types use the **global helpers `PageProps<'/route'>` / `LayoutProps<'/route'>`** (no import, see `src/app/layout.tsx`) — don't hand-write `children`/`params` prop types the old way.

## shadcn / styling conventions (differs from older shadcn defaults)

- `components.json` style **"base-nova"**: components are built on **`@base-ui/react` (Base UI), not Radix**. Do not add `@radix-ui/*` deps or radix import patterns to new components.
- `cn` comes from the standalone **`cn` package** (re-exported via `src/lib/utils.ts`) — not `clsx` + `tailwind-merge` composed in-repo. Import as `import { cn } from "@/lib/utils"`.
- Aliases: `@/*` → `src/*`; UI primitives in `src/components/ui` are shadcn-generated (leave generated structure intact); app hooks in `src/hooks`, helpers in `src/lib`.
- Code-highlighting components (`code-block`, `message`, `bubble`, etc.) depend on the shiki libs wired in `src/lib/highlighter.tsx` + `src/hooks/use-highlighted-code.ts` — don't duplicate highlighting logic.

## Current state

- Landing page = `src/app/page.tsx` composing `src/components/Navbar.tsx`, `Banner.tsx` (hero, `Banner.png` + `Wanderlast.png` logo), `WhyChooseUs.tsx` (3-card section, cyan `ShieldCheck`/`MapTrifold`/`Headset.png` icons), `Testimonials.tsx` (uses `ui/carousel.tsx`; `person1.png` = woman/Sarah, `person2.png` = man/Michael — matched by pixel sampling), `Cta.tsx` (`CTA.png`, already-dark image so only a light overlay), and `Footer.tsx` (`Wanderlast-1.png` = white wordmark; social icons are inline SVGs since lucide has no brand icons). Nav links and CTAs are presentational (`href="#"`) until routes exist; the search bar and newsletter input are display-only. Josefin Sans is the body font (in `layout.tsx`); headings/quotes use Playfair Display loaded via `next/font` in each component. Design screenshots in chat are the 1440px Figma frame; trust their blue selection outlines as tool artifacts, not design.
- `/add-destination` = `src/app/add-destination/page.tsx`, a client page (no Navbar per screenshot; Cancel resets form + `router.push("/")`). shadcn `Card`/`Input`/`Select`/`Textarea`/`Label`/`Button` with filled-style overrides (`h-9 bg-slate-50 border-transparent`, `fieldBox` const). Controlled form + submit-time validation (inline `text-destructive` errors via `aria-invalid`) + 800ms stub submit → emerald inline success banner (no Toaster wired). Base-ui Select uses `onValueChange`; `SelectTrigger` default `data-[size=default]:h-8` needs a `data-[size=default]:h-9` override to be taller. Categories invented: Beach/Mountain/City/Adventure/Cultural (default `beach`).
- `/all-destination` = `src/app/all-destination/page.tsx` (server component) + `src/components/AllDestinations.tsx` (client: filter bar, count, card grid). **A real backend exists: `http://localhost:8000/destination`** returning `{_id, name, country, category, price:"700", duration:"5", departureDate, imageUrl (cdn.pixabay.com), description}` — price/duration are strings, no rating field (design shows `4.5 ★` badge; rendered as hardcoded 4.5). Server does `await connection()` before the fetch (Next 16 per-request rendering) — without it the build bakes backend data into static HTML. Filters (category/price-range/sort) work client-side. `next.config.ts` now has `images.remotePatterns` for `cdn.pixabay.com` (added for `next/image` on remote URLs). Note: `next.config.ts` actually has `cacheComponents: false` / `partialPrefetching: false` (the "Cache Components enabled" bullet above reflects the create-next-app defaults, not this config).
- `/all-destination/[id]` = `src/app/all-destination/[id]/page.tsx` (server, uses the global `PageProps<"/all-destination/[id]">` type — params is a Promise) + `src/components/BookingCard.tsx` (client: date input + stubbed Book Now → inline emerald "Booking request sent!"). Fetched via `GET /destination/:id` (backend returns **500 for malformed ObjectIds** and empty body for missing docs → both treated as `notFound()`). **Gotcha: `notFound()` inside a `<Suspense>` boundary renders the 404 UI but the HTTP status stays 200** (shell already streamed) — fetch + notFound must happen directly in the page component. Highlights are invented per-category static lists (`highlightsByCategory` map) — the API has no highlights/rating/reviews; rating 4.9/(234 reviews) is hardcoded like the card badge. Edit/Cancel buttons in the header are non-functional stubs: `wanderlust-app-server/index.js` only has `POST /add-destination`, `GET /destination`, `GET /destination/:id` (no PUT/DELETE). Backend source lives at `C:\Projects\wanderlust-app-server\index.js` (Express + MongoDB Atlas, `wanderLust` db, `destination` collection; bad ids crash `new ObjectId(id)` → the 500).
