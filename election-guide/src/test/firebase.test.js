/**
 * firebase.test.js
 * Tests for Firebase service utilities (pure logic, no real network calls).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAgeGroup, isFirebaseConfigured } from '../services/firebase'

// ─── getAgeGroup ───────────────────────────────────────────────────────────

describe('getAgeGroup', () => {
  it('returns "under-18" for age 17', () =>
    expect(getAgeGroup(17)).toBe('under-18'))

  it('returns "under-18" for age 0', () =>
    expect(getAgeGroup(0)).toBe('under-18'))

  it('returns "18-25" for age 18', () =>
    expect(getAgeGroup(18)).toBe('18-25'))

  it('returns "18-25" for age 25', () =>
    expect(getAgeGroup(25)).toBe('18-25'))

  it('returns "26-35" for age 26', () =>
    expect(getAgeGroup(26)).toBe('26-35'))

  it('returns "26-35" for age 35', () =>
    expect(getAgeGroup(35)).toBe('26-35'))

  it('returns "36-50" for age 36', () =>
    expect(getAgeGroup(36)).toBe('36-50'))

  it('returns "51-65" for age 51', () =>
    expect(getAgeGroup(51)).toBe('51-65'))

  it('returns "65+" for age 66', () =>
    expect(getAgeGroup(66)).toBe('65+'))

  it('returns "65+" for age 100', () =>
    expect(getAgeGroup(100)).toBe('65+'))

  it('returns "unknown" for NaN', () =>
    expect(getAgeGroup(NaN)).toBe('unknown'))

  it('handles string age "22"', () =>
    expect(getAgeGroup('22')).toBe('18-25'))

  it('handles string age "17"', () =>
    expect(getAgeGroup('17')).toBe('under-18'))

  it('returns "unknown" for non-numeric string', () =>
    expect(getAgeGroup('abc')).toBe('unknown'))
})

// ─── isFirebaseConfigured ──────────────────────────────────────────────────

describe('isFirebaseConfigured', () => {
  it('returns false when no env vars set (test environment)', () => {
    // In test env, VITE_FIREBASE_API_KEY is not set
    expect(isFirebaseConfigured()).toBe(false)
  })
})
