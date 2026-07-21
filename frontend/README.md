# Castrol B2B Admin Dashboard

A Next.js 14 (App Router) + Tailwind CSS clone of the Castrol B2B Portal dashboard, fully componentized and mobile responsive.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
npm start
```

## Project structure

```
app/
  page.tsx             Login page (app root, "/")
  dashboard/page.tsx   Dashboard page ("/dashboard") — assembles all widgets
  layout.tsx           Root layout
  globals.css          Tailwind + global styles

components/
  login/
    LoginTopBar.tsx    Logo, language selector, Help & Support
    LoginHero.tsx      Left panel: welcome copy, feature list, announcement card
                       (has a placeholder area for your own product image/illustration)
    LoginForm.tsx      Right panel: NTID/password form — on submit (or SSO button),
                       routes to /dashboard via next/navigation's useRouter
    LoginFooter.tsx    Bottom trust bar + copyright

  DashboardShell.tsx   Layout shell (sidebar + header + bottom nav wiring, mobile menu state)
  Sidebar.tsx          Left navigation, "Ask Castrol Genie" panel, Quick Links (desktop drawer + mobile off-canvas)
  Header.tsx           Top bar: logo, search, notifications, profile menu
  MobileBottomNav.tsx  Bottom tab bar shown only on mobile (<lg)
  Footer.tsx           Dashboard page footer
  GreetingBar.tsx      "Good Morning" greeting + date/time chip
  StatCards.tsx         My To Do / Approvals / Alerts / My Team stat tiles
  MostUsedApps.tsx      App shortcut grid
  TeamPerformanceChart.tsx  Bar chart (recharts) — team performance by region
  OffersOverview.tsx        Donut chart (recharts) — offers by status
  RecentActivities.tsx      Recent activity table
  MyToDoList.tsx            To-do list empty state panel
  Announcements.tsx         Announcements list
  QuickActions.tsx          Quick action shortcuts

lib/
  data.ts   Mock data used across the dashboard — replace with real API calls
```

## Login flow

- Visiting `/` shows the login page.
- Submitting the sign-in form (or clicking the SSO button) currently just calls `router.push("/dashboard")` — there's no real authentication wired up yet. Swap the `TODO` in `LoginForm.tsx`'s `handleSubmit` for a real API call, and only redirect on a successful response.
- `LoginHero.tsx` has an empty placeholder container (with a code comment) where the product image/illustration should go — intentionally left blank per request so you can drop in your own artwork.

## Notes

- All colors are driven by the Tailwind config (`tailwind.config.ts`) using the provided brand palette (`brand.blue`, `brand.orange`, `brand.green`, `brand.red`, `brand.dark`, `brand.gray`), plus a `primary` green matching the app chrome.
- Charts use [Recharts](https://recharts.org/).
- Icons use [lucide-react](https://lucide.dev/).
- The layout is mobile-first: sidebar becomes an off-canvas drawer below the `lg` breakpoint, and a bottom tab bar appears in its place, matching the provided mobile mock.
- Replace the contents of `lib/data.ts` with real API data (e.g. via `fetch` in Server Components, or SWR/React Query in the client components) when wiring up your backend.
- Uses the system font stack (no external font fetch), so it builds correctly in network-restricted / offline environments. Swap in `next/font/google` for Inter if you want it and have network access.
