import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import { getAnalytics } from 'firebase/analytics'
const firebaseConfig = {
  apiKey: 'AIzaSyCvzuRWPcO-o1-bVBaLMambW6VMbPiAKRo',
  authDomain: 'ai-task-hub-48d7d.firebaseapp.com',
  projectId: 'ai-task-hub-48d7d',
  storageBucket: 'ai-task-hub-48d7d.firebasestorage.app',
  messagingSenderId: '972125321460',
  appId: '1:972125321460:web:fa6ff6eebd4b4c047586a1',
  measurementId: 'G-4BDYRDM8F7'
}
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)
export const analytics = getAnalytics(app)
