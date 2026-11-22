# The VaguePost ✦

> *"Raw thoughts, midnight ideas, visual fragments & vague musings from Ansh."*

A playful, interactive personal website built for **Ansh Srivastava** to broadcast thoughts, ideas, images, and GIFs, while welcoming anonymous reactions and comments from visitors without requiring any sign-in.

---

## ✨ Features

- **Owner-Only Broadcasting**:
  - Only **Ansh** can publish thoughts, ideas, images, or GIFs.
  - Secret Author Studio unlocked via author passkey (default: `vaguepost2026`, configurable in `.env.local`).
  - Rich creator studio with tags, image uploader, GIF picker, and live previews.
- **📌 Pinned Thoughts (Max 5)**:
  - Feature up to **5 thoughts** pinned prominently at the top of the feed with dedicated golden/fuchsia holographic cards.
  - Automatic validation preventing more than 5 pinned thoughts, complete with remaining slot indicators.
- **Zero Sign-in for Visitors**:
  - Visitors can immediately read all thoughts, filter by tags (`Thought`, `Idea`, `Hot Take`, `Late Night`, `Visual Fragment`), or search by keyword.
  - Instant like button with confetti explosions and sound feedback.
- **Sequential Commenter Numbering (`User #1`, `User #2`, `User #3`...)**:
  - First visitor to comment is assigned **User 1**.
  - Second commenter becomes **User 2**, third becomes **User 3**, and so forth.
  - Visitors can comment using **text, uploaded images, and animated GIFs**.
  - Comments from Ansh feature a verified **Author ✦** crown badge.
- **Playful Design & Typography**:
  - Styled with **Kanit** and **JetBrains Mono** fonts matching [Ansh's portfolio](https://anshsrivas1ava.vercel.app/).
  - Deep dark aesthetic with electric fuchsia, cyan, and neon emerald accents.
  - Synthesized Web Audio API sound effects (pops, chimes, pins) with mute toggle.
- **Zero-Dependency Native Persistence**:
  - Powered by Node.js native `DatabaseSync` (`node:sqlite`) for robust, atomic, and fast storage.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file:
```env
ADMIN_PASSKEY=vaguepost2026
NEXT_PUBLIC_SITE_NAME="The VaguePost"
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Author Access

1. Click the **Author** button (or lock icon) in the header or footer.
2. Enter your author passkey (default: `vaguepost2026`).
3. Click **Unlock Studio**.
4. You will now see:
   - Floating "+ Post Thought" button
   - Pin / Unpin controls on every card (up to 5 thoughts)
   - Delete buttons
   - Option to reply to comments officially as **Ansh (Author) ✦**

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom neon accents & Kanit font
- **Animations**: Framer Motion & Canvas Confetti
- **Icons**: Lucide React
- **Audio**: Web Audio API (Synthesized in-browser sound effects)
- **Database**: Native SQLite (`node:sqlite`)
