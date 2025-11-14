# 🎯 Samsun Forum - Kurulum Rehberi

## ✅ Tamamlanan İşler

### Proje Yapısı
- ✅ Next.js 14 + TypeScript + Tailwind CSS
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Dark mode varsayılan
- ✅ Material Symbols icon'ları
- ✅ Plus Jakarta Sans font

### Component'ler
- ✅ Header (navbar + arama + profil)
- ✅ LeftSidebar (navigasyon + konular)
- ✅ RightSidebar (gündem + etkinlikler)
- ✅ PostCard (post kartları + upvote/downvote)
- ✅ PostFeed (post listesi)
- ✅ SortControls (sıralama butonları)

### Firebase Hazırlığı
- ✅ Firebase config dosyası
- ✅ TypeScript type tanımları
- ✅ Auth, Firestore, Storage yapısı

---

## 🚀 Kurulum

### 1. Bağımlılıklar Yüklendi mi?

Eğer henüz yapmadıysan:

```bash
npm install
```

### 2. Firebase Configuration

#### Firebase Console'da:
1. https://console.firebase.google.com adresine git
2. Projeyi oluştur (veya mevcut projeyi kullan)
3. **Authentication** → Google + Email/Password aktif et
4. **Firestore Database** → Oluştur (europe-west3)
5. **Project Settings** → Web app ekle → Config'i kopyala

#### Proje'de:
1. `.env.local` dosyası oluştur (root'ta)
2. Firebase config'i yapıştır:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=senin_key_buraya
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proje.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=proje_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proje.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

### 3. Development Server'ı Başlat

```bash
npm run dev
```

Tarayıcıda aç: **http://localhost:3000**

---

## 📱 Responsive Breakpoints

- **Mobile** (< 768px): Tek sütun, sidebar'lar gizli
- **Tablet** (768px - 1024px): İki sütun, sidebar'lar hala gizli
- **Desktop** (> 1024px): Üç sütun, tüm sidebar'lar görünür

---

## 🎨 Tasarım Renkleri

```css
primary: #E30613           /* Samsun kırmızısı */
background-dark: #1A1A1B   /* Ana arka plan */
surface-dark: #2D2D2D      /* Kartlar */
text-primary-dark: #F9F9F9 /* Ana metin */
text-secondary-dark: #AAAAAA /* İkincil metin */
accent: #4A90E2            /* Mavi vurgu */
```

---

## 🔧 Yapılacaklar (Sıradaki Adımlar)

### Firebase Entegrasyonu
- [ ] Authentication flow (Google OAuth)
- [ ] Nickname seçimi modal
- [ ] User profile oluşturma

### Post İşlemleri
- [ ] Yeni post oluşturma formu
- [ ] Firestore'a post kaydetme
- [ ] Gerçek veri ile feed gösterimi

### Voting Sistemi
- [ ] Upvote/downvote fonksiyonelliği
- [ ] Vote state'i Firebase'de saklama
- [ ] Karma hesaplama

### İleri Seviye
- [ ] Comment sistemi
- [ ] Admin paneli
- [ ] Moderasyon araçları
- [ ] Events section (API/scraping)

---

## 🐛 Sorun Giderme

### Port 3000 kullanımda hatası:
```bash
npm run dev -- -p 3001
```

### .next cache hatası:
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

### Tailwind stilleri yüklenmiyor:
- Tarayıcıyı hard refresh (Ctrl+Shift+R)
- Terminal'i kapat, tekrar `npm run dev`

---

## 📚 Proje Yapısı

```
samsun-forum/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Top navbar
│   ├── LeftSidebar.tsx     # Navigasyon
│   ├── RightSidebar.tsx    # Gündem/Etkinlikler
│   ├── PostCard.tsx        # Post kartı
│   ├── PostFeed.tsx        # Post listesi
│   └── SortControls.tsx    # Sıralama butonları
├── lib/
│   └── firebase.ts         # Firebase config
├── types/
│   └── index.ts            # TypeScript types
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎓 Öğrenme Kaynakları

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 🎉 Başarılı!

Şu an çalışan bir forum iskelet yapısına sahipsin:
- ✅ Responsive tasarım
- ✅ Dark mode
- ✅ Mock postlar
- ✅ Upvote/downvote UI

Sıradaki adım: **Firebase'i bağlayıp gerçek veri ile çalıştırmak!** 🚀

