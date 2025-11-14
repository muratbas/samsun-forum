import { Timestamp } from 'firebase/firestore'

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

export interface Post {
  id: string
  authorId: string
  authorNickname: string
  title: string
  content?: string
  imageUrl?: string
  topicId: string
  topicName: string
  upvotes: number
  downvotes: number
  score: number
  commentCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
  deleted: boolean
}

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

export interface Vote {
  userId: string
  postId: string
  type: 'upvote' | 'downvote'
  createdAt: Timestamp
}

export interface Event {
  id: string
  title: string
  description: string
  location: string
  date: Timestamp
  imageUrl?: string
  source: string
  externalUrl?: string
}

