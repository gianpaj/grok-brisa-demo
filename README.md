# HelloBrisa

Landing page and front-desk demo for **HelloBrisa** — a voice AI hotel receptionist.

Built with Grok (xAI App Builder). Light linen palette, Mediterranean photography, a living waveform when Brisa or a guest is “speaking,” and a back-office desk for the human who jumps in.

## Features

- **Hero conversation** — scripted booking call with canvas waveform (idle / guest / Brisa states)
- **Talk to Brisa** — type or use the mic; local demo replies (no API key required in this export)
- **Desk (`/demo`)** — Casa Luz front office
  - One inbox per guest, all channels (voice, SMS, iMessage, WhatsApp, email, Booking.com)
  - Agent mode (Brisa handles) vs Clara at the desk
  - Guest file: booking, extras, labels, notes, previous stays
  - **Approvals** — request log, who signed, how long it took, gaps, auto-approve
  - **Languages** — Sophie (French), Marta (Spanish), Jonas (German); sidebar toggle for English; Translate on compose
- **Product sections** — how it works, what she handles, for hotels
- **Editorial photography** — terrace, lobby, breeze stills

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Lucide icons

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Desk is at `/demo`.

```bash
npm run build
npm run preview
```

## Notes

This is a **frontend demo** of the product surface. The original Grok App Builder build also wired:

- xAI chat (`grok-4.5`) + TTS (`carina`) for live voice replies
- TanStack Start, auth, and share-card assets
- Desk Complete / Translate via Grok

Those server paths are not required to explore the UI here. Desk Complete and Translate use house snippets locally. Wire your own API if you want real voice again.

## License

Demo code for personal / portfolio use.
