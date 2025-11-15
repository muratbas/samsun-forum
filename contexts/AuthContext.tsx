'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { onAuthChange } from '@/lib/auth'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  refreshUser: async () => {}
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (firebaseUser: FirebaseUser, retryCount = 0) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      
      if (userDoc.exists()) {
        setUser(userDoc.data() as User)
      } else {
        setUser(null)
      }
    } catch (error: any) {
      // Eğer offline hatası ve retry hakkı varsa, tekrar dene
      if (error?.code === 'unavailable' && retryCount < 3) {
        console.log(`Firestore offline, tekrar deneniyor (${retryCount + 1}/3)...`)
        await new Promise(resolve => setTimeout(resolve, 500))
        return fetchUserData(firebaseUser, retryCount + 1)
      }
      
      console.error('Kullanıcı verisi getirme hatası:', error)
      setUser(null)
    }
  }

  const refreshUser = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        await fetchUserData(firebaseUser)
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

