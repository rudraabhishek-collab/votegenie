import { describe, it, expect } from 'vitest'
import { handleSearch, searchItems } from '../utils/search'

// ─── handleSearch ──────────────────────────────────────────────────────────

describe('handleSearch — keyword shortcuts', () => {
  it('returns eligibility for "eligible"', () =>
    expect(handleSearch('eligible')).toBe('eligibility'))
  it('returns eligibility for "age"', () =>
    expect(handleSearch('age')).toBe('eligibility'))
  it('returns timeline for "deadline"', () =>
    expect(handleSearch('deadline')).toBe('timeline'))
  it('returns timeline for "register"', () =>
    expect(handleSearch('register')).toBe('timeline'))
  it('returns guide for "vote"', () =>
    expect(handleSearch('vote')).toBe('guide'))
  it('returns guide for "booth"', () =>
    expect(handleSearch('booth')).toBe('guide'))
  it('returns documents for "document"', () =>
    expect(handleSearch('document')).toBe('documents'))
  it('returns documents for "passport"', () =>
    expect(handleSearch('passport')).toBe('documents'))
  it('returns faq for "faq"', () =>
    expect(handleSearch('faq')).toBe('faq'))
  it('returns faq for "question"', () =>
    expect(handleSearch('question')).toBe('faq'))
})

describe('handleSearch — edge cases', () => {
  it('returns null for empty string', () =>
    expect(handleSearch('')).toBeNull())
  it('returns null for whitespace', () =>
    expect(handleSearch('   ')).toBeNull())
  it('returns null for null', () =>
    expect(handleSearch(null)).toBeNull())
  it('returns null for unrecognized query', () =>
    expect(handleSearch('xyzzy random nonsense')).toBeNull())
})

describe('handleSearch — searchIndex fallback', () => {
  it('finds "helpline 1950" via searchIndex', () =>
    expect(handleSearch('1950')).toBe('faq'))
  it('finds "evm" via searchIndex', () =>
    // "evm" matches the "vote" shortcut → guide section
    expect(handleSearch('evm')).toBe('guide'))
  it('finds "overview" via searchIndex', () =>
    expect(handleSearch('overview')).toBe('overview'))
})

// ─── searchItems ───────────────────────────────────────────────────────────

describe('searchItems', () => {
  it('returns empty array for short query', () =>
    expect(searchItems('a')).toEqual([]))
  it('returns empty array for empty query', () =>
    expect(searchItems('')).toEqual([]))
  it('returns results for "epic"', () => {
    const results = searchItems('epic')
    expect(results.length).toBeGreaterThan(0)
  })
  it('respects limit parameter', () => {
    const results = searchItems('vote', 2)
    expect(results.length).toBeLessThanOrEqual(2)
  })
  it('default limit is 6', () => {
    const results = searchItems('vote')
    expect(results.length).toBeLessThanOrEqual(6)
  })
})
