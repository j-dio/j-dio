<h1 align="center">John Dio Lumacang</h1>
<p align="center">Full-Stack Software Engineer · Web Developer</p>

<p align="center">
  <a href="https://lumacang-dio.vercel.app">Portfolio</a> ·
  <a href="https://www.linkedin.com/in/john-dio-a-lumacang/">LinkedIn</a> ·
  <a href="mailto:tcshs.lumacang.johndio.a@gmail.com">Email</a>
</p>

---

### About

I'm a CS student at UP Cebu, going into my third year, and I work as a full-stack software engineer and web developer at two companies at the same time. Most of what I build ends up in front of real users, which is the part I like. I ship client sites and apps on Hostinger, Vercel, and Railway, and I spend a fair amount of time on the boring parts nobody demos: sync that does not silently fail, auth that does not leak, rate limits that actually hold.

University Scholar and College Scholar at UP Cebu. Member of UPCSG, UPSTRUM, and UP Kadugong Bol-anon.

### Stack

**Languages** TypeScript, Python, JavaScript, SQL, C++

**Frontend** React, Next.js, Tailwind CSS, shadcn/ui

**Backend** Node.js, Express, Deno, Drizzle ORM, Zod

**Data** PostgreSQL, Supabase, Redis, SQLite

**Infra and testing** AWS, Docker, Vercel, Railway, Hostinger, Playwright, Vitest

### Projects

**[TapO(1)](https://lumacang-dio.vercel.app)** · Next.js PWA that pulls Google Classroom and Moodle into one task list. 50+ users, no paid promotion. Web Push is hand-rolled to RFC 8291/8292 (ECDH, HKDF, AES-128-GCM) inside a Deno Edge Function, so it runs with zero Node dependencies. Both sources sync through `Promise.allSettled`, so one dead source never blocks the other.
`Next.js` `TypeScript` `Supabase` `TanStack Query` `Serwist`

**LoopIn** · Product feedback platform. Express API with 62 endpoints over a 14-table Postgres schema, running on Railway. Google and GitHub OAuth, rotating SHA-256 refresh tokens, a Redis sliding-window rate limiter using atomic Lua across 6 buckets, and presigned direct-to-S3 uploads. Backlog ranking runs on Gemini with an OpenRouter fallback and prompt-injection fencing.
`React` `Express` `PostgreSQL` `Drizzle` `Redis` `Gemini` `AWS S3`

**RenTell** · Student housing and carinderia directory. 29-endpoint REST API on the Next.js App Router covering listings, messaging, visits, and reviews. JWT auth with bcrypt and httpOnly cookies, 7-day session TTL enforced server side. Concurrent conversation races are settled in the database with `ON CONFLICT DO NOTHING` and an `IS NOT DISTINCT FROM` fallback, with unread counts and read receipts on top.
`Next.js` `TypeScript` `PostgreSQL (Neon)` `Zod` `Mapbox GL`

**CarbonCap** · Qt 6 desktop app for tracking carbon footprint. First place in the SDG category at the UP Cebu Project Expo 2025, out of 19 teams.
`C++` `Qt 6`

**Qreate** · Electron desktop app that generates exams with AI. Stable at v1.0.0, running on Together AI and Groq.
`Electron` `React` `Zustand` `SQLite`

**SpermSanity** · Game jam entry that placed 10th of 24. Dark comedy about existential dread, reproductive biology, and a sentient flesh door named Doorethy.
`Godot 4` `GDScript`

### Activity

<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=j-dio&theme=github-compact&hide_border=true&area=true&custom_title=Contributions" alt="Contribution graph" />
</p>

### Certifications and awards

- DataCamp: Building AI Agents with Google ADK, Scalable Agentic Systems, OpenAI API, Prompt Engineering
- Udacity: AWS AI Practitioner Challenge
- UP Cebu Project Expo 2025, SDG category, 1st place
- UPCSG Game Jam 2026, 10th of 24 teams

### Currently learning

AWS cloud architecture and AI engineering.
