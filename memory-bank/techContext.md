# OMÜForum - Teknik Bağlam

## Teknoloji Stack

### Frontend
| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| Next.js | 14.2.0 | React framework, SSR, routing |
| React | 18.2.0 | UI kütüphanesi |
| TypeScript | 5.3.3 | Type-safe JavaScript |
| Tailwind CSS | 3.4.0 | Utility-first CSS |

### Backend (BaaS)
| Teknoloji | Kullanım |
|-----------|----------|
| Firebase Auth | Google OAuth authentication |
| Cloud Firestore | NoSQL veritabanı |
| Firebase Storage | (Henüz aktif değil - resim upload için) |

### Araçlar & Diğer
| Teknoloji | Kullanım |
|-----------|----------|
| date-fns | Tarih formatlama |
| Hugeicons | Ana icon seti (CDN) |
| Bootstrap Icons | Backup icon seti (CDN) |
| Material Symbols | Backup icon seti (CDN) |
| SF Pro Display | Custom font (local .otf files) |
| ESLint | Kod kalitesi |
| PostCSS | CSS işleme |

## Proje Yapısı

```
samsun-forum/
├── app/                      # Next.js App Router
│   ├── fonts/                # Custom font files (.otf)
│   ├── globals.css           # Global stiller
│   ├── layout.tsx            # Root layout + providers + CDN links
│   ├── page.tsx              # Homepage
│   └── post/
│       └── [id]/
│           └── page.tsx      # Post detay sayfası
├── components/               # React componentleri
│   ├── AdminBadge.tsx        # Admin badge component
│   ├── ConfirmModal.tsx      # Onay modal'ı
│   ├── CreatePostModal.tsx   # Yeni post popup
│   ├── header.tsx             # Navbar
│   ├── LeftSidebar.tsx       # Sol menü (fixed)
│   ├── LoginModal.tsx         # Giriş popup
│   ├── NicknameModal.tsx     # Nickname seçimi popup
│   ├── PostCard.tsx           # Tek post kartı
│   ├── PostFeed.tsx           # Post listesi
│   ├── RightSidebar.tsx       # Sağ panel (static scroll)
│   └── SortControls.tsx       # Sıralama butonları
├── contexts/                 # React Context'ler
│   ├── AuthContext.tsx        # Authentication state
│   └── ThemeContext.tsx       # Dark/Light mode
├── lib/                      # Utility fonksiyonları
│   ├── firebase.ts           # Firebase config
│   ├── auth.ts               # Auth işlemleri
│   ├── posts.ts              # Post CRUD + pin/unpin
│   ├── comments.ts           # Comment CRUD
│   ├── votes.ts              # Oylama işlemleri
│   ├── topics.ts             # Topic tanımları
│   └── linkify.tsx           # URL linkify
├── types/                    # TypeScript type tanımları
│   └── index.ts
├── memory-bank/              # Proje hafızası
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Firestore Veritabanı Yapısı

### Collections

#### `users`
```typescript
{
  uid: string            // Firebase Auth UID (document ID)
  email: string
  nickname: string       // Benzersiz kullanıcı adı
  displayName: string    // Google display name
  photoURL: string       // Google profil fotoğrafı
  role: 'user' | 'moderator' | 'admin'
  createdAt: Timestamp
  banned: boolean
  banExpires?: Timestamp
  postCount: number
  karma: number
}
```

#### `posts`
```typescript
{
  id: string             // Document ID
  authorId: string       // User UID
  authorNickname: string
  authorPhotoURL: string
  authorRole?: 'user' | 'moderator' | 'admin'
  title: string          // Max 50 karakter
  content?: string       // Max 2000 karakter
  imageUrl?: string
  topicId: string
  topicName: string
  upvotes: number
  downvotes: number
  score: number          // upvotes - downvotes
  commentCount: number
  pinned: boolean        // Admin tarafından sabitlendi mi?
  pinnedAt?: Timestamp  // Sabitleme tarihi
  createdAt: Timestamp
  updatedAt: Timestamp
  deleted: boolean      // Soft delete
}
```

#### `comments`
```typescript
{
  id: string             // Document ID
  postId: string         // Post ID
  authorId: string       // User UID
  authorNickname: string
  authorPhotoURL: string
  authorRole?: 'user' | 'moderator' | 'admin'
  content: string
  createdAt: Timestamp
  updatedAt: Timestamp
  deleted: boolean      // Soft delete
}
```

#### `votes`
```typescript
{
  // Document ID: `${userId}_${postId}`
  userId: string
  postId: string
  type: 'upvote' | 'downvote'
  createdAt: Timestamp
}
```

## Environment Variables

`.env.local` dosyasında tanımlanması gereken değişkenler:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Geliştirme Ortamı

### Kurulum
```bash
npm install
npm run dev
```

### Scriptler
| Script | Açıklama |
|--------|----------|
| `npm run dev` | Development server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint kontrolü |

## Responsive Breakpoints

| Boyut | Genişlik | Layout |
|-------|----------|--------|
| Mobile | < 768px | Tek sütun, sidebar'lar gizli |
| Tablet | 768px - 1024px | İki sütun |
| Desktop | > 1024px | Üç sütun, tüm sidebar'lar |

## Renk Paleti

```css
/* Primary */
primary: #E30613           /* OMÜ kırmızısı */

/* Light Mode */
background-light: #F4F8FB  /* Pastel açık mavi */
surface-light: #FFFFFF
text-primary-light: #111111
text-secondary-light: #555555
border-light: #EAEAEA

/* Dark Mode */
background-dark: #1A1A1B
surface-dark: #2D2D2D
text-primary-dark: #F9F9F9
text-secondary-dark: #AAAAAA
border-dark: #3E3E3E

/* Accent */
accent: #4A90E2            /* Mavi vurgu (downvote) */
```

## Icon Kullanımı

### Hugeicons (Ana)
```html
<!-- CDN: app/layout.tsx -->
<link href="https://cdn.hugeicons.com/font/hgi-stroke-rounded.css" rel="stylesheet" />

<!-- Kullanım -->
<i className="hgi-stroke hgi-icon-name text-lg"></i>
```

### Bootstrap Icons (Backup)
```html
<!-- CDN: app/layout.tsx -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet" />

<!-- Kullanım -->
<i className="bi bi-icon-name text-lg"></i>
```

### Material Symbols (Backup)
```html
<!-- CDN: app/layout.tsx -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

<!-- Kullanım -->
<span className="material-symbols-outlined">icon_name</span>
```

## Font Kullanımı

### SF Pro Display (Custom)
```typescript
// app/layout.tsx
const sfProDisplay = localFont({
  src: [
    { path: './fonts/sfprodisplayregular.otf', weight: '400' },
    { path: './fonts/sfprodisplaymedium.otf', weight: '500' },
    { path: './fonts/sfprodisplaybold.otf', weight: '700' },
  ],
  variable: '--font-sf-pro',
})

// tailwind.config.ts
fontFamily: {
  'sf-pro': ['var(--font-sf-pro)', 'sans-serif'],
}

// globals.css
body {
  font-family: var(--font-sf-pro), sans-serif;
}
```

## Bilinen Teknik Kısıtlamalar

1. **Firestore Index Gereksinimi**: `posts` collection'ında `deleted` + `createdAt` veya `deleted` + `score` composite index gerekebilir
2. **Firebase Ücretsiz Tier**: Günlük okuma/yazma limitleri var
3. **Image Upload**: Henüz aktif değil, Firebase Storage entegrasyonu gerekli

## Önemli Notlar

### Post Sabitleme
- Sadece admin'ler post sabitleyebilir
- `pinned: true` ve `pinnedAt: Timestamp` alanları kullanılıyor
- RightSidebar'da maksimum 3 sabitlenmiş post gösteriliyor
- `getPinnedPosts(limit)` fonksiyonu ile çekiliyor

### Admin Yapma
Firebase Console > Firestore > `users` collection'ında ilgili kullanıcının `role` alanını `"admin"` olarak değiştir.

### Post Silme
- Kullanıcılar sadece kendi postlarını silebilir
- Admin'ler herhangi bir postu silebilir
- Soft delete kullanılıyor (`deleted: true`)
