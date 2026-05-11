# Wings Global School - School Management Platform

A production-grade, scalable, full-stack school management platform built with React, Firebase, and Cloudinary.

## 🌟 Features

### Public Website (11 Pages)
- **Home** - Full-width hero slider, announcements ticker, featured content, stats, gallery preview
- **About** - School mission, vision, core values, and history
- **Academics** - Programs (Pre-K to Grade 12), curriculum, and facilities
- **Faculty** - Searchable faculty directory with subject filters
- **Gallery** - Photo/video gallery with lightbox and category filters
- **News & Events** - Blog-style news and upcoming events calendar
- **Downloads** - Document repository with file type filtering
- **Admissions** - Online admission inquiry form with process steps
- **Contact** - Contact form, Google Maps embed, FAQ section
- **Privacy Policy** - Data protection and user rights information
- **Terms of Service** - Legal terms and conditions

### Admin Dashboard
- **Dashboard** - Overview with statistics and recent activity
- **Hero Slider** - Manage homepage hero slides with image upload, title, subtitle, CTA, order, and visibility
- **Full CRUD** for:
  - Announcements
  - News Articles
  - Events
  - Faculty Members
  - Gallery Items
  - Downloads
- **Submissions Management** for:
  - Admission Applications
  - Contact Messages

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS v4 + ShadCN UI Components
- **Routing**: React Router DOM v6
- **Backend Services**: Firebase (Auth + Firestore + Analytics)
- **Media Storage**: Cloudinary
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/            # Header, Footer, AdminLayout
│   └── ui/                # Reusable UI components (Button, Card, Dialog, etc.)
├── config/
│   ├── firebase.js        # Firebase configuration
│   └── cloudinary.js      # Cloudinary configuration
├── context/
│   └── AuthContext.jsx    # Authentication context provider
├── hooks/
│   └── use-toast.js       # Toast notification hook
├── lib/
│   └── utils.js           # Utility functions
├── pages/
│   ├── admin/             # Admin pages (Login, Dashboard, CRUD, Submissions)
│   └── *.jsx              # Public pages
├── services/
│   ├── auth.js            # Authentication services
│   └── firestore.js       # Firestore CRUD services
├── App.jsx                # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Cloudinary account

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Setup

The Firebase configuration is already set up in `src/config/firebase.js`:


To set up your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Open the "wings-global-school" project
3. Enable **Authentication** (Email/Password provider)
4. Enable **Firestore Database**
5. Deploy the security rules from `firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 3. Cloudinary Setup

The Cloudinary configuration is already set up in `src/config/cloudinary.js`:


To configure your Cloudinary account:

1. Go to [Cloudinary](https://cloudinary.com/)
2. Log in to the "dmmznl5hy" account
3. Go to Settings > Upload
4. Ensure the "wing-global" upload preset exists (unsigned)

### 4. Create Admin User

1. Go to Firebase Console > Authentication
2. Click "Add user" and create an account with email/password
3. Go to Firestore Database
4. Create a `users` collection
5. Add a document with the user's UID:
   ```json
   {
     "email": "admin@wingsglobal.edu",
     "name": "Admin User",
     "role": "admin",
     "createdAt": "[timestamp]"
   }
   ```

### 5. Start Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 6. Build for Production

```bash
npm run build
```

## 📱 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. The build settings are pre-configured
4. Deploy!

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting)
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

## 🔐 Security

### Firestore Rules

The application uses strict Firestore security rules (see `firestore.rules`):
- Public read access for website content
- Admin-only write access
- Validation for form submissions

### Authentication

- Firebase Authentication with email/password
- Protected admin routes
- Session persistence

## 📊 Data Model

### Firestore Collections

| Collection | Description | Access |
|------------|-------------|--------|
| users | Admin users | Admin only |
| announcements | School announcements | Public read, Admin write |
| news | News articles | Public read, Admin write |
| events | School events | Public read, Admin write |
| faculty | Faculty profiles | Public read, Admin write |
| gallery | Photos/videos | Public read, Admin write |
| downloads | Downloadable files | Public read, Admin write |
| heroSlider | Homepage hero slides | Public read, Admin write |
| admissions | Admission applications | Public create, Admin read |
| messages | Contact messages | Public create, Admin read |

## 🎨 Customization

### Colors

Edit the CSS variables in `src/index.css`:

```css
@theme {
  --color-primary: hsl(221.2 83.2% 53.3%);
  --color-secondary: hsl(210 40% 96.1%);
  /* ... */
}
```

### Content

All content is dynamically loaded from Firebase. Use the admin dashboard to manage:
- Announcements
- News articles
- Events
- Faculty profiles
- Gallery items
- Downloads
- Hero slider slides

## 📄 Environment Variables (Optional)

If you want to use environment variables instead of hardcoded config, create a `.env` file:

```env
# Firebase (optional - already configured in code)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary (optional - already configured in code)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 📱 Routes

### Public Routes
- `/` - Home
- `/about` - About
- `/academics` - Academics
- `/faculty` - Faculty
- `/gallery` - Gallery
- `/news-events` - News & Events
- `/downloads` - Downloads
- `/admissions` - Admissions
- `/contact` - Contact
- `/privacy-policy` - Privacy Policy
- `/terms-of-service` - Terms of Service

### Admin Routes
- `/admin/login` - Admin Login
- `/admin` - Dashboard
- `/admin/announcements` - Announcements CRUD
- `/admin/news` - News CRUD
- `/admin/events` - Events CRUD
- `/admin/faculty` - Faculty CRUD
- `/admin/gallery` - Gallery CRUD
- `/admin/downloads` - Downloads CRUD
- `/admin/hero-slider` - Hero Slider management
- `/admin/admissions` - Admission Submissions
- `/admin/messages` - Contact Messages

## 🤝 Support

For support, contact: support@wingsglobal.edu

---

Built with ❤️ by Wings Global Development Team
