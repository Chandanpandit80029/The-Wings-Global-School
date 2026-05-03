// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDf_xiuaaFLE7ETuZzlxI85LWh--ZIjCDk",
  authDomain: "wings-global-school.firebaseapp.com",
  projectId: "wings-global-school",
  storageBucket: "wings-global-school.firebasestorage.app",
  messagingSenderId: "166356429401",
  appId: "1:166356429401:web:a3896881765528b4e05f48",
  measurementId: "G-7ZYZ4LJP9P"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics (only in browser environment)
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export { analytics }

export default app