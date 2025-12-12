export const ataturkQuotes = [
  "Hayatta en hakiki mürşit ilimdir.",
  "Egemenlik, kayıtsız şartsız milletindir.",
  "Yurtta sulh, cihanda sulh.",
  "Beni görmek demek mutlaka yüzümü görmek demek değildir. Benim fikirlerimi, benim duygularımı anlıyorsanız ve hissediyorsanız bu kafidir.",
  "Gelecek gençlerin, gençler ise öğretmenlerin eseridir.",
  "Ey yükselen yeni nesil! İstikbal sizsiniz. Cumhuriyeti biz kurduk, onu yükseltecek ve yaşatacak sizsiniz.",
  "Türk milleti çalışkandır, Türk milleti zekidir.",
  "Ne mutlu Türk'üm diyene!",
  "Sanatsız kalan bir milletin hayat damarlarından biri kopmuş demektir.",
  "Hiçbir şeye ihtiyacımız yok, yalnız bir şeye ihtiyacımız vardır; çalışkan olmak!",
  "Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.",
  "Öğretmenler; Yeni nesli, Cumhuriyetin fedakâr öğretmen ve eğitimcilerini, sizler yetiştireceksiniz ve yeni nesil, sizin eseriniz olacaktır.",
  "Dünyada her şey için, medeniyet için, hayat için, başarı için, en hakiki mürşit ilimdir, fendir.",
  "Bir millet ki resim yapmaz, bir millet ki heykel yapmaz, bir millet ki tekniğin gerektirdiği şeyleri yapmaz, itiraf etmeli ki o milletin ilerleme yolunda yeri yoktur.",
  "Medeniyetin emir ve talep ettiğini yapmak insan olmak için yeterlidir.",
  "Ben sporcunun zeki, çevik ve aynı zamanda ahlaklısını severim.",
  "Tarih yazmak, tarih yapmak kadar mühimdir. Yazan yapana sadık kalmazsa değişmeyen hakikat, insanlığı şaşırtacak bir mahiyet alır.",
  "Bilelim ki milli benliğini bilmeyen milletler başka milletlere yem olurlar.",
  "Türk milletinin karakteri yüksektir. Türk milleti çalışkandır. Türk milleti zekidir.",
  "Siz orada yalnız düşmanı değil, milletin makûs talihini de yendiniz.",
  "Dinlenmemek üzere yürümeye karar verenler, asla ve asla yorulmazlar.",
  "Zafer, 'Zafer benimdir' diyebilenindir. Başarı ise, 'Başaracağım' diye başlayarak sonunda 'Başardım' diyebilenindir.",
  "Milli egemenlik öyle bir nurdur ki, onun karşısında zincirler erir, taç ve tahtlar yanar, mahvolur.",
  "Hürriyet ve istiklal benim karakterimdir."
]

export function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * ataturkQuotes.length)
  return ataturkQuotes[randomIndex]
}
