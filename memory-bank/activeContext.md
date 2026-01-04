# Active Context

## Current Focus

Entegrasyon ve UI iyileştirmeleri tamamlandı.

- **Login/Register:** `/login` ve `/register` sayfaları tam fonksiyonel (Google + Email/Pass).
- **Header:** Gizlendi.
- **Weather:** Aktif.
- **Sorting:** Aktif.

## Recent Changes

31. **Feature** - `/login` ve `/register` sayfaları eklendi. Google Auth ve Email/Password Auth entegrasyonu tamamlandı.
32. **Feature** - Register sayfasında Nickname seçimi ve Firestore kaydı entegre edildi.
33. **Refactor** - `lib/auth.ts` içine email/pass fonksiyonları eklendi.

## Active Decisions

- **Auth Flow:** Google Login -> Nickname Modal (Header). Email Register -> Formda Nickname -> Direkt Giriş.
- **Sorting:** "Popular" client-side sort ediliyor (Firestore limitasyonu).

## Next Steps

- Production Deploy.
- Test kullanıcıları ile deneme.
