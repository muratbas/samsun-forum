# OMÜForum - Sistem Desenleri

## Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────────────┐
│                         Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │ Components  │  │     Contexts        │  │
│  │  (app/)     │  │             │  │  Auth + Theme       │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│                    ┌─────▼─────┐                            │
│                    │    lib/   │                            │
│                    │ (Firebase │                            │
│                    │  helpers) │                            │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Firebase   │
                    │ Auth + DB   │
                    └─────────────┘
```

## Component Hiyerarşisi

```
RootLayout
├── ThemeProvider (context)
│   └── AuthProvider (context)
│       ├── Header
│       │   ├── LoginModal
│       │   ├── NicknameModal
│       │   └── CreatePostModal
│       └── [Page Content]
│           ├── Home (/)
│           │   ├── LeftSidebar
│           │   ├── MainContent
│           │   │   ├── SortControls
│           │   │   └── PostFeed
│           │   │       └── PostCard (multiple)
│           │   └── RightSidebar
│           │       └── PinnedPosts
│           └── PostDetail (/post/[id])
│               ├── LeftSidebar
│               ├── PostDetail
│               │   ├── PostContent
│               │   ├── CommentForm
│               │   └── CommentList
│               └── RightSidebar
```

## Tasarım Desenleri

### 1. Context Provider Pattern
Authentication ve theme state'i React Context ile yönetiliyor.

```typescript
// AuthContext.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  
  // Firebase auth state'i dinle
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      if (firebaseUser) {
        await fetchUserData(firebaseUser)
      }
    })
    return () => unsubscribe()
  }, [])
  
  return <AuthContext.Provider value={{ user, firebaseUser, loading }}>
    {children}
  </AuthContext.Provider>
}
```

### 2. Optimistic Updates
Oylama işlemlerinde kullanıcı deneyimini iyileştirmek için UI önce güncelleniyor, sonra Firebase'e yazılıyor.

```typescript
// PostCard.tsx - handleUpvote
const handleUpvote = async () => {
  // 1. Optimistic update - hemen UI güncelle
  if (voteState === 'upvote') {
    setVoteState(null)
    setCurrentScore(currentScore - 1)
  } else {
    setVoteState('upvote')
    setCurrentScore(currentScore + 1)
  }
  
  // 2. Firebase'e yaz
  try {
    await upvotePost(user.uid, post.id)
  } catch (error) {
    // 3. Hata olursa geri al
    setVoteState(oldVoteState)
    setCurrentScore(oldScore)
  }
}
```

### 3. Modal Pattern
Tüm modal'lar benzer yapıda:
- `isOpen` prop ile kontrol
- `onClose` callback
- `onSuccess` callback
- Backdrop click ile kapatma

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}
```

### 4. Confirm Modal Pattern
Silme ve kritik işlemler için özel onay modal'ı:
- Ortada çıkan modal
- İkon + başlık + mesaj
- İptal ve Onayla butonları
- Loading state desteği

### 5. Compound Document ID
Vote'lar için `userId_postId` formatında composite ID kullanılıyor. Bu sayede:
- Tek bir kullanıcı bir post'a sadece bir kez oy verebilir
- Vote kontrolü hızlı yapılabilir (doğrudan document ID ile)

```typescript
const voteId = `${userId}_${postId}` // "abc123_post456"
```

### 6. Soft Delete
Post'lar silindiğinde gerçekten silinmiyor, `deleted: true` olarak işaretleniyor.

```typescript
// Post silme
await updateDoc(postRef, {
  deleted: true,
  updatedAt: serverTimestamp()
})

// Post sorgulama
query(collection(db, 'posts'), where('deleted', '==', false))
```

### 7. Post Pin System
Admin'ler post'ları sabitleyebilir:
- `pinned: boolean` alanı
- `pinnedAt: Timestamp` alanı
- RightSidebar'da gösterim
- Pin/unpin fonksiyonları

## State Yönetimi

### Global State (Context)
| Context | State | Amaç |
|---------|-------|------|
| AuthContext | user, firebaseUser, loading | Authentication durumu |
| ThemeContext | theme | Dark/Light mode |

### Local State (Component)
- `PostCard`: voteState, currentScore, voting, showMenu, isPinned, pinning
- `PostFeed`: posts, loading, error
- `PostDetailPage`: post, comments, commentText, voteState, showMenu, isPinned
- `SortControls`: activeSort
- `Header`: showLoginModal, showNicknameModal, showCreatePostModal
- `CreatePostModal`: title, content, selectedTopic, pinned, loading

## Veri Akışı

### Authentication Flow
```
1. User clicks "Giriş Yap"
   ↓
2. LoginModal opens
   ↓
3. signInWithGoogle() - Firebase popup
   ↓
4. onAuthStateChanged fires
   ↓
5. AuthContext checks Firestore for user document
   ↓
6a. User exists → setUser(userData)
6b. User not exists → NicknameModal opens
   ↓
7. createUser() - Firestore'a yaz
   ↓
8. refreshUser() - Context güncelle
```

### Post Creation Flow
```
1. User clicks "Yeni Gönderi"
   ↓
2. CreatePostModal opens
   ↓
3. User fills form (title, content, topic, pinned if admin)
   ↓
4. createPost() - Firestore'a yaz
   ↓
5. User's postCount increment
   ↓
6. Page refresh → getPosts() tekrar çalışır
```

### Post Pin Flow
```
1. Admin clicks "Gönderiyi Sabitle" (three dots menu or create modal)
   ↓
2. pinPost() - Firestore'a yaz (pinned: true, pinnedAt: timestamp)
   ↓
3. RightSidebar otomatik güncellenir (getPinnedPosts)
   ↓
4. Post "Resmi Duyurular" bölümünde görünür
```

### Voting Flow
```
1. User clicks thumbs up/down
   ↓
2. Optimistic UI update
   ↓
3. upvotePost() / downvotePost()
   ↓
4. Check existing vote in 'votes' collection
   ↓
5a. Same vote → Remove vote, adjust score
5b. Opposite vote → Switch vote, adjust score
5c. No vote → Add vote, adjust score
   ↓
6. Update post score
   ↓
7. Update user karma
```

### Comment Flow
```
1. User writes comment in PostDetailPage
   ↓
2. createComment() - Firestore'a yaz
   ↓
3. Post's commentCount increment
   ↓
4. Comments list refresh
   ↓
5. Comment appears in list
```

## Güvenlik Kuralları (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.authorId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Comments
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Votes
    match /votes/{voteId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Error Handling Patterns

### Firebase Offline Retry
```typescript
const fetchUserData = async (firebaseUser, retryCount = 0) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    // ...
  } catch (error) {
    if (error?.code === 'unavailable' && retryCount < 3) {
      await new Promise(resolve => setTimeout(resolve, 500))
      return fetchUserData(firebaseUser, retryCount + 1)
    }
    throw error
  }
}
```

### User Feedback
- Loading states (skeleton, spinner)
- Error messages (kırmızı banner)
- Success feedback (modal kapatma, page refresh)
- Confirm modals (kritik işlemler için)
