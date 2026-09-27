# Syntax — Abdullah Creative Portfolio & Studio CMS

A production-ready, editorial-grade creative portfolio web application with a secure private content management system (CMS), engineered from the **Syntax Studio** design system specification.

---

## ✦ Overview

**Syntax** is designed for independent creative directors, graphic designers, and brand identity studios. It provides:
1. **Public Portfolio Website:**
   - Swiss editorial minimalism with electric violet accents and glassmorphic depth.
   - **Interactive 3D Perspective Floating Carousel** with mathematical cubic-bezier transforms, keyboard navigation, and mobile touch swipe.
   - Project archive with dynamic categorization, instant search, and detailed case studies.
   - Colophon, studio metrics, and specialized service offerings.
   - Project request & commission inquiry form syncing directly to the CMS.
2. **Private Admin Studio CMS (`/admin`):**
   - Protected by **Supabase Authentication** & **Row Level Security (RLS)** with database-level role verification (`profiles.role = 'admin'`).
   - Real-time dashboard KPI metrics (Total Works, Active Services, Total Inquiries, Priority Review tasks).
   - Complete project CRUD (create, edit, publish/draft toggle, feature in carousel, delete with safety confirmation).
   - Drag-and-drop media asset manager backed by **Supabase Storage** (`portfolio-assets` bucket).
   - Inquiries management inbox with status progression (`new` → `in_progress` → `completed`).
   - Site settings manager for headline, bio, studio metrics, and contact channels.

---

## ✦ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router v6
- **Typography:** Space Grotesk (Headings/Display), Hanken Grotesk (Body), JetBrains Mono (Technical microcopy)
- **Backend & Auth:** Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Asset Storage:** Supabase Storage (Dedicated `portfolio-assets` bucket with MIME & size restrictions)

---

## ✦ Getting Started

### 1. Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or `v10+`

### 2. Installation
```bash
git clone <repository-url>
cd Syntex
npm install
```

### 3. Environment Configuration
Copy the example environment configuration:
```bash
cp .env.example .env
```

Configure your Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key-here
```
> **Security Note:** Never expose `SUPABASE_SERVICE_ROLE_KEY` in the client frontend. Only the public anon key should be provided.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Supabase Backend Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings -> API**, copy your **Project URL** and **anon public key** into `.env`.

### Step 2: Run Database Migrations
1. In the Supabase Dashboard, navigate to the **SQL Editor**.
2. Open the migration file: `supabase/migrations/20260927000000_syntax_schema.sql`.
3. Paste and run the entire SQL script.
   This script will:
   - Create tables: `profiles`, `projects`, `project_images`, `inquiries`, `site_settings`.
   - Create the `is_admin()` security definer function.
   - Enable **Row Level Security (RLS)** on all tables.
   - Configure public read policies for published projects and settings.
   - Configure restricted admin policies requiring authenticated admin role for inserts, updates, and deletions.
   - Create the `portfolio-assets` storage bucket with upload and read policies.

### Step 3: Seed Initial Data
1. In the SQL Editor, run `supabase/seed.sql`.
2. This populates initial featured projects, inquiries, and site settings directly matching the Stitch design.

### Step 4: Create an Admin Account
1. In the Supabase Dashboard, navigate to **Authentication -> Users**.
2. Click **Add User -> Create User**:
   - Email: `admin@syntaxstudio.design` (or your preferred admin email)
   - Password: Choose a secure password.
   - Check **Auto Confirm User?** = Yes.
3. In the SQL Editor, link this user to the authorized `profiles` table with the `admin` role:
   ```sql
   INSERT INTO public.profiles (id, email, role, full_name, avatar_url)
   SELECT id, email, 'admin', 'Abdullah', '/assets/portrait.png'
   FROM auth.users
   WHERE email = 'admin@syntaxstudio.design'
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

---

## ✦ Verification & Testing Checklist

- [x] **Public Portfolio:**
  - Responsive 12-column grid on desktop, 4-column on mobile.
  - Interactive 3D Perspective Floating Carousel: Prev, Next, touch swipe, keyboard arrows, and card click centering.
  - Case study detail pages dynamic routing (`/projects/:slug`).
  - Contact request form validates and creates new records in the database.
- [x] **Admin Authentication & Route Protection:**
  - Unauthorized visitors attempting to navigate to `/admin/*` are automatically redirected to `/admin/login`.
  - Authenticated non-admin accounts are blocked with an "Access Denied" screen.
  - Session persistence and clean logout.
- [x] **CMS CRUD Operations:**
  - Real database metrics update automatically.
  - Create new project with title, auto-slug generator, category, cover image upload, and draft/published toggle.
  - Modifying project data immediately syncs to the public portfolio.
  - Project deletion includes confirmation modal and prevents orphaned records.
  - Inquiries status can be transitioned from `new` to `in_progress` to `completed`.
- [x] **Storage & Media:**
  - Drag-and-drop upload zone uploads images to Supabase Storage `portfolio-assets`.
  - Restricts MIME types (JPEG, PNG, WEBP) and enforces a 10MB limit.

---

## ✦ Deployment

To create a production build:
```bash
npm run build
```
The output will be generated in the `dist/` directory, ready for deployment to Vercel, Netlify, Cloudflare Pages, or AWS S3 + CloudFront.
