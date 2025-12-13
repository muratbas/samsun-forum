import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from './firebase'
import { Vote } from '@/types'
import { updatePostScore } from './posts'
import { updateCommentScore } from './comments'

// Kullanıcının bir post için oyunu getir
export const getUserVote = async (userId: string, postId: string): Promise<'upvote' | 'downvote' | null> => {
  try {
    const voteId = `${userId}_${postId}`
    const voteDoc = await getDoc(doc(db, 'votes', voteId))
    
    if (voteDoc.exists()) {
      const vote = voteDoc.data() as Vote
      return vote.type
    }
    
    return null
  } catch (error) {
    console.error('Oy getirme hatası:', error)
    return null
  }
}

// Upvote Post
export const upvotePost = async (userId: string, postId: string) => {
  try {
    const voteId = `${userId}_${postId}`
    const voteRef = doc(db, 'votes', voteId)
    const voteDoc = await getDoc(voteRef)
    
    // Mevcut oyu kontrol et
    const existingVote = voteDoc.exists() ? (voteDoc.data() as Vote).type : null
    
    if (existingVote === 'upvote') {
      // Zaten upvote atmış, kaldır
      await deleteDoc(voteRef)
      
      // Karma güncellemesi kaldırıldı
      
      // Post'un upvote sayısını azalt
      const postDoc = await getDoc(doc(db, 'posts', postId))
      if (postDoc.exists()) {
        const post = postDoc.data()
        await updatePostScore(postId, post.upvotes - 1, post.downvotes)
      }
      
      return { type: null, changed: true }
    } else if (existingVote === 'downvote') {
      // Downvote'tan upvote'a geç
      await setDoc(voteRef, {
        userId,
        postId,
        type: 'upvote',
        createdAt: serverTimestamp()
      })
      
      // Karma güncellemesi kaldırıldı
      
      // Post'un vote sayılarını güncelle
      const postDoc = await getDoc(doc(db, 'posts', postId))
      if (postDoc.exists()) {
        const post = postDoc.data()
        await updatePostScore(postId, post.upvotes + 1, post.downvotes - 1)
      }
      
      return { type: 'upvote', changed: true }
    } else {
      // Yeni upvote
      await setDoc(voteRef, {
        userId,
        postId,
        type: 'upvote',
        createdAt: serverTimestamp()
      })
      
      // Karma güncellemesi kaldırıldı
      
      // Post'un upvote sayısını artır
      const postDoc = await getDoc(doc(db, 'posts', postId))
      if (postDoc.exists()) {
        const post = postDoc.data()
        await updatePostScore(postId, post.upvotes + 1, post.downvotes)
      }
      
      return { type: 'upvote', changed: true }
    }
  } catch (error) {
    console.error('Upvote hatası:', error)
    throw error
  }
}

// Downvote Post
export const downvotePost = async (userId: string, postId: string) => {
  try {
    const voteId = `${userId}_${postId}`
    const voteRef = doc(db, 'votes', voteId)
    const voteDoc = await getDoc(voteRef)
    
    // Mevcut oyu kontrol et
    const existingVote = voteDoc.exists() ? (voteDoc.data() as Vote).type : null
    
    if (existingVote === 'downvote') {
      // Zaten downvote atmış, kaldır
      await deleteDoc(voteRef)
      
      const postDoc = await getDoc(doc(db, 'posts', postId))
      if (postDoc.exists()) {
        const post = postDoc.data()
        await updatePostScore(postId, post.upvotes, post.downvotes - 1)
      }
      
      return { type: null, changed: true }
    } else if (existingVote === 'upvote') {
      // Upvote'tan downvote'a geç
      await setDoc(voteRef, {
        userId,
        postId,
        type: 'downvote',
        createdAt: serverTimestamp()
      })
      
      // Karma güncellemesi kaldırıldı
      
      const postDoc = await getDoc(doc(db, 'posts', postId))
      if (postDoc.exists()) {
        const post = postDoc.data()
        await updatePostScore(postId, post.upvotes - 1, post.downvotes + 1)
      }
      
      return { type: 'downvote', changed: true }
    } else {
      // Yeni downvote
      await setDoc(voteRef, {
        userId,
        postId,
        type: 'downvote',
        createdAt: serverTimestamp()
      })
      
      const postDoc = await getDoc(doc(db, 'posts', postId))
      if (postDoc.exists()) {
        const post = postDoc.data()
        await updatePostScore(postId, post.upvotes, post.downvotes + 1)
      }
      
      return { type: 'downvote', changed: true }
    }
  } catch (error) {
    console.error('Downvote hatası:', error)
    throw error
  }
}

// Kullanıcının bir yorum için oyunu getir
export const getUserCommentVote = async (userId: string, commentId: string): Promise<'upvote' | 'downvote' | null> => {
  try {
    const voteId = `${userId}_${commentId}`
    const voteDoc = await getDoc(doc(db, 'comment_votes', voteId))
    
    if (voteDoc.exists()) {
      const vote = voteDoc.data() as { type: 'upvote' | 'downvote' }
      return vote.type
    }
    
    return null
  } catch (error) {
    console.error('Yorum oyu getirme hatası:', error)
    return null
  }
}

// Upvote Comment
export const upvoteComment = async (userId: string, commentId: string) => {
  try {
    const voteId = `${userId}_${commentId}`
    const voteRef = doc(db, 'comment_votes', voteId)
    const voteDoc = await getDoc(voteRef)
    
    const existingVote = voteDoc.exists() ? (voteDoc.data() as { type: 'upvote' | 'downvote' }).type : null
    
    // Yorumun mevcut skorunu al
    const commentRef = doc(db, 'comments', commentId)
    const commentDoc = await getDoc(commentRef)
    if (!commentDoc.exists()) throw new Error('Yorum bulunamadı')
    const currentScore = commentDoc.data().score || 0

    if (existingVote === 'upvote') {
      // Kaldır
      await deleteDoc(voteRef)
      await updateCommentScore(commentId, currentScore - 1)
      return { type: null, changed: true }
    } else if (existingVote === 'downvote') {
      // Değiştir
      await setDoc(voteRef, { userId, commentId, type: 'upvote', createdAt: serverTimestamp() })
      await updateCommentScore(commentId, currentScore + 2)
      return { type: 'upvote', changed: true }
    } else {
      // Yeni
      await setDoc(voteRef, { userId, commentId, type: 'upvote', createdAt: serverTimestamp() })
      await updateCommentScore(commentId, currentScore + 1)
      return { type: 'upvote', changed: true }
    }
  } catch (error) {
    console.error('Comment Upvote hatası:', error)
    throw error
  }
}

// Downvote Comment
export const downvoteComment = async (userId: string, commentId: string) => {
  try {
    const voteId = `${userId}_${commentId}`
    const voteRef = doc(db, 'comment_votes', voteId)
    const voteDoc = await getDoc(voteRef)
    
    const existingVote = voteDoc.exists() ? (voteDoc.data() as { type: 'upvote' | 'downvote' }).type : null
    
    const commentRef = doc(db, 'comments', commentId)
    const commentDoc = await getDoc(commentRef)
    if (!commentDoc.exists()) throw new Error('Yorum bulunamadı')
    const currentScore = commentDoc.data().score || 0

    if (existingVote === 'downvote') {
      // Kaldır
      await deleteDoc(voteRef)
      await updateCommentScore(commentId, currentScore + 1)
      return { type: null, changed: true }
    } else if (existingVote === 'upvote') {
      // Değiştir
      await setDoc(voteRef, { userId, commentId, type: 'downvote', createdAt: serverTimestamp() })
      await updateCommentScore(commentId, currentScore - 2)
      return { type: 'downvote', changed: true }
    } else {
      // Yeni
      await setDoc(voteRef, { userId, commentId, type: 'downvote', createdAt: serverTimestamp() })
      await updateCommentScore(commentId, currentScore - 1)
      return { type: 'downvote', changed: true }
    }
  } catch (error) {
    console.error('Comment Downvote hatası:', error)
    throw error
  }
}

// Kullanıcının tüm oylarını getir
export const getUserVotes = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'votes'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    const votes: Record<string, 'upvote' | 'downvote'> = {}
    
    querySnapshot.forEach((doc) => {
      const vote = doc.data() as Vote
      votes[vote.postId] = vote.type
    })
    
    return votes
  } catch (error) {
    console.error('Kullanıcı oyları getirme hatası:', error)
    return {}
  }
}
