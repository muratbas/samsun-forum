# Technical Context: Samsun Forum

## Core Technologies

### Frontend Stack

#### Next.js 14
- **Version**: 14.x (latest stable)
- **Router**: App Router (not Pages Router)
- **Rendering**: Hybrid (Server + Client Components)
- **Why**: SEO, performance, integrated backend via API routes, optimal for forums

#### React 18+
- **Features Used**: Hooks, Server Components, Suspense
- **State Management**: React Context + Local State (Firebase handles most state)
- **Why**: Modern, efficient, great ecosystem

#### Tailwind CSS 3.x
- **Setup**: Via CDN initially (from design), migrate to PostCSS config
- **Configuration**: Custom theme matching provided design
- **Plugins**: Forms plugin for styled inputs
- **Why**: Rapid development, consistent design, mobile-first

#### TypeScript (Recommended)
- **Version**: 5.x
- **Strictness**: Moderate (allow implicit any for rapid prototyping)
- **Why**: Better DX, catch errors early, better Firebase SDK experience

### Backend Stack

#### Firebase
- **Version**: Firebase JS SDK 10.x
- **Services Used**:
  - **Authentication**: Google OAuth + Email/Password
  - **Firestore**: NoSQL database
  - **Storage**: Image uploads
  - **Security Rules**: Server-side validation

#### Firestore Database
- **Type**: NoSQL, document-based
- **Queries**: Composite indexes for complex queries
- **Real-time**: Listeners for live updates (optional, use sparingly)
- **Pricing**: Free tier (50K reads/day, 20K writes/day, 1GB storage)

#### Firebase Authentication
- **Providers**: 
  - Google OAuth (primary for registration)
  - Email/Password (for nickname login after setup)
- **Session Management**: Firebase handles tokens
- **Security**: Built-in CSRF protection

#### Firebase Storage
- **Use**: User-uploaded post images
- **Structure**: `/posts/{postId}/{imageId}.jpg`
- **Rules**: Authenticated upload, public read
- **Optimization**: Client-side compression before upload

## Development Tools

### Package Manager
- **Choice**: npm (comes with Node.js)
- **Alternative**: pnpm (faster, optional)

### Code Editor
- **Assumed**: VS Code (given Cursor IDE usage)
- **Extensions**:
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Firebase

### Version Control
- **Git**: Standard workflow
- **Hosting**: GitHub (given GitHub Pages mention)
- **Branching**: Simple main branch for school project

### Node.js
- **Version**: 18.x or 20.x LTS
- **Why**: Required for Next.js

## Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.7.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Additional Dependencies (As Needed)
```json
{
  "dependencies": {
    "swr": "^2.2.0",              // Data fetching & caching
    "react-hook-form": "^7.48.0", // Form handling
    "zod": "^3.22.0",             // Schema validation
    "date-fns": "^2.30.0",        // Date formatting (Turkish locale)
    "react-hot-toast": "^2.4.0",  // Toast notifications
    "browser-image-compression": "^2.0.0" // Image compression
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

## External Services

### Google Fonts
- **Font**: Plus Jakarta Sans
- **Weights**: 400, 500, 700, 800
- **Load**: Via `<link>` in `<head>` or `next/font`

### Material Symbols
- **Icon Set**: Material Symbols Outlined
- **Load**: Via Google Fonts CSS
- **Usage**: `<span class="material-symbols-outlined">home</span>`

### Firebase Console
- **URL**: console.firebase.google.com
- **Setup Required**:
  1. Create project
  2. Enable Authentication (Google + Email/Password)
  3. Create Firestore database
  4. Create Storage bucket
  5. Get config credentials

### Vercel
- **URL**: vercel.com
- **Setup**: Connect GitHub repo
- **Environment Variables**: Add Firebase config
- **Domain**: Auto-generated `.vercel.app` subdomain

## Configuration Files

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: true, // For form actions
  },
}

module.exports = nextConfig
```

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E30613',
        'background-light': '#F9F9F9',
        'background-dark': '#1A1A1B',
        'surface-light': '#FFFFFF',
        'surface-dark': '#2D2D2D',
        'text-primary-light': '#111111',
        'text-primary-dark': '#F9F9F9',
        'text-secondary-light': '#555555',
        'text-secondary-dark': '#AAAAAA',
        'border-light': '#EAEAEA',
        'border-dark': '#3E3E3E',
        accent: '#4A90E2',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

### `tsconfig.json` (if using TypeScript)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `.env.local` (Git-ignored)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Development Setup

### Initial Setup Commands
```bash
# 1. Create Next.js app
npx create-next-app@latest samsun-forum --typescript --tailwind --app

# 2. Install Firebase
npm install firebase

# 3. Install additional dependencies
npm install swr react-hook-form zod date-fns react-hot-toast browser-image-compression

# 4. Run development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

### Firebase Setup
1. Go to firebase.google.com/console
2. Create new project "samsun-forum"
3. Add web app, get config
4. Enable Authentication → Google + Email/Password
5. Create Firestore database → Production mode → Region: europe-west3 (Frankfurt)
6. Create Storage bucket → Default settings
7. Copy config to `.env.local`

### Vercel Deployment
```bash
# 1. Install Vercel CLI (optional)
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# Or: Push to GitHub and import to Vercel dashboard
```

## Browser Support
- **Target**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: iOS Safari 14+, Chrome Android 90+
- **No IE11 support**: Next.js 14 doesn't support it

## Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90
- **Mobile Performance**: Optimized with Next.js Image

## Localization
- **Primary Language**: Turkish (tr-TR)
- **Date Format**: Turkish locale via `date-fns/locale/tr`
- **Numbers**: Turkish number formatting
- **No multi-language support**: Single language only

## Technical Constraints

### Free Tier Limits (Firebase)
- **Firestore**: 50K reads/day, 20K writes/day
- **Storage**: 5GB total, 1GB download/day
- **Authentication**: Unlimited
- **Hosting**: N/A (using Vercel)

### Free Tier Limits (Vercel)
- **Bandwidth**: 100GB/month
- **Build Time**: 6000 minutes/month (more than enough)
- **Serverless Functions**: 100GB-hours
- **Projects**: Unlimited

### With 500 Users/Day
- **Estimated Reads**: ~10K/day (well within limits)
- **Estimated Writes**: ~500-1000/day (well within limits)
- **Storage**: Minimal for school project duration

## Security Considerations

### Client-Side
- Never expose admin credentials
- Firebase config is public (this is normal)
- Validate all inputs
- Sanitize user content

### Server-Side (Firestore Rules)
- Enforce authentication for writes
- Validate data structure
- Rate limiting via security rules
- Check user ban status before writes

### Image Upload
- Max file size: 5MB
- Allowed types: JPEG, PNG, WebP
- Compress before upload
- Virus scanning (future with Cloud Functions)

## Development Workflow

### Local Development
1. Run `npm run dev`
2. Use Firebase Emulators (optional but recommended)
3. Test on `localhost:3000`
4. Hot reload for instant feedback

### Testing Strategy (Simple for School Project)
- Manual testing in browser
- Test authentication flow
- Test post creation and voting
- Test mobile responsiveness
- No automated tests initially (add if time permits)

### Deployment Pipeline
1. Push to `main` branch on GitHub
2. Vercel auto-deploys
3. Check deployment preview
4. Smoke test on production URL
5. Share with classmates for feedback

## Future Technical Enhancements
- Redis caching for vote counts
- Elasticsearch for search
- Cloud Functions for background jobs
- CDN for static assets
- Analytics dashboard
- Automated testing suite

