# Samsun Forum - Aktif Bağlam

## Mevcut Odak
Proje şu anda **MVP tamamlanmış** durumda. Temel forum işlevleri çalışıyor:
- ✅ Giriş/Kayıt
- ✅ Post oluşturma
- ✅ Oylama
- ✅ Topic kategorileri

## Son Yapılan Değişiklikler

### En Son Tamamlananlar
1. **CreatePostModal** - Yeni gönderi oluşturma formu eklendi
2. **Oylama sistemi** - Upvote/downvote Firebase entegrasyonu
3. **Karma sistemi** - Kullanıcı puanları
4. **URL Linkify** - Post içindeki linkleri tıklanabilir yapma
5. **Dark/Light mode** - Tema değiştirme (varsayılan: light)
6. **Firestore offline fix** - enableNetwork() ile cache sorunu çözüldü

## Bilinen Sorunlar

### Öncelikli
- [ ] Firestore index'leri henüz oluşturulmadı (composite queries için)
- [ ] Image upload henüz aktif değil
- [ ] Comment sistemi yok

### Düşük Öncelikli
- [ ] Arama fonksiyonu yok
- [ ] User profil sayfası yok
- [ ] Admin paneli yok

## Aktif Kararlar

### Tema Varsayılanı
Light mode varsayılan olarak ayarlandı. Kullanıcı tercihi localStorage'da saklanıyor.

### Nickname Değiştirme
Şu an nickname bir kez seçildikten sonra değiştirilemiyor. Bu kasıtlı bir karar - spam ve kötüye kullanımı önlemek için.

### Soft Delete
Post'lar silindiğinde `deleted: true` olarak işaretleniyor, gerçekten silinmiyor. Bu sayede moderasyon ve geri alma mümkün.

## Sonraki Adımlar

### Kısa Vadeli (Öncelikli)
1. **Comment Sistemi** - Post'lara yorum yapabilme
2. **Image Upload** - Firebase Storage ile resim yükleme
3. **Post Detay Sayfası** - `/post/[id]` route

### Orta Vadeli
1. User profil sayfası
2. Topic filtreleme sayfası (`/topic/[slug]`)
3. Firestore security rules

### Uzun Vadeli
1. Admin paneli
2. Moderasyon araçları
3. Events section
4. Arama fonksiyonu

## Önemli Dosyalar

### Sık Düzenlenen
- `components/header.tsx` - Navbar ve modal kontrolü
- `components/PostCard.tsx` - Post kartı ve oylama
- `lib/posts.ts` - Post CRUD işlemleri
- `lib/votes.ts` - Oylama işlemleri

### Dikkat Edilmesi Gerekenler
- `lib/firebase.ts` - Firebase config (env variables gerekli)
- `contexts/AuthContext.tsx` - Auth state yönetimi
- `types/index.ts` - TypeScript tanımları

## Geliştirme Notları

### Test İçin
Firebase console'dan test kullanıcısı ve post'ları oluşturabilirsin. Firestore'daki collection'lar:
- `users` - Kullanıcılar
- `posts` - Gönderiler
- `votes` - Oylar

### Debugging
- Browser console'da Firebase hataları görülebilir
- Network tab'da Firestore istekleri izlenebilir
- AuthContext'teki `loading` state'i kontrol edilebilir

