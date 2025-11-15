import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Firebase'i başlat (sadece bir kez)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Servisleri başlat
export const auth = getAuth(app)
export const db = getFirestore(app)

// Firestore'u kesinlikle online moda zorla (offline cache sorunlarını çözer)
if (typeof window !== 'undefined') {
  // Önce disable sonra enable yaparak network'ü reset et
  disableNetwork(db)
    .then(() => enableNetwork(db))
    .catch((error) => {
      console.error('Firestore network reset hatası:', error)
    })
}

export default app

