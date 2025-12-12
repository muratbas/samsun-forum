# Samsun Forum - Teknik Bağlam

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
| Material Symbols | Icon seti |
| Plus Jakarta Sans | Font ailesi |
| ESLint | Kod kalitesi |
| PostCSS | CSS işleme |

## Proje Yapısı

```
samsun-forum/
├── app/                      # Next.js App Router
│   ├── globals.css           # Global stiller
│   ├── layout.tsx            # Root layout + providers
│   └── page.tsx              # Homepage
├── components/               # React componentleri
│   ├── header.tsx            # Navbar
│   ├── LeftSidebar.tsx       # Sol menü
│   ├── RightSidebar.tsx      # Sağ panel (gündem, etkinlikler)
│   ├── PostCard.tsx          # Tek post kartı
│   ├── PostFeed.tsx          # Post listesi
│   ├── SortControls.tsx      # Sıralama butonları
│   ├── LoginModal.tsx        # Giriş popup
│   ├── NicknameModal.tsx     # Nickname seçimi popup
│   └── CreatePostModal.tsx   # Yeni post popup
├── contexts/                 # React Context'ler
│   ├── AuthContext.tsx       # Authentication state
│   └── ThemeContext.tsx      # Dark/Light mode
├── lib/                      # Utility fonksiyonları
│   ├── firebase.ts           # Firebase config
│   ├── auth.ts               # Auth işlemleri
│   ├── posts.ts              # Post CRUD
│   ├── votes.ts              # Oylama işlemleri
│   ├── topics.ts             # Topic tanımları
│   └── linkify.tsx           # URL linkify
├── types/                    # TypeScript type tanımları
│   └── index.ts
├── memory-bank/              # Proje hafızası (bu dosyalar)
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
  title: string
  content?: string
  imageUrl?: string
  topicId: string
  topicName: string
  upvotes: number
  downvotes: number
  score: number          // upvotes - downvotes
  commentCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
  deleted: boolean       // Soft delete
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
primary: #E30613           /* Samsun kırmızısı */

/* Light Mode */
background-light: #F9F9F9
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

## Bilinen Teknik Kısıtlamalar

1. **Firestore Index Gereksinimi**: `posts` collection'ında `deleted` + `createdAt` veya `deleted` + `score` composite index gerekebilir
2. **Offline Cache Sorunu**: Firestore offline cache bazen sorun çıkarıyor, `enableNetwork()` ile çözüldü
3. **Firebase Ücretsiz Tier**: Günlük okuma/yazma limitleri var

