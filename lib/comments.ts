import { 
  collection, 
  doc, 
  addDoc, 
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  updateDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { Comment } from '@/types'

// Yeni yorum oluştur
export const createComment = async (
  postId: string,
  authorId: string,
  authorNickname: string,
  authorPhotoURL: string,
  content: string,
  authorRole?: 'user' | 'moderator' | 'admin'
) => {
  try {
    const commentData = {
      postId,
      authorId,
      authorNickname,
      authorPhotoURL,
      authorRole: authorRole || 'user',
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deleted: false,
    }

    const docRef = await addDoc(collection(db, 'comments'), commentData)
    
    // Post'un yorum sayısını artır
    await updateDoc(doc(db, 'posts', postId), {
      commentCount: increment(1)
    })

    return docRef.id
  } catch (error) {
    console.error('Yorum oluşturma hatası:', error)
    throw error
  }
}

// Bir post'un yorumlarını getir
export const getCommentsByPost = async (postId: string) => {
  try {
    // Basit query - index gerekmez
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId)
    )

    const querySnapshot = await getDocs(q)
    const comments: Comment[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (!data.deleted) {
        comments.push(Object.assign({ id: doc.id }, data) as Comment)
      }
    })

    // Client-side sıralama
    comments.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0
      return a.createdAt.toMillis() - b.createdAt.toMillis()
    })

    return comments
  } catch (error) {
    console.error('Yorumları getirme hatası:', error)
    return [] // Hata olursa boş array dön
  }
}

