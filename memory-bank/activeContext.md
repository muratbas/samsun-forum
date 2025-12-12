# OMÜForum - Aktif Bağlam

## Mevcut Odak
Proje şu anda **tam fonksiyonel forum platformu** durumunda. Temel ve gelişmiş forum işlevleri çalışıyor:
- ✅ Giriş/Kayıt
- ✅ Post oluşturma ve silme
- ✅ Post detay sayfası
- ✅ Yorum sistemi
- ✅ Oylama
- ✅ Admin sistemi ve post sabitleme
- ✅ Etiket sistemi

## Son Yapılan Değişiklikler

### En Son Tamamlananlar (Son Güncelleme)
1. **Post Sabitleme Sistemi** - Admin'ler post'ları resmi duyuru olarak sabitleyebiliyor
2. **RightSidebar Güncellemesi** - Sabitlenmiş postlar "Resmi Duyurular" bölümünde gösteriliyor
3. **Post Detay Sayfası Pin/Unpin** - Post detay sayfasında admin'ler sabitleme yapabiliyor
4. **CreatePostModal İyileştirmeleri** - Etiket sistemi baloncuk formatına dönüştürüldü, admin için pin toggle eklendi
5. **Icon Set Değişikliği** - Hugeicons CDN entegrasyonu, tüm iconlar güncellendi
6. **Custom Font** - SF Pro Display font entegrasyonu
7. **Post Silme** - Kullanıcılar kendi postlarını silebiliyor, admin'ler her postu silebiliyor
8. **ConfirmModal** - Özel onay modal'ı eklendi (sitestyle uyumlu)
9. **Admin Badge** - Admin kullanıcılar için görsel badge eklendi
10. **Post Detay Sayfası** - Tam post görünümü, yorum yapma ve listeleme

## Bilinen Sorunlar

### Öncelikli
- [ ] Firestore index'leri bazı sorgular için gerekebilir (composite queries)
- [ ] Image upload henüz aktif değil
- [ ] Post düzenleme özelliği yok

### Düşük Öncelikli
- [ ] Arama fonksiyonu yok
- [ ] User profil sayfası yok
- [ ] Bildirimler sistemi yok

## Aktif Kararlar

### Tema Varsayılanı
Dark mode varsayılan olarak ayarlandı. Kullanıcı tercihi localStorage'da saklanıyor.

### Nickname Değiştirme
Şu an nickname bir kez seçildikten sonra değiştirilemiyor. Bu kasıtlı bir karar - spam ve kötüye kullanımı önlemek için.

### Soft Delete
Post'lar silindiğinde `deleted: true` olarak işaretleniyor, gerçekten silinmiyor. Bu sayede moderasyon ve geri alma mümkün.

### Post Sabitleme
- Sadece admin'ler post sabitleyebilir
- Sabitlenmiş postlar RightSidebar'da "Resmi Duyurular" bölümünde gösteriliyor
- Maksimum 3 sabitlenmiş post gösteriliyor
- Admin hem üç nokta menüsünden hem de yeni gönderi oluştururken sabitleyebilir

### Etiket Sistemi
- Etiket seçimi opsiyonel
- Baloncuk formatında gösteriliyor
- Seçili etiket kırmızı arka planlı
- Tekrar tıklayınca seçim kaldırılabiliyor

## Sonraki Adımlar

### Kısa Vadeli (Öncelikli)
1. **Post Düzenleme** - Kullanıcılar kendi postlarını düzenleyebilmeli
2. **Image Upload** - Firebase Storage ile resim yükleme
3. **User Profil Sayfası** - `/user/[nickname]` route

### Orta Vadeli
1. Topic filtreleme sayfası (`/topic/[slug]`)
2. Firestore security rules güncellemesi
3. Bildirimler sistemi

### Uzun Vadeli
1. Moderasyon araçları geliştirme
2. Events section (API entegrasyonu)
3. Arama fonksiyonu
4. Nested comments (reply sistemi)

## Önemli Dosyalar

### Sık Düzenlenen
- `components/PostCard.tsx` - Post kartı, oylama, silme, sabitleme
- `components/CreatePostModal.tsx` - Yeni gönderi oluşturma, etiket seçimi, pin toggle
- `app/post/[id]/page.tsx` - Post detay sayfası, yorumlar, sabitleme
- `components/RightSidebar.tsx` - Sabitlenmiş postlar gösterimi
- `lib/posts.ts` - Post CRUD, pin/unpin işlemleri
- `lib/comments.ts` - Yorum CRUD işlemleri

### Dikkat Edilmesi Gerekenler
- `lib/firebase.ts` - Firebase config (env variables gerekli)
- `contexts/AuthContext.tsx` - Auth state yönetimi
- `types/index.ts` - TypeScript tanımları (Post, Comment, User)

## Geliştirme Notları

### Test İçin
Firebase console'dan test kullanıcısı ve post'ları oluşturabilirsin. Firestore'daki collection'lar:
- `users` - Kullanıcılar (role: 'admin' ile admin yapılabilir)
- `posts` - Gönderiler (pinned: true ile sabitlenebilir)
- `comments` - Yorumlar
- `votes` - Oylar

### Debugging
- Browser console'da Firebase hataları görülebilir
- Network tab'da Firestore istekleri izlenebilir
- AuthContext'teki `loading` state'i kontrol edilebilir
- Post detay sayfasında console.log'lar var (debug için)

### Admin Yapma
Firebase Console > Firestore > `users` collection'ında ilgili kullanıcının `role` alanını `"admin"` olarak değiştir.
