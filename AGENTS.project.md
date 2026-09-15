# HelloBrisa — project instructions

Product brief for a coding agent continuing this app. The sandbox contract
(`/workspace/AGENTS.md`) still owns ports, preview, skills, and deploy. This
file owns **what HelloBrisa is**, how it should look and speak, and where the
code lives.

Do not rewrite the landing or desk “from scratch.” Extend them.

---

## 1. What this is

**HelloBrisa** is a voice AI receptionist for independent hotels. The AI is
**Brisa**. She sits on the hotel’s published phone number (and later SMS /
WhatsApp / iMessage) and handles the desk: availability, holds, bookings,
amenities, dinner, late checkout. A human (**Clara**, in the demo house)
jumps in when something needs a person.

The demo house is **Casa Luz** — a 38-room boutique hotel on the Andalusian
coast (Málaga). Do not invent a second property or rebrand.

Two guest-facing surfaces exist today:

| Route | What | Auth |
| --- | --- | --- |
| `/` | Marketing landing + “Talk to Brisa” | Public |
| `/demo` | Front-office desk (inbox / thread / guest file) | Public on purpose — the demo must play unsigned-in |
| `/login` | Hotel partner sign-in (Better Auth) | Wired, not required for `/` or `/demo` |

**Do not gate `/demo` behind login** unless the user explicitly asks. The desk
is the product proof.

---

## 2. Design (non-negotiable)

Read `.grok/skills/design-ui/SKILL.md` and `references/refined-ui.md` before
any UI change. Then obey **this** palette — not the skill’s dark example tokens.

### Tokens — `src/styles.css` `@theme` is the source of truth

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#F6F1E8` | Page, linen |
| `surface` | `#FFFCF7` | Panels, bubbles, cards |
| `fg` | `#1C1814` | Ink |
| `muted` | `#6F675C` | Meta, secondary |
| `primary` | `#2F6B5D` | Sage — primary actions, Brisa, live |
| `primary-fg` | `#F6F1E8` | Text on sage |
| `accent` | `#C45C38` | Terracotta — unread, “needs you”, sparingly |
| `sand` | `#E8DFD0` | Chips, Brisa bubbles, hover wash |
| `line` | `#1C18141F` | Hairline borders |

**≤ 5 chromatic colours.** No extra hues. No purple, gold, neon, or WhatsApp
green. Channel identity is **icon + label**, not brand colours.

**Type**

- Body: **Figtree** (`font-sans`)
- Display / names / headlines: **Fraunces** (`font-display`), weight 400–600,
  italic for the wordmark’s “Brisa” and quiet captions
- Section kicker: `text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted`
- Tabular nums on times, refs, occupancy

**Chrome**

- Pill buttons (`rounded-full`), tap height **11** (44px)
- Concentric radii: large shells, smaller inners, pills only for chips/buttons
- Elevation is `shadow-[var(--shadow-border)]`, not drop-shadow soup
- Thin `.desk-scroll` scrollbars; `.live-bars` for live voice only
- Motion: 150–250ms opacity/transform; respect `prefers-reduced-motion`
- No emoji in chrome, copy, empty states, or buttons
- No gradient blobs, glassmorphism, or illustration filler
- Images: real JPGs in `public/images/` (`terrace`, `lobby`, `breeze`) with
  `crossOrigin="anonymous"`. Do not replace with placeholders.

**Voice of the UI** (same as Brisa, slightly drier in chrome)

Warm, precise, unhurried. Short. No “✨ magic”, no “AI-powered”, no exclamation
marks in product chrome. Buttons are verbs: Jump in, Confirm, Send, Complete,
Talk to Brisa, Open the desk.

Brisa (phone): spoken sentences, under ~60 words, no markdown, no lists, no
emoji. Clara (desk compose): same house, first person, one or two sentences.

If a new screen does not look like it belongs on the same linen table as the
landing, it is wrong.

---

## 3. Architecture (this workspace)

TanStack Start + React 19 + Tailwind v4 + Vite 8. Auth, PGLite/Neon, and xAI
are already wired. **Do not add a second stack.**

```
src/routes/
  index.tsx          landing
  demo.tsx           desk page (state lives here)
  login.tsx          hotel sign-in
  __root.tsx         document shell — keep PreviewHostBridge + AuthProvider
src/components/landing/   marketing + waveform + talk panel
src/components/desk/      inbox, thread, compose, guest-panel, approvals
src/components/ui/        button (and more shadcn only if needed)
src/lib/brisa/            voice: script, askBrisa, speakBrisa, audio
src/lib/desk/             types, mock data, completeDeskReply
src/lib/auth/             Better Auth — do not reinvent
src/lib/db.ts             Neon if DATABASE_URL, else PGLite
src/styles.css            tokens
public/images/            terrace.jpg lobby.jpg breeze.jpg
public/audio/             guest-1..3.mp3 brisa-1..3.mp3
```

GitHub export: [gianpaj/grok-brisa-demo](https://github.com/gianpaj/grok-brisa-demo)
(`master`) is a **standalone Vite SPA** of the same UI, without TanStack Start,
auth, or server functions. Desk Complete there uses local snippets. Prefer
continuing work **in this workspace**; sync the export when asked.

### AI (xAI) — spend rules

`XAI_API_KEY` is injected. Use `createServerFn` only. Never `VITE_` the key.

| Fn | File | When |
| --- | --- | --- |
| `askBrisa` | `src/lib/brisa/actions.ts` | Talk panel — guest chat |
| `speakBrisa` | same | TTS, voice `carina` |
| `completeDeskReply` | `src/lib/desk/suggest.ts` | Desk **Complete** button only |
| `translateDeskReply` | same | Desk **Translate** button only |

- Model: `grok-4.5`
- **User-initiated only.** No per-keystroke, no page-load, no polling loops
- Cap tokens (chat ~180, complete ~90, translate ~120)
- Degrade if the key is missing — never crash the UI
- Tab-to-accept on the desk uses **local snippets** (`localSnippets` in
  `data.ts`); Complete may call Grok
- Translate: local phrase map first (`localTranslate`), Grok only if the
  draft is not a known snippet. Target is the thread’s `lang`.

### Auth

Better Auth is present. Landing and desk stay public. `/login` is for a future
hotel-staff session. When you persist real desk data, isolate by hotel/user
(`src/lib/auth/isolation.server.ts`) — do not mix properties.

---

## 4. Mock data (the seam)

**All hotel data is in-memory.** The desk seeds from `src/lib/desk/data.ts`
into React state in `src/routes/demo.tsx`. Types in `src/lib/desk/types.ts`
are the contract. Keep them stable — a future DB and PMS adapter should map
onto these shapes, not the other way around.

### House

```
Casa Luz · Clara · Front desk · Sunday morning · 86% occupied
```

### Guests (demo)

One **inbox row per guest**. All of their channels sit on that row (voice, SMS,
iMessage, WhatsApp, email, Booking.com). Agent mode on = Brisa handles the
thread; off = Clara.

| Id | Name | Channel(s) | Lang | Status | Why they exist |
| --- | --- | --- | --- | --- | --- |
| `g-sophie` | Sophie Laurent | voice | French | live | Incoming tonight; pending **hold sea double** |
| `g-james` | James Okonkwo | SMS | English | needs_you | Late checkout; wants it **in writing** |
| `g-marta` | Marta Ruiz | iMessage | Spanish | needs_you | Parking + **boat** + **table for four at eight** (pending); family, returning |
| `g-helen` | Helen Cho | email | English | needs_you | Early check-in 08:00 |
| `g-tomas` | Tomás Almeida | email | English | needs_you | Connecting rooms, family |
| `g-jonas` | Jonas Weber | SMS | German | needs_you | In-house; street noise, wants a quieter room |
| `g-luca` | Luca Moretti | Booking.com | English | brisa | OTA; add Sunday night |
| `g-nora` | Nora Lind | Booking.com | English | brisa | OTA; airport car AGP 14:45 |
| `g-elena` | Elena Voss | WhatsApp + voice | English | needs_you / resolved | Weekend booked; **taxi at nine** pending |
| `g-david` | David Park | WhatsApp | English | brisa | Returning courtyard + spa |
| `g-ana` | Ana Berg | SMS | English | resolved | Post-stay thank-you |

**Clock for relative times:** treat “now” as `2026-08-30T10:39+02:00` in the
inbox labels so the demo does not drift.

### Domain objects

- **Guest** — identity, phone, country (“flying from”), **labels**, **notes**,
  previous **stays**, current **booking**
- **Booking** — room, dates, party, rate, extras, status
  `enquiry | held | confirmed | in-house`
- **Conversation** — one channel thread: messages, **AiAction**s, snippets.
  Inbox is **guest-centric**: many conversations collapse to one row.
  Channels: `voice | sms | imessage | whatsapp | email | booking`.
  **`lang`**: `en | es | de | fr`. Brisa answers in that language. Snippets
  stay in the desk language (English) so Clara can pick them.
- **Message** — `text` is what was said (original). `textEn` is the English
  for the desk when `lang` is not English.
- **AiAction** — `fetch | hold | book | change | note`, `done | pending`.
  Optional `type` (`RequestType`), `approver`, `approvedAt`.
  Pending ones show **Confirm** (Clara). Confirming writes `approver: "Clara"`
  (or `"Brisa"` if auto-approved) and `approvedAt`, and updates booking/notes
  in page state (`a-s2` Sophie hold → `CL-48501`; `a-ma2` Marta boat;
  `a-ma3` table Saturday 20:00; `a-e4` taxi 09:00 María Zambrano).

A guest may have **several conversations**. The guest file lists all of them.

When you add a story, add a guest + conversation + at least one action. Empty
threads teach nothing.

### Replacing the mock (later — do not do this until asked)

Intended layers, when the user is ready:

```
UI (desk/*) 
  → repository (listThreads, getGuest, appendMessage, confirmAction, saveNotes)
      → now: data.ts + useState
      → next: Postgres (Neon / PGLite) 
      → later: PMS adapter-sync (inventory, rates, reservations)
```

Rules for that work, when it happens:

1. Introduce a **repository interface** first. Point the desk at it. Keep
   `data.ts` as a fixture/seed, not as UI imports scattered everywhere.
2. One hotel (`Casa Luz`) until multi-tenant is explicit.
3. PMS is an **adapter**: pull availability / reservations / guests, project
   into `Guest` / `Booking` / `AiAction`. Do not let vendor payloads leak into
   React components.
4. Sync engine is out of scope until named. No half-built Mews/Opera clients.
5. Auth isolation by property the moment anything is written to the DB.

Until then: keep mocking. It is not a bug.

---

## 5. Desk behaviour (do not lose this)

Three panes, desktop: **inbox (left, ~18rem) · thread · guest file (right, ~20rem)**.
Mobile: list → thread → guest file, back chevrons, 44px targets.

- View switch: **Inbox** / **Approvals** (manager log)
- Filters: All / Needs you / Agent (Brisa handling)
- Search guests, rooms, channels
- **Agent mode**: on = Brisa handles; off = Clara. Sending a reply turns it off.
- Jump in is the agent-off path on a live line
- Guest with several channels: tabs on the thread (Elena = WhatsApp + Voice)
- Live Sophie: after ~2.8s Brisa offers the sea double (`m-s3`) unless already
  present. Live bars while her last line contains “un instant” / “one moment”
- Compose: chips from `snippets` (desk language, English); **Tab** accepts;
  **Complete** (Grok or snippets); **Translate** (on non-English threads)
  turns the draft into the guest’s language; Enter sends (Shift+Enter newline)
- **Languages** icon at the top left of the inbox sidebar toggles original
  vs English (`HOUSE.deskLang`). Default is original so Sophie/Marta/Jonas
  read as they spoke. When on, bubbles show English with the original as a
  caption; inbox previews follow. Search matches both languages.
- Guest file: labels, flying-from, booking dl, editable notes (save on blur),
  conversations (clickable), previous stays
- Confirming a pending action writes a bubble, records who signed and when,
  and mutates booking/notes

### Approvals (manager review)

Logged guest requests live on `AiAction` (`src/lib/desk/types.ts`). The
**Approvals** view is for the house manager (Clara’s lead, or a group manager
later) — not a second product.

- Every reviewable request (table, taxi, boat, spa, hold, late checkout, early
  check-in, room move, extend, parking) appears on the log. Availability
  fetches stay on the thread only.
- **Waiting** vs **Signed**. Pending on a `needs_you` thread = Needs Clara;
  pending on Brisa/live = Awaiting guest.
- **Who signed** is `approver` (`Clara` | `Brisa`). **How long** is
  `approvedAt − at` (pending uses `DESK_NOW` = Sunday 10:39).
- A **gap** is an unsigned request waiting ≥ 45 minutes (`GAP_MINUTES`).
  Jonas’s room move overnight, Elena’s taxi at nine, Nora’s airport car are
  the teaching gaps. Typical desk sign-off is the median of Clara’s signed
  waits (Elena’s table 7m, David’s spa 16m).
- **Auto approve**: a `Set<RequestType>` in `demo.tsx` state, seeded with
  `DEFAULT_AUTO_APPROVE` (`late_checkout`, `parking`). Toggle lives on the
  request detail. Turning a type on signs current pending of that type as
  Brisa and records them. Safe types skip the desk next time; the log still
  keeps who signed. The list header shows `Auto: Late checkout · Parking`.
- Demo beats: Marta **table for four at eight** (`a-ma3`, pending); Elena
  **taxi at nine** (`a-e4`, pending). Confirm from the thread or the log.

Helpers: `flattenApprovals`, `approvalSummary`, `waitLabel` in `data.ts`.
UI: `src/components/desk/approvals.tsx`. Stay on mock data. Do not add a
PMS or a second visual language.

Landing links to `/demo` (nav Desk, how-it-works, for-hotels, footer). Keep
those when you touch the marketing page.

Hero waveform (`components/landing/waveform.tsx`) is a **canvas** driven by
Talk panel state / analyser. Do not replace it with CSS bars. Desk live
indicator is the small `.live-bars` only.

---

## 6. What to build next vs later

**In scope when the user asks for product work**

- Sharper desk flows (handoff, more houses, more channels) still on mock data
- Staff-only notes, assignment, “Brisa vs Clara” clarity
- Landing polish that stays on-token
- Persist mock → DB **behind a repository**, still seeded with Casa Luz
- Gate hotel-admin screens on `/login` **without** locking `/demo`

**Out of scope until explicitly requested**

- Real PMS adapters / sync engine (Mews, Opera, Cloudbeds, etc.)
- Multi-hotel orgs, billing, onboarding wizards
- A second visual language or “dashboard kit” (no sidebar-from-a-template)
- Emoji, extra colour, new display fonts
- Auto-complete on every keystroke
- Replacing Brisa’s voice or the Casa Luz story

---

## 7. Quality bar

- Match existing Figtree / Fraunces / linen / sage. Eyeball `/` and `/demo`
  after UI changes (desktop 1280 and mobile 390).
- Typecheck. No unused imports (GitHub export `tsconfig` is strict).
- Keep copy in the house voice. If you would not say it at a quiet front desk
  in Málaga, do not put it on screen.
- One primary action per view. Cut decoration.
- When unsure, add a thread to the mock — not a new page.

Casa Luz, Brisa, Clara. Linen and sage. The desk without the desk.
