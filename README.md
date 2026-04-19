# StageProps — Props Rental Website

A full-featured props rental website built with React + Vite.  
Deployable for free on Vercel. Images hosted on Cloudinary. No backend needed.

---

## What This Is

A ready-to-use rental catalogue website for a props/equipment rental business. Customers browse items and contact you via WhatsApp or phone. You manage inventory through a password-protected admin panel.

**Stack:** React, Vite, localStorage (no database), Cloudinary (image hosting), Vercel (hosting)

---

## Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- A free [Cloudinary](https://cloudinary.com) account
- A free [Vercel](https://vercel.com) account (for deployment)
- A [GitHub](https://github.com) account (to connect to Vercel)

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Your Business Details

Edit `src/config/site.js` — this controls everything visible on the site:

```js
export const SITE_CONFIG = {
  businessName: "Your Business Name",
  tagline: "Your Tagline Here",
  phone: "+94 77 XXX XXXX",
  whatsapp: "94XXXXXXXXX",      // digits only — no +, no spaces
  email: "you@yourdomain.com",
  address: "Your City, Country",
  instagram: "@yourhandle",
  adminPassword: "choose-a-strong-password",   // CHANGE THIS before deploying
};
```

You can also edit the `CATEGORIES` list in the same file to match what your business rents out.

---

## 3. Set Up Cloudinary (Image Hosting)

Cloudinary's free tier gives you 25 GB storage and 25 GB bandwidth per month — more than enough for a small rental business.

### Step 1 — Create a Cloudinary account

Go to [cloudinary.com](https://cloudinary.com) and sign up for free.

### Step 2 — Get your Cloud Name

After logging in, your **Cloud Name** is shown on the dashboard home page (top left area). Copy it.

### Step 3 — Create an Upload Preset

1. In the Cloudinary dashboard, go to **Settings** (gear icon, top right)
2. Click the **Upload** tab
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Set **Signing mode** to **Unsigned**
6. Give it a name (e.g. `prop_preset`)
7. Optionally set a folder name to keep uploads organised
8. Click **Save**

### Step 4 — Create the `.env` file

Create a file named `.env` in the project root:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name_here
```

Replace the values with what you copied in steps 2 and 3.

> **Do not commit `.env` to git.** It is already in `.gitignore`. Keep your credentials private.

---

## 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 5. Add Your Inventory (Admin Panel)

1. Go to `/admin` on the site
2. Enter the password you set in `site.js`
3. Click **Add Prop** to add your first item

### Uploading Images

In the Add/Edit form, each image field has an **Upload** button:

1. Click **Upload** next to an image field
2. Select a photo from your computer
3. The image uploads directly to Cloudinary and the URL fills in automatically
4. A thumbnail preview appears on the right

You can add multiple images per prop using **Add another image**.

**Recommended image specs:**
| | |
|---|---|
| Dimensions | 1200 × 900 px (4:3 landscape) |
| Max file size | 10 MB |
| Formats | JPG, PNG, or WebP |
| Naming | `furniture_vintage-sofa_main_20240418.jpg` |

### Data Storage

All inventory data is saved in your browser's **localStorage**. This means:
- Changes are saved automatically
- They persist across page refreshes
- They are tied to the browser/device you use for admin work

**To back up your inventory:** use the **Export JSON** button in the admin panel. This downloads a `.json` file you can re-import later or on another device.

---

## 6. Deploy to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **Add New Project**
3. Import your GitHub repository
4. Framework preset: **Vite** (auto-detected)
5. Before deploying, click **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `VITE_CLOUDINARY_CLOUD_NAME` | your cloud name |
   | `VITE_CLOUDINARY_UPLOAD_PRESET` | your preset name |

6. Click **Deploy**

The site will be live at `your-project.vercel.app`.

> `vercel.json` is already configured for SPA routing so all page routes work correctly.

### Step 3 — Custom Domain (Optional)

In the Vercel dashboard → your project → **Settings** → **Domains** → add your domain and follow the DNS instructions.

---

## Project Structure

```
src/
├── config/
│   └── site.js              ← Business name, phone, categories, admin password
├── data/
│   └── props.json           ← Sample data loaded on first visit (can be reset)
├── pages/
│   ├── HomePage.jsx         ← Hero section + featured props
│   ├── BrowsePage.jsx       ← Full catalogue with search + filters
│   ├── ItemDetailPage.jsx   ← Single prop with image gallery + contact CTA
│   ├── AdminPage.jsx        ← Inventory management dashboard
│   └── AdminLogin.jsx       ← Password gate
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PropCard.jsx         ← Card used in browse grid
│   └── PropForm.jsx         ← Add/edit form with Cloudinary image upload
├── hooks/
│   └── useProps.js          ← Global state + localStorage persistence
└── utils/
    ├── cloudinary.js        ← Upload function + URL optimizer
    └── storage.js           ← Load/save/export/import inventory
```

---

## Scaling Later

| Need | Solution |
|---|---|
| Admin on multiple devices | Replace `storage.js` with [Supabase](https://supabase.com) (free tier) |
| Booking / enquiry form | Add [Formspree](https://formspree.io) or [EmailJS](https://emailjs.com) |
| Analytics | Add [Vercel Analytics](https://vercel.com/analytics) (one line of code) |
| Multiple admin users | Add Supabase Auth |
| Custom domain | Add in Vercel dashboard → Domains |

