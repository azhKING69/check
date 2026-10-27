# 🎓 Placement Test Tracker & Notice Board with Clash Radar

A real-time, mobile-first campus placement notice board that keeps your company tests sorted chronologically, alerts you to exam slot clashes between you and your girlfriend, and enables instant 10-second updates from your phone.

---

## ✨ Features Built

- **📅 Chronological Notice Board:** Tests are automatically sorted by test date and time (soonest upcoming first).
- **⏱️ Live Countdown Hero:** Highlights the next immediate test with a real-time countdown timer (hours, minutes, seconds).
- **🚨 Exam Clash Radar:**
  - **Direct Slot Clash:** Alerts you if you and your girlfriend have overlapping exam slots (`StartA < EndB`).
  - **Same-Day Notice:** Warns when tests fall on the same date even if timings are separate.
- **🎓 Multi-College / Track Switcher:**
  - `🎓 My College` (Clean notice board shareable with your college batchmates).
  - `🌸 Her College` (Clean notice board shareable with her college batchmates).
  - `⚡ Both & Clashes` (Combined comparative timeline with clash badges).
- **📱 Mobile-First Admin Updates:**
  - Tap the **Lock** icon & enter your 4-digit Master PIN (`1234`).
  - Adds a floating **`+`** button on mobile to post new tests in 10 seconds.
  - Inline edit and delete capabilities.
  - Automatically remembers authentication on your personal device.
- **🗓️ 1-Click Calendar Sync:** Add any test to Google Calendar or download `.ics` for Apple Calendar / Outlook.
- **🔍 Fast Search & Categorization:** Switch between *Upcoming*, *Past*, or *All*, and search by company or profile name.
- **☁️ 24/7 Firebase Firestore Sync:** Real-time updates without page reload, never pauses or sleeps.
- **📲 PWA (Add to Home Screen):** Can be installed to iPhone or Android home screen for native app-like experience.

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Default Admin PIN:** `1234` (Change in `.env.local`).

---

## 🌐 Free 24/7 Cloud Hosting (Vercel)

Deploy to Vercel in 1 click for a public link (e.g. `https://my-placements.vercel.app`):

1. Push this folder to a GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete placement notice board & clash radar"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) &rarr; Click **"Add New Project"** &rarr; Select your GitHub repository &rarr; Click **"Deploy"**.
3. Your notice board will be live with a free SSL (HTTPS) link accessible to you and all batchmates!

---

## ☁️ Setting Up 24/7 Firebase Cloud Sync (2 Minutes)

To enable live real-time sync across everyone's phone without Supabase's pause limit:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Create a project**.
2. Click **Build &rarr; Firestore Database &rarr; Create database**. Choose **Start in test mode** (allows read and write).
3. In Project Overview, click the Web icon (`</>`) to register an app.
4. Copy the keys and add them into your Vercel Environment Variables (or `.env.local`):
   ```env
   NEXT_PUBLIC_ADMIN_PIN=1234
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456...
   NEXT_PUBLIC_FIREBASE_APP_ID=1:12345:web:...
   ```
5. Done! Changes saved on your phone will reflect on your girlfriend's and batchmates' screens **in under a second**.

---

## 📱 Adding to Phone Home Screen (PWA)

- **iPhone (Safari):** Open the website link &rarr; Tap the Share icon (box with arrow) &rarr; Scroll down & tap **"Add to Home Screen"**.
- **Android (Chrome):** Open the website link &rarr; Tap the 3 dots menu &rarr; Tap **"Add to Home screen"** or **"Install app"**.
