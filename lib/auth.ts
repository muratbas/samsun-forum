import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  collection,
  serverTimestamp,
  query,
  where
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

// Email ile Kayıt Ol
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error('Email kayıt hatası:', error)
    throw error
  }
}

// Email ile Giriş Yap
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error('Email giriş hatası:', error)
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

// Yeni kullanıcı oluştur (Firestore)
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

// Nickname'den Email bul (Giriş için)
export const getUserEmailByNickname = async (nickname: string) => {
  try {
    const q = query(collection(db, 'users'), where('nickname', '==', nickname))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return null
    }
    
    // İlk eşleşen dokümanın emailini dön
    const userData = querySnapshot.docs[0].data()
    return userData.email as string
  } catch (error) {
    console.error('Nickname email sorgusu hatası:', error)
    return null
  }
}

// Auth state değişimini dinle
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
