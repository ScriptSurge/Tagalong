# Tagalong

Tagalong is a Vancouver meetup app for finding and hosting small in-person activities in the next couple of days. Guests browse plans, request a seat, and chat once they are in. Hosts approve requests and publish new meetups.

This repository is a React prototype. It runs in the browser inside a phone frame. It is not an App Store app yet.

## Run it locally

Requires Node.js.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Put the Supabase project URL and the public publishable key in `.env.local`. Do not commit that file or the secret key. `.env.example` only has placeholders.

On a phone on the same Wi-Fi, open `http://<your-mac-lan-ip>:3000`.

## What we have done

Work so far is on the `React` branch, cut from `main`.

- Built the clickable product loop: phone signup, profile setup, Explore, activity details, join requests, group chat, host tools, and a hosting wizard.
- Seeded the demo with Vancouver people and activities (coffee, walks, yoga, runs, drinks, picnics).
- Connected the app to Supabase. Profiles, activities, participants, messages, notifications, and reports live in Postgres. The table definitions are in `supabase/schema.sql`.
- A refresh loads that shared data again. The top bar shows the saved profile name instead of the original demo name.
- The signup code on screen is still a demo. Any code continues, and a new profile currently reuses the same demo user id.

## Project layout

| Path | Role |
| --- | --- |
| `src/App.tsx` | Screens, join and host actions, load and save |
| `src/components/` | Signup, Explore, details, chat, hosting, profile |
| `src/lib/supabase.ts` | Browser client (publishable key only) |
| `src/lib/database.ts` | Read and write the shared tables |
| `src/data.ts` | Sample people and activities used to fill an empty database |
| `supabase/schema.sql` | Tables and access policies |

## Not done yet

Sign-in is not real SMS. Database policies still allow the public key to read and write every row. Saves replace the whole snapshot, so this is not safe for many people at once. Time and map pins are demo values. Plus is a toggle, not a subscription. There is no iOS build yet.
