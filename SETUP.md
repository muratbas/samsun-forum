# Samsun Forum - Kurulum Rehberi

## 🚀 Proje Yapısı Oluşturuldu!

Next.js 14 projesi, TypeScript ve Tailwind CSS ile başarıyla kuruldu.

## 📦 Kurulum Adımları

### 1. Bağımlılıkları Yükle

Proje dizininde PowerShell'de şu komutu çalıştır:

```bash
npm install
```

### 2. Firebase Yapılandırması

Firebase Console'da (https://console.firebase.google.com):

1. **Yeni proje oluştur** veya mevcut projeyi kullan
2. **Authentication** → "Get Started" → **Google** provider'ı aktif et
3. **Email/Password** provider'ı da aktif et (nickname login için)
4. **Firestore Database** → "Create database" → **Production mode** → Region: **europe-west3**
5. **Storage** → "Get Started" → **Production mode**
6. **Project Settings** → Scroll down → "Your apps" → Web app ekle
7. Config bilgilerini kopyala

### 3. Environment Variables

Proje root'unda `.env.local` dosyası oluştur:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=buraya_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=buraya_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=buraya_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=buraya_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=buraya_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=buraya_app_id
```

### 4. Development Server'ı Başlat

```bash
npm run dev
```

Tarayıcıda aç: http://localhost:3000

## ✅ Tamamlananlar

- ✅ Next.js 14 + TypeScript + Tailwind CSS kurulumu
- ✅ Özel Tailwind teması (Samsun Forum renkleri)
- ✅ Responsive Header component
- ✅ LeftSidebar (popüler konular)
- ✅ RightSidebar (gündem ve etkinlikler)
- ✅ PostCard component (upvote/downvote UI)
- ✅ PostFeed component (mock data ile)
- ✅ SortControls (Popüler/Yeni/En Çok Oylanan)
- ✅ Firebase configuration yapısı
- ✅ TypeScript type definitions

## 🚧 Sıradakiler

1. Firebase Authentication (Google OAuth)
2. Nickname seçimi flow
3. Post oluşturma formu
4. Firestore'dan gerçek veri çekme
5. Upvote/downvote fonksiyonelliği
6. Admin paneli

## 📱 Responsive Tasarım

- **Mobile** (< 768px): Tek sütun, collapsed sidebar'lar
- **Tablet** (768px - 1024px): İki sütun
- **Desktop** (> 1024px): Üç sütun (sol sidebar + feed + sağ sidebar)

## 🎨 Renk Paleti

- **Primary**: #E30613 (Kırmızı - Samsun rengi)
- **Background Dark**: #1A1A1B
- **Surface Dark**: #2D2D2D
- **Accent**: #4A90E2

## 📝 Notlar

- Dark mode varsayılan olarak aktif
- Material Symbols Outlined iconlar kullanılıyor
- Plus Jakarta Sans font kullanılıyor
- Tüm metinler Türkçe

## 🆘 Sorun Giderme

### Eğer npm install hata verirse:

```bash
npm cache clean --force
npm install
```

### Eğer port 3000 kullanımdaysa:

```bash
npm run dev -- -p 3001
```

## 📚 Daha Fazla Bilgi

Memory bank klasöründe detaylı dokümantasyon:
- `memory-bank/projectbrief.md`
- `memory-bank/systemPatterns.md`
- `memory-bank/techContext.md`

