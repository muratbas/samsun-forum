import { Timestamp } from 'firebase/firestore'

// Kullanıcı tipi
export interface User {
  uid: string
  email: string
  nickname: string
  displayName: string
  photoURL: string
  role: 'user' | 'moderator' | 'admin'
  createdAt: Timestamp
  banned: boolean
  banExpires?: Timestamp
  postCount: number
  karma: number
}

// Post tipi
export interface Post {
  id: string
  authorId: string
  authorNickname: string
  authorPhotoURL: string
  authorRole?: 'user' | 'moderator' | 'admin'
  title: string
  content?: string
  imageUrl?: string
  topicId: string
  topicName: string
  upvotes: number
  downvotes: number
  score: number
  commentCount: number
  pinned: boolean
  pinnedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  deleted: boolean
}

// Topic (Konu) tipi
export interface Topic {
  id: string
  name: string
  slug: string
  description: string
  color: string
  postCount: number
  subscriberCount: number
  createdAt: Timestamp
  order: number
  active: boolean
}

// Oy tipi
export interface Vote {
  userId: string
  postId: string
  type: 'upvote' | 'downvote'
  createdAt: Timestamp
}

// Yorum tipi
export interface Comment {
  id: string
  postId: string
  authorId: string
  authorNickname: string
  authorPhotoURL: string
  authorRole?: 'user' | 'moderator' | 'admin'
  content: string
  createdAt: Timestamp
  updatedAt: Timestamp
  deleted: boolean
  score?: number
}

// Etkinlik tipi
export interface Event {
  id: string
  title: string
  description: string
  location: string
  date: Timestamp
  category: string
  imageUrl?: string
  source?: string
  externalUrl?: string
  createdBy: string
  createdAt: Timestamp
}

