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
    id: 'yemek',
    name: 'Yemek',
    slug: 'yemek',
    icon: 'restaurant',
    description: 'Restoranlar, tarifler ve lezzet önerileri'
  },
  {
    id: 'etkinlik',
    name: 'Etkinlik',
    slug: 'etkinlik',
    icon: 'celebration',
    description: 'Konserler, festivaller ve etkinlikler'
  },
  {
    id: 'samsunspor',
    name: 'Samsunspor',
    slug: 'samsunspor',
    icon: 'bolt',
    description: 'Samsunspor haberleri ve tartışmaları'
  },
  {
    id: 'trafik',
    name: 'Trafik',
    slug: 'trafik',
    icon: 'traffic',
    description: 'Trafik durumu ve ulaşım bilgileri'
  },
  {
    id: 'gundem',
    name: 'Gündem',
    slug: 'gundem',
    icon: 'newspaper',
    description: 'Şehir gündemi ve genel konular'
  },
  {
    id: 'soru',
    name: 'Soru',
    slug: 'soru',
    icon: 'help',
    description: 'Merak ettiklerinizi sorun'
  },
  {
    id: 'kultur',
    name: 'Kültür & Sanat',
    slug: 'kultur',
    icon: 'theater_comedy',
    description: 'Müzeler, sergiler ve sanat etkinlikleri'
  },
  {
    id: 'teknoloji',
    name: 'Teknoloji',
    slug: 'teknoloji',
    icon: 'computer',
    description: 'Teknoloji haberleri ve tartışmaları'
  }
]

export const getTopicById = (id: string): Topic | undefined => {
  return TOPICS.find(topic => topic.id === id)
}

export const getTopicBySlug = (slug: string): Topic | undefined => {
  return TOPICS.find(topic => topic.slug === slug)
}

