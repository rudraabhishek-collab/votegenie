/**
 * firebase.js — Firebase / Firestore integration for VoteGenie.
 *
 * Collections:
 *   eligibility_checks  — anonymised eligibility results (read + write)
 *   chat_messages       — anonymised chat intents (write)
 *
 * Environment variables (.env.local):
 *   VITE_FIREBASE_API_KEY
 *   VITE_FIREBASE_AUTH_DOMAIN
 *   VITE_FIREBASE_PROJECT_ID
 *   VITE_FIREBASE_STORAGE_BUCKET
 *   VITE_FIREBASE_MESSAGING_SENDER_ID
 *   VITE_FIREBASE_APP_ID
 */

import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'

// ─── Config ────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

/** Returns the Firestore instance, or null if Firebase is not configured. */
function getDB() {
  if (!firebaseConfig.apiKey) return null
  if (!getApps().length) initializeApp(firebaseConfig)
  return getFirestore(getApps()[0])
}

// ─── Write: Eligibility Check ──────────────────────────────────────────────

/**
 * Save an anonymised eligibility check to Firestore.
 * Returns the new document ID, or null on failure.
 *
 * @param {{ age: number, citizenship: string, resultType: string, stateCode: string, stateLabel: string }} data
 * @returns {Promise<string|null>}
 */
export async function logEligibilityCheck({ age, citizenship, resultType, stateCode, stateLabel }) {
  const db = getDB()
  if (!db) return null
  try {
    const ref = await addDoc(collection(db, 'eligibility_checks'), {
      ageGroup:   getAgeGroup(age),
      citizenship,
      resultType,
      stateCode:  stateCode  || 'unknown',
      stateLabel: stateLabel || 'Unknown',
      timestamp:  serverTimestamp(),
    })
    return ref.id
  } catch (err) {
    console.warn('[VoteGenie] Firebase write failed:', err.message)
    return null
  }
}

// ─── Read: Recent Activity ─────────────────────────────────────────────────

/**
 * Fetch the N most recent eligibility checks from Firestore.
 * Returns an array of plain objects (safe to render).
 *
 * @param {number} n  - Number of records to fetch (default 5)
 * @returns {Promise<Array>}
 */
export async function getRecentChecks(n = 5) {
  const db = getDB()
  if (!db) return []
  try {
    const q = query(
      collection(db, 'eligibility_checks'),
      orderBy('timestamp', 'desc'),
      limit(n)
    )
    const snap = await getDocs(q)
    return snap.docs.map(doc => ({
      id:         doc.id,
      ageGroup:   doc.data().ageGroup   || '—',
      citizenship:doc.data().citizenship|| '—',
      resultType: doc.data().resultType || '—',
      stateLabel: doc.data().stateLabel || '—',
      // Convert Firestore Timestamp → ISO string safely
      timestamp:  doc.data().timestamp?.toDate?.()?.toISOString() || null,
    }))
  } catch (err) {
    console.warn('[VoteGenie] Firebase read failed:', err.message)
    return []
  }
}

// ─── Write: Chat Message ───────────────────────────────────────────────────

/**
 * Log an anonymised chat intent to Firestore.
 *
 * @param {{ intentKey: string, language: string }} data
 */
export async function logChatMessage({ intentKey, language }) {
  const db = getDB()
  if (!db) return
  try {
    await addDoc(collection(db, 'chat_messages'), {
      intentKey: intentKey || 'fallback',
      language:  language  || 'en',
      timestamp: serverTimestamp(),
    })
  } catch (err) {
    console.warn('[VoteGenie] Firebase write failed:', err.message)
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Bucket an exact age into a non-PII age group string. */
export function getAgeGroup(age) {
  const n = parseInt(age, 10)
  if (isNaN(n))  return 'unknown'
  if (n < 18)    return 'under-18'
  if (n <= 25)   return '18-25'
  if (n <= 35)   return '26-35'
  if (n <= 50)   return '36-50'
  if (n <= 65)   return '51-65'
  return '65+'
}

/** Returns true if Firebase is configured via env vars. */
export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey)
}
