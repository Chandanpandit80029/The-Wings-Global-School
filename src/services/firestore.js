import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/config/firebase'

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  ANNOUNCEMENTS: 'announcements',
  NEWS: 'news',
  EVENTS: 'events',
  FACULTY: 'faculty',
  GALLERY: 'gallery',
  DOWNLOADS: 'downloads',
  ADMISSIONS: 'admissions',
  MESSAGES: 'messages',
}

// Generic CRUD operations
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    throw error
  }
}

export const getDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error)
    throw error
  }
}

export const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    throw error
  }
}

export const deleteDocument = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id))
    return true
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error)
    throw error
  }
}

export const getCollection = async (
  collectionName,
  { orderByField = 'createdAt', orderDirection = 'desc', limitCount = null } = {}
) => {
  try {
    let q = query(collection(db, collectionName))
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection))
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw error
  }
}

export const getCollectionWithFilter = async (collectionName, filters) => {
  try {
    let q = query(collection(db, collectionName))
    
    filters.forEach((filter) => {
      q = query(q, where(filter.field, filter.operator, filter.value))
    })

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error(`Error getting filtered collection ${collectionName}:`, error)
    throw error
  }
}

// Specific collection services

// Announcements
export const announcementService = {
  getAll: () => getCollection(COLLECTIONS.ANNOUNCEMENTS),
  getLatest: (count = 5) => getCollection(COLLECTIONS.ANNOUNCEMENTS, { limitCount: count }),
  getById: (id) => getDocument(COLLECTIONS.ANNOUNCEMENTS, id),
  create: (data) => createDocument(COLLECTIONS.ANNOUNCEMENTS, data),
  update: (id, data) => updateDocument(COLLECTIONS.ANNOUNCEMENTS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.ANNOUNCEMENTS, id),
}

// News
export const newsService = {
  getAll: () => getCollection(COLLECTIONS.NEWS),
  getLatest: (count = 5) => getCollection(COLLECTIONS.NEWS, { limitCount: count }),
  getById: (id) => getDocument(COLLECTIONS.NEWS, id),
  create: (data) => createDocument(COLLECTIONS.NEWS, data),
  update: (id, data) => updateDocument(COLLECTIONS.NEWS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.NEWS, id),
}

// Events
export const eventService = {
  getAll: () => getCollection(COLLECTIONS.EVENTS),
  getUpcoming: () => {
    const now = new Date()
    return getCollectionWithFilter(COLLECTIONS.EVENTS, [
      { field: 'date', operator: '>=', value: Timestamp.fromDate(now) }
    ])
  },
  getById: (id) => getDocument(COLLECTIONS.EVENTS, id),
  create: (data) => createDocument(COLLECTIONS.EVENTS, data),
  update: (id, data) => updateDocument(COLLECTIONS.EVENTS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.EVENTS, id),
}

// Faculty
export const facultyService = {
  getAll: () => getCollection(COLLECTIONS.FACULTY),
  getById: (id) => getDocument(COLLECTIONS.FACULTY, id),
  getBySubject: (subject) => 
    getCollectionWithFilter(COLLECTIONS.FACULTY, [
      { field: 'subject', operator: '==', value: subject }
    ]),
  create: (data) => createDocument(COLLECTIONS.FACULTY, data),
  update: (id, data) => updateDocument(COLLECTIONS.FACULTY, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.FACULTY, id),
}

// Gallery
export const galleryService = {
  getAll: () => getCollection(COLLECTIONS.GALLERY),
  getById: (id) => getDocument(COLLECTIONS.GALLERY, id),
  getByCategory: (category) =>
    getCollectionWithFilter(COLLECTIONS.GALLERY, [
      { field: 'category', operator: '==', value: category }
    ]),
  create: (data) => createDocument(COLLECTIONS.GALLERY, data),
  update: (id, data) => updateDocument(COLLECTIONS.GALLERY, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.GALLERY, id),
}

// Downloads
export const downloadService = {
  getAll: () => getCollection(COLLECTIONS.DOWNLOADS),
  getById: (id) => getDocument(COLLECTIONS.DOWNLOADS, id),
  getByType: (fileType) =>
    getCollectionWithFilter(COLLECTIONS.DOWNLOADS, [
      { field: 'fileType', operator: '==', value: fileType }
    ]),
  create: (data) => createDocument(COLLECTIONS.DOWNLOADS, data),
  update: (id, data) => updateDocument(COLLECTIONS.DOWNLOADS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.DOWNLOADS, id),
}

// Admissions
export const admissionService = {
  getAll: () => getCollection(COLLECTIONS.ADMISSIONS),
  getById: (id) => getDocument(COLLECTIONS.ADMISSIONS, id),
  create: (data) => createDocument(COLLECTIONS.ADMISSIONS, data),
  update: (id, data) => updateDocument(COLLECTIONS.ADMISSIONS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.ADMISSIONS, id),
}

// Messages
export const messageService = {
  getAll: () => getCollection(COLLECTIONS.MESSAGES),
  getById: (id) => getDocument(COLLECTIONS.MESSAGES, id),
  create: (data) => createDocument(COLLECTIONS.MESSAGES, data),
  update: (id, data) => updateDocument(COLLECTIONS.MESSAGES, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.MESSAGES, id),
}

// Users
export const userService = {
  getById: (id) => getDocument(COLLECTIONS.USERS, id),
  getByEmail: (email) =>
    getCollectionWithFilter(COLLECTIONS.USERS, [
      { field: 'email', operator: '==', value: email }
    ]),
  create: (data) => createDocument(COLLECTIONS.USERS, data),
  update: (id, data) => updateDocument(COLLECTIONS.USERS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.USERS, id),
}

// Statistics service
export const statsService = {
  getCount: async (collectionName) => {
    try {
      const snapshot = await getDocs(collection(db, collectionName))
      return snapshot.size
    } catch (error) {
      console.error(`Error getting count for ${collectionName}:`, error)
      return 0
    }
  },
  getAllCounts: async () => {
    const collections = Object.values(COLLECTIONS).filter(c => c !== COLLECTIONS.USERS)
    const counts = {}
    for (const col of collections) {
      counts[col] = await statsService.getCount(col)
    }
    return counts
  },
}

export default {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  getCollection,
  getCollectionWithFilter,
  announcementService,
  newsService,
  eventService,
  facultyService,
  galleryService,
  downloadService,
  admissionService,
  messageService,
  userService,
  statsService,
  COLLECTIONS,
}