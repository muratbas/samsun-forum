# System Patterns: Samsun Forum

## Architecture Overview

### High-Level Structure
```
Next.js 14 App Router
├── Frontend (React + Tailwind CSS)
├── Firebase Integration
│   ├── Authentication (Google OAuth + Custom)
│   ├── Firestore Database
│   └── Storage (Images)
└── Deployment (Vercel)
```

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **UI**: React 18+ with Tailwind CSS
- **Backend**: Firebase (Firestore + Auth + Storage)
- **Hosting**: Vercel
- **Language**: TypeScript (recommended) or JavaScript
- **Icons**: Material Symbols Outlined
- **Font**: Plus Jakarta Sans (Google Fonts)

## Application Structure

### Directory Architecture
```
samsun-forum/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (header, providers)
│   ├── page.tsx                  # Homepage feed
│   ├── popular/page.tsx          # Popular posts
│   ├── new/page.tsx              # New posts
│   ├── topic/[slug]/page.tsx    # Topic-filtered view
│   ├── post/[id]/page.tsx       # Individual post view
│   ├── login/page.tsx            # Login page
│   └── admin/                    # Admin dashboard
│       ├── topics/page.tsx       # Topic management
│       └── moderation/page.tsx   # User moderation
├── components/                   # React components
│   ├── Header.tsx                # Top navigation
│   ├── LeftSidebar.tsx          # Navigation sidebar
│   ├── RightSidebar.tsx         # Trending & events
│   ├── PostCard.tsx             # Individual post card
│   ├── PostFeed.tsx             # Feed container
│   ├── CreatePostModal.tsx      # Post creation
│   └── VoteButtons.tsx          # Upvote/downvote
├── lib/                          # Utilities and configs
│   ├── firebase.ts               # Firebase initialization
│   ├── auth.ts                   # Auth helpers
│   └── db.ts                     # Database helpers
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication state
│   ├── usePosts.ts               # Posts fetching
│   └── useVotes.ts               # Voting logic
├── types/                        # TypeScript types
│   ├── post.ts
│   ├── user.ts
│   └── topic.ts
└── public/                       # Static assets
```

## Data Model (Firestore)

### Collections Structure

#### Users Collection
```typescript
users/{userId}
{
  uid: string;                    // Firebase Auth UID
  email: string;
  nickname: string;               // Unique, user-chosen
  displayName: string;
  photoURL: string;               // From Google
  role: 'user' | 'moderator' | 'admin';
  createdAt: Timestamp;
  banned: boolean;
  banExpires?: Timestamp;
  postCount: number;
  karma: number;                  // Total upvotes - downvotes
}
```

#### Posts Collection
```typescript
posts/{postId}
{
  id: string;
  authorId: string;               // Reference to user
  authorNickname: string;         // Denormalized for performance
  title: string;
  content: string;                // Post body (optional)
  imageUrl?: string;              // Firebase Storage URL
  topicId: string;                // Reference to topic
  topicName: string;              // Denormalized
  upvotes: number;
  downvotes: number;
  score: number;                  // upvotes - downvotes
  commentCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deleted: boolean;
}
```

#### Topics Collection
```typescript
topics/{topicId}
{
  id: string;
  name: string;                   // Display name (e.g., "Yemek")
  slug: string;                   // URL-friendly (e.g., "yemek")
  description: string;
  color: string;                  // Hex color for UI
  postCount: number;
  subscriberCount: number;
  createdAt: Timestamp;
  order: number;                  // Display order
  active: boolean;
}
```

#### Votes Collection
```typescript
votes/{userId}_{postId}
{
  userId: string;
  postId: string;
  type: 'upvote' | 'downvote';
  createdAt: Timestamp;
}
```

#### Events Collection (Future)
```typescript
events/{eventId}
{
  id: string;
  title: string;
  description: string;
  location: string;
  date: Timestamp;
  imageUrl?: string;
  source: string;                 // API or manual
  externalUrl?: string;
}
```

## Key Design Patterns

### 1. Authentication Flow
```
User clicks login/post
  ↓
Google OAuth popup
  ↓
Check if user exists in Firestore
  ↓
NO → Nickname selection modal → Create user doc
  ↓
YES → Redirect to homepage/continue action
```

### 2. Post Creation Flow
```
User clicks "Yeni Gönderi"
  ↓
Modal opens with form
  ↓
User fills: title, content, image, topic
  ↓
Client-side validation
  ↓
Upload image to Firebase Storage (if exists)
  ↓
Create post document in Firestore
  ↓
Update user postCount
  ↓
Update topic postCount
  ↓
Optimistic UI update (instant feedback)
  ↓
Redirect to post or close modal
```

### 3. Voting System
```
User clicks upvote/downvote
  ↓
Check authentication
  ↓
Check existing vote in votes/{userId}_{postId}
  ↓
Calculate new vote counts:
  - Same vote: Remove vote (undo)
  - Different vote: Switch vote (upvote ↔ downvote)
  - No vote: Add new vote
  ↓
Update votes collection
  ↓
Update post upvotes/downvotes/score
  ↓
Update author karma
  ↓
Optimistic UI update
```

### 4. Feed Rendering
```
User visits homepage
  ↓
Query posts with pagination:
  - Popular: ORDER BY score DESC, createdAt DESC
  - New: ORDER BY createdAt DESC
  - Most Voted: ORDER BY upvotes DESC
  ↓
Fetch with limit (20 posts)
  ↓
Render PostCard components
  ↓
Infinite scroll: Load more on bottom reach
```

### 5. Real-time Updates
```typescript
// Use Firestore real-time listeners for:
- Vote counts on posts
- New posts in feed (optional)
- User authentication state
- Ban status checks

// Use SWR or React Query for:
- Initial data fetching
- Caching
- Background revalidation
```

## Component Patterns

### Server Components (Next.js 14)
- Page layouts
- Initial data fetching
- SEO meta tags

### Client Components
- Interactive elements (voting, forms)
- Real-time listeners
- User-specific UI

### Shared Components
- PostCard: Display post with voting
- Header: Navigation and user menu
- Sidebars: Static links and dynamic content

## Security Rules (Firestore)

### Critical Rules
1. **Users**: Can only edit own profile
2. **Posts**: Anyone read, authenticated create/edit own
3. **Votes**: Only authenticated, one vote per post
4. **Topics**: Only admins create/edit
5. **Banned Users**: Cannot create posts or vote

### Example Rule
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null 
                   && !isBanned(request.auth.uid);
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }
  }
}
```

## Performance Optimizations

### Image Handling
1. Client-side compression before upload
2. Firebase Storage with CDN delivery
3. Next.js Image component for optimization
4. Lazy loading for images below fold

### Data Fetching
1. Pagination (20 posts per page)
2. Denormalized data (avoid joins)
3. Indexed Firestore queries
4. SWR caching strategy

### UI Performance
1. Optimistic updates for votes
2. Skeleton loaders during fetch
3. Virtual scrolling for long feeds (future)
4. Code splitting by route

## Error Handling

### User-Facing Errors
- Network failures: Retry button
- Authentication errors: Redirect to login
- Validation errors: Inline form messages
- Server errors: Toast notifications

### Logging
- Console errors in development
- Firebase Analytics in production (optional)
- Sentry for error tracking (future)

## Deployment Strategy

### Development
```bash
npm run dev                # Local development
firebase emulators:start   # Local Firebase
```

### Production
```bash
npm run build              # Build for production
vercel deploy             # Deploy to Vercel
```

### Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

