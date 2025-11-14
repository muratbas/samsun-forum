import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { Post } from '@/types'

// Yeni post oluştur
export const createPost = async (
  authorId: string,
  authorNickname: string,
  title: string,
  content: string,
  topicId: string,
  topicName: string
) => {
  try {
    const postData = {
      authorId,
      authorNickname,
      title,
      content,
      topicId,
      topicName,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deleted: false
    }

    const docRef = await addDoc(collection(db, 'posts'), postData)
    return docRef.id
  } catch (error) {
    console.error('Post oluşturma hatası:', error)
    throw error
  }
}

// Post'ları getir (sıralama ile)
export const getPosts = async (sortBy: 'popular' | 'new' | 'top' = 'popular', limitCount = 20) => {
  try {
    let q

    switch (sortBy) {
      case 'new':
        q = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        )
        break
      case 'top':
        q = query(
          collection(db, 'posts'),
          orderBy('upvotes', 'desc'),
          limit(limitCount)
        )
        break
      case 'popular':
      default:
        q = query(
          collection(db, 'posts'),
          orderBy('score', 'desc'),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        )
        break
    }

    const querySnapshot = await getDocs(q)
    const posts: Post[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp
      } as Post)
    })

    return posts
  } catch (error) {
    console.error('Post getirme hatası:', error)
    return []
  }
}

// Topic'e göre post'ları getir
export const getPostsByTopic = async (topicSlug: string, limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('topicSlug', '==', topicSlug),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const posts: Post[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp
      } as Post)
    })

    return posts
  } catch (error) {
    console.error('Topic post getirme hatası:', error)
    return []
  }
}

