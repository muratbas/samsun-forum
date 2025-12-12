# OMÜForum - Proje Özeti

## Proje Adı
OMÜForum - Ondokuz Mayıs Üniversitesi Öğrenci Forumu

## Proje Türü
Üniversite Öğrenci Forumu - Hyper-local Forum Platformu

## Temel Amaç
Ondokuz Mayıs Üniversitesi öğrencilerine özel, yerel bir forum platformu oluşturmak. Reddit benzeri bir yapıda, öğrencilerin gönderi paylaşabildiği, oylama yapabildiği, yorum yapabildiği ve topluluk oluşturabildiği modern bir platform.

## Hedef Kitle
- OMÜ öğrencileri
- OMÜ mezunları
- Üniversiteye ilgi duyan kişiler
- Kampüs etkinliklerini takip etmek isteyenler

## Temel Özellikler (MVP)

### ✅ Tamamlanmış
1. **Responsive Tasarım** - Mobile, tablet ve desktop uyumlu layout
2. **Authentication** - Google OAuth ile giriş/kayıt
3. **Nickname Sistemi** - Kullanıcı adı seçimi (3-20 karakter)
4. **Post Oluşturma** - Başlık (max 50), içerik (max 2000) ve etiket seçimi ile gönderi paylaşma
5. **Post Detay Sayfası** - `/post/[id]` route ile tam post görünümü
6. **Yorum Sistemi** - Post'lara yorum yapabilme
7. **Oylama Sistemi** - Thumbs up/down işlevselliği
8. **Karma Sistemi** - Kullanıcı puanları
9. **Topic Kategorileri** - Etiket sistemi (baloncuk formatında)
10. **Sıralama** - Popüler/Yeni/En Çok Oylanan
11. **Dark/Light Mode** - Tema değiştirme (varsayılan: dark)
12. **URL Linkify** - Post içindeki linkleri tıklanabilir yapma
13. **Post Silme** - Kullanıcılar kendi postlarını silebilir
14. **Admin Sistemi** - Admin rolü ve badge gösterimi
15. **Post Sabitleme** - Admin'ler postları resmi duyuru olarak sabitleyebilir

### 📋 Planlanan
1. User profilleri
2. Moderasyon araçları
3. Events section (etkinlik takvimi) - API entegrasyonu
4. Arama fonksiyonu
5. Post düzenleme
6. Bildirimler

## Proje Kısıtlamaları
- Firebase ücretsiz tier limitleri
- Tek geliştirici

## Başarı Kriterleri
- [x] Kullanıcılar gönderi paylaşabilmeli
- [x] Oylama sistemi çalışmalı
- [x] Responsive tasarım olmalı
- [x] Google OAuth ile giriş yapılabilmeli
- [x] Comment sistemi entegre edilmeli
- [x] Post detay sayfası olmalı
- [x] Admin sistemi çalışmalı
