<p align="center">
  <img src="src/assets/logo-full.png" alt="TECHSHASTRA Logo" width="200" />
</p>

<h1 align="center">TECHSHASTRA</h1>

<p align="center">
  <strong>Innovate · Create · Dominate</strong><br/>
  The official Technical & Entrepreneurship Club of Uttarakhand Technical University, Dehradun
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase" />
</p>

---

## 🏠 Overview

TECHSHASTRA is the dynamic website for UTU Dehradun's premier technology club. It serves as the club's **public face**, **content management system**, and **operational hub** — showcasing projects, events, research, team identity, and enabling membership applications and certificate distribution.

### Key Highlights

- 🎨 **Glassmorphism design** with light/dark theme support
- 🚀 **In-browser code execution** via StackBlitz SDK & Pyodide
- 📜 **Certificate generation engine** with Excel import and bulk email sending
- 📊 **Admin dashboard** for managing all website content
- 🔬 **Research hub** for papers and books with PDF upload/download
- 🔐 **Supabase Auth** for protected admin access

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/remix-of-shastra-hub.git
cd remix-of-shastra-hub

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your Supabase URL and anon key:
#   VITE_SUPABASE_URL=your_url
#   VITE_SUPABASE_ANON_KEY=your_key

# Start development server
npm run dev
```

---

## 🗂️ Features

| Feature | Route | Description |
|---------|-------|-------------|
| **Homepage** | `/` | Hero, About, Mentor, Domains, Team, Gallery preview, Contact |
| **Projects** | `/projects` | Project showcase with live code runner |
| **Events** | `/events` | Upcoming & past events with registration |
| **Blog** | `/blog` | News, tutorials, and announcements |
| **Publications** | `/publications` | Research papers & books |
| **Resources** | `/resources` | Curated learning materials |
| **Gallery** | `/gallery` | Photo gallery with lightbox |
| **FAQ** | `/faq` | Frequently asked questions |
| **Achievements** | `/achievements` | Club milestones & awards |
| **Join** | `/join` | Multi-role membership application |
| **Admin** | `/admin` | Content management + certificate sender |
| **Auth** | `/auth` | Login / signup (Supabase) |

📚 **Detailed documentation for every feature is in the [`docs/`](docs/README.md) folder.**

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 · TypeScript 5 · Vite 5 |
| **Styling** | Tailwind CSS 3 · shadcn/ui (49 components) |
| **Animations** | Framer Motion |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Client Storage** | localStorage (Projects, Blog, Gallery, Publications) |
| **Emails** | EmailJS (Certificate distribution) |
| **Live Code** | StackBlitz SDK · Pyodide |
| **Spreadsheets** | SheetJS (xlsx) |
| **Forms** | React Hook Form · Zod |

---

## 📁 Project Structure

```
remix-of-shastra-hub/
├── docs/                # 📚 Feature documentation (19 files)
├── public/              # Static assets
├── src/
│   ├── assets/          # Images (team photos, hero bg, logo)
│   ├── components/      # 14 custom + 49 shadcn/ui components
│   │   └── ui/          # shadcn/ui component library
│   ├── hooks/           # use-mobile, use-toast
│   ├── integrations/    # Supabase client config
│   ├── lib/             # Data stores & utilities
│   │   ├── projectStore.ts
│   │   ├── blogStore.ts
│   │   ├── galleryStore.ts
│   │   ├── publicationStore.ts
│   │   └── utils.ts
│   ├── pages/           # 18 route pages
│   ├── App.tsx          # Root routing
│   └── main.tsx         # Entry point
├── supabase/            # Database migrations
├── package.json
└── README.md            # ← You are here
```

---

## 👥 Core Team

| Name | Role | Responsibility |
|------|------|----------------|
| **Dr. Sandeep Singh Negi** | Mentor | Academic coordination & founding vision |
| **Akhilesh Raje** | President | Strategy, architecture & admin-level authority |
| **Amitesh Kumar** | Vice-President | Operations, culture & internal orchestration |
| **Pratyush Shrivastava** | CTO | Technical infrastructure & systems leadership |

---

## 📖 Documentation

Comprehensive docs are in the **[`docs/`](docs/README.md)** folder:

| # | Document | Topic |
|---|----------|-------|
| 01 | [Hero & Landing](docs/01-HERO-AND-LANDING.md) | Homepage hero section |
| 02 | [About Section](docs/02-ABOUT-SECTION.md) | Mission, vision, stats |
| 03 | [Mentor Spotlight](docs/03-MENTOR-SPOTLIGHT.md) | Dr. Negi's profile |
| 04 | [Domains](docs/04-DOMAINS.md) | 9 tech domains |
| 05 | [Leadership Team](docs/05-LEADERSHIP-TEAM.md) | President, VP, CTO |
| 06 | [Gallery](docs/06-GALLERY.md) | Photo gallery system |
| 07 | [Contact](docs/07-CONTACT.md) | Contact info & social |
| 08 | [Projects](docs/08-PROJECTS.md) | Project showcase + live runner |
| 09 | [Events](docs/09-EVENTS.md) | Events & workshops |
| 10 | [Blog & News](docs/10-BLOG-AND-NEWS.md) | Content management |
| 11 | [Publications](docs/11-PUBLICATIONS.md) | Research papers & books |
| 12 | [Resources](docs/12-RESOURCES.md) | Curated learning links |
| 13 | [FAQ](docs/13-FAQ.md) | Frequently asked questions |
| 14 | [Achievements](docs/14-ACHIEVEMENTS.md) | Club milestones |
| 15 | [Join / Membership](docs/15-JOIN-MEMBERSHIP.md) | Application form |
| 16 | [Admin Panel](docs/16-ADMIN-PANEL.md) | Content dashboard |
| 17 | [Certificate Sender](docs/17-CERTIFICATE-SENDER.md) | Bulk cert generation |
| 18 | [Authentication](docs/18-AUTH.md) | Supabase auth |
| 19 | [Architecture](docs/19-ARCHITECTURE.md) | Design system & patterns |

---

## 🚀 Available Scripts

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 📄 License

This project is maintained by **TECHSHASTRA, UTU Dehradun**. All rights reserved.

---

<p align="center">
  <em>Built with ❤️ by the TECHSHASTRA team</em>
</p>
