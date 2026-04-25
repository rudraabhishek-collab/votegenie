/**
 * firebase.js — Firebase / Firestore integration for VoteGenie.
 *
 * What we store (anonymously, no PII):
 *   - eligibility_checks: age-group, citizenship type, result type, state code, timestamp
 *   - chat_messages:      intent key matched, timestamp
 *
 * Environment variables (set in .env.local):
 *   VITE_FIREBASE_API_KEY
 *   VITE_FIREBASE_AUTH_DOMAIN
 *   VITE_FIREBASE_PROJECT_ID
 *   VITE_FIREBASE_APP_ID
 */

import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'

// ─── Config from env ───────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// ─── Init (singleton — safe to call multiple times) ────────────────────────
let app
let db

function getDB() {
  if (!firebaseConfig.apiKey) {
    // Firebase not configured — silently skip (dev / test environments)
    return null
  }
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    db  = getFirestore(app)
  }
  return db
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Log an anonymised eligibility check result to Firestore.
 * Stores only non-PII aggregate data.
 *
 * @param {{ age: number, citizenship: string, resultType: string, stateCode: string }} data
 */
export async function logEligibilityCheck({ age, citizenship, resultType, stateCode }) {
  const firestore = getDB()
  if (!firestore) return

  try {
    await addDoc(collection(firestore, 'eligibility_checks'), {
      ageGroup:    getAgeGroup(age),   // e.g. "18-25" — never exact age
      citizenship,                      // 'citizen' | 'nri' | 'foreign'
      resultType,                       // 'eligible' | 'ineligible' | 'maybe'
      stateCode:   stateCode || 'unknown',
      timestamp:   serverTimestamp(),
    })
  } catch (err) {
    // Non-critical — never block the UI for analytics
    console.warn('[VoteGenie] Firebase log failed:', err.message)
  }
}

/**
 * Log an anonymised chat intent to Firestore.
 *
 * @param {{ intentKey: string, language: string }} data
 */
export async function logChatMessage({ intentKey, language }) {
  const firestore = getDB()
  if (!firestore) return

  try {
    await addDoc(collection(firestore, 'chat_messages'), {
      intentKey: intentKey || 'fallback',
      language:  language  || 'en',
      timestamp: serverTimestamp(),
    })
  } catch (err) {
    console.warn('[VoteGenie] Firebase log failed:', err.message)
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getAgeGroup(age) {
  const n = parseInt(age, 10)
  if (isNaN(n))  return 'unknown'
  if (n < 18)    return 'under-18'
  if (n <= 25)   return '18-25'
  if (n <= 35)   return '26-35'
  if (n <= 50)   return '36-50'
  if (n <= 65)   return '51-65'
  return '65+'
}
