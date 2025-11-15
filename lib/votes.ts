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

// Upvote
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
      
      // Post'un karma değerini güncelle
      await updateDoc(doc(db, 'users', userId), {
        karma: increment(-1)
      })
      
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
      
      // Karma +2 (downvote kaldır +1, upvote ekle +1)
      await updateDoc(doc(db, 'users', userId), {
        karma: increment(2)
      })
      
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
      
      // Karma +1
      await updateDoc(doc(db, 'users', userId), {
        karma: increment(1)
      })
      
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

// Downvote
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
      
      // Karma değişmez (downvote kaldırılınca etki yok)
      
      // Post'un downvote sayısını azalt
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
      
      // Karma -1 (upvote kaldır)
      await updateDoc(doc(db, 'users', userId), {
        karma: increment(-1)
      })
      
      // Post'un vote sayılarını güncelle
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
      
      // Karma değişmez (downvote karma etkilemez)
      
      // Post'un downvote sayısını artır
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

// Kullanıcının tüm oylarını getir (opsiyonel - profil sayfası için)
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

