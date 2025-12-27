import React from 'react'

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 md:p-10 shadow-sm">
        <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark mb-2">
          Topluluk Kuralları
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg mb-10 leading-relaxed">
          OMÜForum, sağlıklı düşünce alışverişini ve akademik yardımlaşmayı hedefleyen bir platformdur. 
          Bu ortamın kalitesini korumak için lütfen aşağıdaki kurallara dikkat ediniz.
        </p>

        <div className="space-y-10">
          
          {/* 1. Kural */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
              Saygı ve Üslup
            </h2>
            <div className="space-y-4 pl-10 border-l-2 border-border-light dark:border-border-dark py-1">
              <div>
                <strong className="block text-text-primary-light dark:text-text-primary-dark mb-1">Hakaret Yasaktır</strong>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
                  Hiçbir kullanıcıya, öğrenciye veya öğretim görevlisine yönelik hakaret, aşağılama, küfür veya nefret söylemi içeren paylaşımlar yapılamaz. Eleştiriler yapıcı ve nazik bir dille yapılmalıdır.
                </p>
              </div>
              <div>
                <strong className="block text-text-primary-light dark:text-text-primary-dark mb-1">Kişisel Saldırı</strong>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
                  Tartışmalar fikirler üzerinden yürütülmelidir, kişisel özellikler üzerinden saldırı yasaktır.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Kural */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
              Akademik Dürüstlük ve Güvenlik
            </h2>
            <div className="space-y-4 pl-10 border-l-2 border-border-light dark:border-border-dark py-1">
              <div>
                <strong className="block text-text-primary-light dark:text-text-primary-dark mb-1">Hoca Değerlendirmeleri</strong>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
                  Akademisyenler hakkındaki yorumlar sadece eğitim süreci ve ders işleyişi ile ilgili olmalıdır. Kişisel hayatı hedef alan veya asılsız iftira niteliği taşıyan yorumlar doğrudan silinir.
                </p>
              </div>
              <div>
                <strong className="block text-text-primary-light dark:text-text-primary-dark mb-1">Kişisel Verilerin Korunması</strong>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
                   Kendinizin veya bir başkasının telefon numarası, TC kimlik numarası veya özel hayatın gizliliğini ihlal eden verilerini paylaşmak kesinlikle yasaktır.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Kural */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
              İçerik Düzeni
            </h2>
            <div className="space-y-4 pl-10 border-l-2 border-border-light dark:border-border-dark py-1">
              <div>
                <strong className="block text-text-primary-light dark:text-text-primary-dark mb-1">Spam ve Reklam</strong>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
                  Sürekli aynı şeyi paylaşmak (spam) veya platformun amacıyla ilgisiz ticari reklamlar yapmak yasaktır.
                </p>
              </div>
              <div>
                <strong className="block text-text-primary-light dark:text-text-primary-dark mb-1">Kategori Uyumu</strong>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
                  Konu başlıkları, içeriğe en uygun kategori altında açılmalıdır (Örn: Bir dersle ilgili soru, o fakültenin/bölümün başlığı altında olmalıdır).
                </p>
              </div>
            </div>
          </section>

          {/* 4. Kural */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">4</span>
              Akademik Etik
            </h2>
            <div className="space-y-4 pl-10 border-l-2 border-border-light dark:border-border-dark py-1">
              <div>
                <strong className="block text-text-primary-light dark:text-text-primary-dark mb-1">Ödev ve Sınav Paylaşımları</strong>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
                   Sınav sorularının sızdırılması veya etik olmayan yöntemlerle akademik kopya teşviki yapılması yasaktır. Ancak ders notu paylaşımı ve çalışma grupları oluşturulması teşvik edilir.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Kural */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">5</span>
              Yasal Sorumluluk
            </h2>
            <div className="space-y-4 pl-10 border-l-2 border-border-light dark:border-border-dark py-1">
              <div>
                <strong className="block text-text-primary-light dark:text-text-primary-dark mb-1">Sorumluluk Reddi</strong>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
                  omu.muratbas.com üzerinde paylaşılan her türlü görüş ve içerik, içeriği paylaşan kullanıcının sorumluluğundadır. Site yönetimi, paylaşılan içeriklerden dolayı hukuki sorumluluk kabul etmez.
                </p>
              </div>
              <div>
                <strong className="block text-text-primary-light dark:text-text-primary-dark mb-1">Moderasyon</strong>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
                   Site yönetimi, kurallara uymayan içerikleri silme, düzenleme veya ilgili kullanıcıyı platformdan uzaklaştırma hakkını saklı tutar.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
