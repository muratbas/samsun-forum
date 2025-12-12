import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  Timestamp,
  serverTimestamp,
  getDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { Event } from '@/types'

// Yeni etkinlik oluştur
export async function createEvent(
  title: string,
  description: string,
  location: string,
  date: Date,
  category: string,
  userId: string
) {
  try {
    // Admin kontrolü client side'da zaten yapılıyor, asıl güvenlik Firestore Rules'da olmalı.
    // Veritabanından tekrar okumaya çalışmak permission hatasına sebep olabiliyor.

    const eventData = {
      title,
      description,
      location,
      date: Timestamp.fromDate(date),
      category,
      createdBy: userId,
      createdAt: serverTimestamp(),
      source: 'omüforum'
    }

    const docRef = await addDoc(collection(db, 'events'), eventData)
    return docRef.id
  } catch (error) {
    console.error('Error creating event:', error)
    throw error
  }
}

// Gelecek etkinlikleri getir (RightSidebar için)
export async function getUpcomingEvents(limitCount: number = 5) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Bugünü sabahına al

    const q = query(
      collection(db, 'events'),
      where('date', '>=', Timestamp.fromDate(today)),
      orderBy('date', 'asc'),
    ) // Limit burada query'e eklenirse iyi olur ama client side filter da yapabiliriz

    const querySnapshot = await getDocs(q)
    const allEvents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[]

    // Client-side limit (Firestore limit'i bazen orderBy ile index isteyebilir, index yoksa patlamasın diye burada kesiyorum)
    return allEvents.slice(0, limitCount)
  } catch (error) {
    console.error('Error getting upcoming events:', error)
    return [] // Hata durumunda boş dizi dön, UI patlamasın
  }
}

// Etkinlikleri getir (Aylık filtreleme yapılabilir ama şimdilik hepsini veya gelecektekileri çekelim)
export async function getEvents() {
  try {
    // Tarihe göre sıralı getir
    const q = query(
      collection(db, 'events'),
      orderBy('date', 'asc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[]
  } catch (error) {
    console.error('Error getting events:', error)
    throw error
  }
}

// Etkinlik sil
export async function deleteEvent(eventId: string, userId: string) {
  try {
    // Admin kontrolü Firestore Rules'a bırakıldı.
    
    await deleteDoc(doc(db, 'events', eventId))
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error
  }
}
