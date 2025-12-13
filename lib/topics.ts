export interface Topic {
  id: string
  name: string
  slug: string
  icon: string // Material Symbol icon name
  iconColor?: string // Special color for icon (e.g., 'samsunspor' for red)
  description: string
}

export const TOPICS: Topic[] = [
  {
    id: 'final-haftasi',
    name: 'FinalHaftası',
    slug: 'final-haftasi',
    icon: 'assignment_late',
    description: 'Final haftası stresi, notlar ve yardımlaşma'
  },
  {
    id: 'sinav',
    name: 'Sınav',
    slug: 'sinav',
    icon: 'edit_note',
    description: 'Sınavlar, vizeler ve bütünlemeler'
  },
  {
    id: 'kulupler',
    name: 'Kulüpler',
    slug: 'kulupler',
    icon: 'groups',
    description: 'Öğrenci kulüpleri ve toplulukları'
  },
  {
    id: 'etkinlik',
    name: 'Etkinlik',
    slug: 'etkinlik',
    icon: 'event',
    description: 'Kampüs içi ve dışı tüm etkinlikler'
  },
  {
    id: 'konser',
    name: 'Konser',
    slug: 'konser',
    icon: 'music_note',
    description: 'Konserler ve müzik etkinlikleri'
  },
  {
    id: 'samsunspor',
    name: 'Samsunspor',
    slug: 'samsunspor',
    icon: 'sports_soccer',
    iconColor: '#E30613', // Samsunspor Kırmızısı
    description: 'Şehrin takımı hakkında her şey'
  },
  {
    id: 'gundem',
    name: 'Gündem',
    slug: 'gundem',
    icon: 'newspaper',
    description: 'Şehir ve kampüs gündemi'
  },
  {
    id: 'soru',
    name: 'Soru',
    slug: 'soru',
    icon: 'help',
    description: 'Merak ettiklerinizi sorun, cevaplayalım'
  },
  {
    id: 'kultur-sanat',
    name: 'Kültür & Sanat',
    slug: 'kultur-sanat',
    icon: 'theater_comedy',
    description: 'Sinema, tiyatro, sergi ve sanat'
  },
  {
    id: 'teknoloji',
    name: 'Teknoloji',
    slug: 'teknoloji',
    icon: 'devices',
    description: 'Yazılım, donanım ve teknoloji dünyası'
  },
  {
    id: 'genel',
    name: 'Genel',
    slug: 'genel',
    icon: 'public',
    description: 'Genel konular ve sohbet'
  }
]

export const getTopicById = (id: string): Topic | undefined => {
  return TOPICS.find(topic => topic.id === id)
}

export const getTopicBySlug = (slug: string): Topic | undefined => {
  return TOPICS.find(topic => topic.slug === slug)
}
