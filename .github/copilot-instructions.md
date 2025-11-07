## Quick orientation for AI coding agents

This is a small client-side React + TypeScript app (Vite) that uses Supabase for data storage and Auth0 for authentication. The goal: help users discover universities, majors, and program-specific outcomes.

Keep guidance concise and code-focused. Below are the important, discoverable patterns and concrete examples you'll need to be productive.

### How the app is structured (big picture)

- Frontend only: no separate Node server. All data access is done directly from the browser to Supabase via `src/lib/supabase.ts`.
- Entrypoint: `src/main.tsx` (wraps `<App/>` with `Auth0Provider`).
- App navigation: `src/App.tsx` uses an internal `view` state (not react-router) to switch between `HomePage`, `UniversityDetailPage`, `MajorDetailPage`, and `CombinedDetailPage`.
- Pages live in `src/pages/*`. Reusable UI lives in `src/components/*`.

### Key files to reference

- `src/lib/supabase.ts` — Supabase client + TypeScript types for DB rows (update these when DB schema changes).
- `src/pages/*` — Data flow examples and Supabase query patterns. See `HomePage.tsx`, `UniversityDetailPage.tsx`, `MajorDetailPage.tsx`, `CombinedDetailPage.tsx`.
- `src/components/*` — Small presentational components (cards, search bar, filters, navbar).
- `vite.config.ts` — Vite optimizations (lucide-react is excluded from optimizeDeps).
- `supabase/migrations/` — SQL migrations for DB schema (source of truth for types).

### Environment & running locally

- Environment variables (root `.env`):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_DOMAIN` and `VITE_CLIENTID` (Auth0)
- Common commands (from `package.json`):
  - `npm run dev` — start Vite dev server
  - `npm run build` — build production bundle
  - `npm run preview` — preview built site
  - `npm run lint` — run ESLint
  - `npm run typecheck` — run `tsc --noEmit -p tsconfig.app.json`

### Data access patterns to follow (concrete examples)

- Simple single-row fetch:
  ```ts
  const { data } = await supabase
    .from("universities")
    .select("*")
    .eq("id", universityId)
    .maybeSingle();
  ```
- Relationship select (see `university_majors` -> joined `majors`):
  ```ts
  const { data } = await supabase
    .from("university_majors")
    .select("*, major:majors(*)")
    .eq("university_id", universityId);
  ```
- Case-insensitive search + limit:
  ```ts
  let q = supabase.from("majors").select("*").order("name");
  q = q.ilike("name", `%${searchQuery}%`);
  const { data } = await q.limit(20);
  ```
- Pattern: pages compute small aggregates client-side (e.g., average rating is computed by fetching review rows and averaging). If you change this, keep performance and limits (20 rows, separate reviews queries) in mind.

### UI & design conventions

- Styling: Tailwind CSS utility classes are used throughout. Small usage of MUI (Navbar only). Stick to Tailwind for new UI unless a clear reason to add MUI components exists.
- Icon set: `lucide-react` (note it's excluded in `vite.config.ts`).
- Components are small and mostly presentational; pages orchestrate data fetching.

### Type & schema changes

- When DB columns/tables change:
  1. Update the TypeScript types in `src/lib/supabase.ts` to match migrations.
  2. Update any `.select()` calls that depend on affected columns (and adjust client aggregation code in pages).
  3. Check `supabase/migrations/*.sql` for migration SQL to mirror behavior.

### Project-specific gotchas and notes

- Navigation is internal state (App.tsx). Don't introduce react-router without checking for side-effects. React Router is listed as a dependency but is not used by the app currently.
- Direct DB calls from pages: pages call Supabase directly rather than via a central data service. If you centralize calls, preserve the existing query semantics (limits, ordering, related selects) and update all callers.
- Auth: `Auth0Provider` is configured in `src/main.tsx`. Login/logout flows are used in `src/components/Navbar.tsx` via `useAuth0()`.
- Dev-only details: developer local testing requires valid env vars for Supabase and Auth0; otherwise the UI may error or show empty data.

### Example quick tasks and where to start

- Add a new field to `universities`: update `supabase/migrations/*`, then `src/lib/supabase.ts` (type), then any page that displays it (e.g., `UniversityDetailPage.tsx`).
- Improve search performance: examine `HomePage.tsx` which currently issues separate review queries per university to compute averages — consider a single RPC or server-side view to reduce round-trips.

If anything here is unclear or you'd like more examples (e.g., wiring a new Supabase RPC or adding a new page), tell me which area to expand and I'll iterate.
