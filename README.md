# Find Your Vibe — Cannabis Explorer

Personalized cannabis recommendation tool powered by The Human Variable research data. Built for the Apiverde Health / UFCW pilot.

## Deploy to Vercel

### Option A: Quick deploy (recommended)

1. Push this folder to a new GitHub repo:
   ```bash
   cd vibe-finder
   git init
   git add .
   git commit -m "initial commit"
   gh repo create vibe-finder --public --push --source=.
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your `vibe-finder` repo
4. Click **Deploy** — no config needed, Vercel auto-detects Next.js

Your site will be live at `vibe-finder-[hash].vercel.app`. You can add a custom domain later.

### Option B: Vercel CLI

```bash
npm i -g vercel
cd vibe-finder
vercel
```

Follow the prompts. Done in 60 seconds.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What's in here

- **Splash screen** — 3-second sell before the user dives in
- **5-step vibe quiz** — mood → experience level → method → timing → avoidances
- **Smart branching** — flower/vape gets strain cards, edibles get format + dosage + onset/duration
- **"Open to anything"** shows both flower and edible recs
- **Budtender cheat sheet** — dynamically generated natural-language script to show at the dispensary
- **Green Goods CTA** — drives foot traffic to UFCW stores
- **THV social proof** — "96% of people like you loved this"
- **Check-in opt-in** — closes the data feedback loop for THV efficacy tracking
- **Share button** — native share on mobile, clipboard copy on desktop

## Notes

- Strain and edible data is currently mocked — ready to connect to real product data from Amber/Curable
- Match percentages will be powered by actual THV research data once the pilot generates user feedback
- The check-in flow needs a backend to actually send follow-ups (Airtable, Supabase, etc.)
