import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from './firebase'
import { Post } from '@/types'

// Yeni post oluştur
export const createPost = async (
  authorId: string,
  authorNickname: string,
  authorPhotoURL: string,
  title: string,
  content: string,
  topicId: string,
  topicName: string,
  imageUrl?: string
) => {
  try {
    const postData = {
      authorId,
      authorNickname,
      authorPhotoURL,
      title,
      content: content || '',
      imageUrl: imageUrl || '',
      topicId,
      topicName,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deleted: false,
    }

    const docRef = await addDoc(collection(db, 'posts'), postData)
    
    // Kullanıcının post sayısını artır
    await updateDoc(doc(db, 'users', authorId), {
      postCount: increment(1)
    })

    return docRef.id
  } catch (error) {
    console.error('Post oluşturma hatası:', error)
    throw error
  }
}

// Tüm postları getir (sıralama ile)
export const getPosts = async (sortBy: 'new' | 'hot' | 'top' = 'hot', limitCount = 50) => {
  try {
    let q
    
    if (sortBy === 'new') {
      q = query(
        collection(db, 'posts'),
        where('deleted', '==', false),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
    } else if (sortBy === 'top') {
      q = query(
        collection(db, 'posts'),
        where('deleted', '==', false),
        orderBy('score', 'desc'),
        limit(limitCount)
      )
    } else {
      // hot: sadece score'a göre sırala (index gerekmez)
      q = query(
        collection(db, 'posts'),
        where('deleted', '==', false),
        orderBy('score', 'desc'),
        limit(limitCount)
      )
    }

    const querySnapshot = await getDocs(q)
    const posts: Post[] = []

    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post)
    })

    return posts
  } catch (error) {
    console.error('Postları getirme hatası:', error)
    throw error
  }
}

// Belirli bir topic'e ait postları getir
export const getPostsByTopic = async (topicId: string, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('topicId', '==', topicId),
      where('deleted', '==', false),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const posts: Post[] = []

    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post)
    })

    return posts
  } catch (error) {
    console.error('Topic postlarını getirme hatası:', error)
    throw error
  }
}

// Tek bir post getir
export const getPost = async (postId: string) => {
  try {
    const docRef = doc(db, 'posts', postId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Post
    } else {
      throw new Error('Post bulunamadı')
    }
  } catch (error) {
    console.error('Post getirme hatası:', error)
    throw error
  }
}

// Post'u güncelle (sadece yazar)
export const updatePost = async (
  postId: string,
  userId: string,
  updates: { title?: string; content?: string }
) => {
  try {
    const postRef = doc(db, 'posts', postId)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      throw new Error('Post bulunamadı')
    }

    const post = postSnap.data() as Post

    if (post.authorId !== userId) {
      throw new Error('Bu postu düzenleme yetkiniz yok')
    }

    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })

    return true
  } catch (error) {
    console.error('Post güncelleme hatası:', error)
    throw error
  }
}

// Post'u sil (sadece yazar veya admin)
export const deletePost = async (postId: string, userId: string, isAdmin = false) => {
  try {
    const postRef = doc(db, 'posts', postId)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      throw new Error('Post bulunamadı')
    }

    const post = postSnap.data() as Post

    if (post.authorId !== userId && !isAdmin) {
      throw new Error('Bu postu silme yetkiniz yok')
    }

    // Soft delete
    await updateDoc(postRef, {
      deleted: true,
      updatedAt: serverTimestamp()
    })

    // Kullanıcının post sayısını azalt
    await updateDoc(doc(db, 'users', post.authorId), {
      postCount: increment(-1)
    })

    return true
  } catch (error) {
    console.error('Post silme hatası:', error)
    throw error
  }
}

// Post score'unu güncelle
export const updatePostScore = async (postId: string, upvotes: number, downvotes: number) => {
  try {
    const score = upvotes - downvotes
    
    await updateDoc(doc(db, 'posts', postId), {
      upvotes,
      downvotes,
      score
    })

    return true
  } catch (error) {
    console.error('Post score güncelleme hatası:', error)
    throw error
  }
}
