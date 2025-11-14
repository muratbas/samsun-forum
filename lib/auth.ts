import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  collection,
  serverTimestamp 
} from 'firebase/firestore'
import { auth, db } from './firebase'

// Google ile giriş yap
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    prompt: 'select_account'
  })
  
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error('Google ile giriş hatası:', error)
    throw error
  }
}

// Çıkış yap
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Çıkış hatası:', error)
    throw error
  }
}

// Kullanıcı var mı kontrol et
export const checkUserExists = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    return userDoc.exists()
  } catch (error) {
    console.error('Kullanıcı kontrolü hatası:', error)
    return false
  }
}

// Yeni kullanıcı oluştur
export const createUser = async (
  uid: string, 
  email: string, 
  nickname: string,
  displayName: string,
  photoURL: string
) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      nickname,
      displayName,
      photoURL,
      role: 'user',
      createdAt: serverTimestamp(),
      banned: false,
      postCount: 0,
      karma: 0
    })
    return true
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error)
    throw error
  }
}

// Nickname kullanımda mı kontrol et
export const checkNicknameAvailable = async (nickname: string) => {
  try {
    // Tüm kullanıcıları kontrol et (production'da index ekle!)
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const nicknameExists = usersSnapshot.docs.some(
      doc => doc.data().nickname.toLowerCase() === nickname.toLowerCase()
    )
    return !nicknameExists
  } catch (error) {
    console.error('Nickname kontrolü hatası:', error)
    return false
  }
}

// Auth state değişimini dinle
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

