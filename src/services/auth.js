import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  confirmPasswordReset,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
}

// Check if user is admin
export const checkIfAdmin = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.role === USER_ROLES.ADMIN
    }
    return false
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Check if user is admin
    const isAdmin = await checkIfAdmin(user.uid)
    
    if (!isAdmin) {
      await signOut(auth)
      throw new Error('Access denied. Admin privileges required.')
    }
    
    return { user, isAdmin }
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

// Get current user
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe()
      if (user) {
        try {
          const isAdmin = await checkIfAdmin(user.uid)
          resolve({ ...user, isAdmin })
        } catch (error) {
          resolve(user)
        }
      } else {
        resolve(null)
      }
    }, reject)
  })
}

// Auth state listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const isAdmin = await checkIfAdmin(user.uid)
        callback({ ...user, isAdmin })
      } catch (error) {
        callback(user)
      }
    } else {
      callback(null)
    }
  })
}

// Send password reset email
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.error('Password reset error:', error)
    throw error
  }
}

// Initialize admin user (one-time setup)
// This should be called from a secure environment or with proper authorization
export const initializeAdminUser = async (email, password, name) => {
  try {
    // Note: This requires Firebase Authentication to be set up with email/password provider
    // In production, admin users should be created through Firebase Console or secure backend
    
    // Create user document in Firestore
    // The actual user creation should be done through Firebase Console for security
    const adminData = {
      email,
      name,
      role: USER_ROLES.ADMIN,
      createdAt: serverTimestamp(),
      lastLogin: null,
    }
    
    // This is just for reference - actual user creation requires Firebase Admin SDK
    console.log('Admin user setup required. Please create user in Firebase Console.')
    return adminData
  } catch (error) {
    console.error('Admin initialization error:', error)
    throw error
  }
}

export default {
  signIn,
  logOut,
  getCurrentUser,
  onAuthStateChange,
  checkIfAdmin,
  sendPasswordReset,
  initializeAdminUser,
  USER_ROLES,
}