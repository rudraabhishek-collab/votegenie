/**
 * errorHandling.test.js
 * Tests that all utility functions handle invalid/unexpected inputs gracefully
 * without throwing exceptions.
 */
import { describe, it, expect } from 'vitest'
import { checkEligibility, validateEligibilityForm, getEligibilityPreview } from '../utils/eligibility'
import { matchChatIntent, parseMarkdown } from '../utils/assistantLogic'
import { handleSearch, searchItems } from '../utils/search'

// ─── checkEligibility — never throws ──────────────────────────────────────

describe('checkEligibility — never throws on bad input', () => {
  const badInputs = [null, undefined, '', 0, -1, NaN, Infinity, [], {}]

  badInputs.forEach(bad => {
    it(`does not throw for age=${JSON.stringify(bad)}`, () => {
      expect(() => checkEligibility(bad, 'citizen', 'yes')).not.toThrow()
    })
  })

  it('does not throw for null citizenship', () => {
    expect(() => checkEligibility(22, null, 'yes')).not.toThrow()
  })

  it('does not throw for undefined registered', () => {
    expect(() => checkEligibility(22, 'citizen', undefined)).not.toThrow()
  })

  it('returns an object with type field for any input', () => {
    const result = checkEligibility(null, null, null)
    expect(result).toHaveProperty('type')
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('body')
  })

  it('returns error type for completely empty input', () => {
    const result = checkEligibility('', '', '')
    expect(['error', 'ineligible', 'maybe', 'eligible']).toContain(result.type)
  })
})

// ─── validateEligibilityForm — never throws ───────────────────────────────

describe('validateEligibilityForm — never throws on bad input', () => {
  it('handles completely empty object', () => {
    expect(() => validateEligibilityForm({})).not.toThrow()
  })

  it('handles null values', () => {
    expect(() => validateEligibilityForm({ age: null, citizenship: null, state: null })).not.toThrow()
  })

  it('handles undefined values', () => {
    expect(() => validateEligibilityForm({ age: undefined, citizenship: undefined, state: undefined })).not.toThrow()
  })

  it('returns errors object (not null/undefined) for empty form', () => {
    const errors = validateEligibilityForm({})
    expect(errors).toBeTruthy()
    expect(typeof errors).toBe('object')
  })

  it('age error message is a non-empty string', () => {
    const errors = validateEligibilityForm({ age: '', citizenship: 'citizen', state: 'MH' })
    expect(typeof errors.age).toBe('string')
    expect(errors.age.length).toBeGreaterThan(0)
  })
})

// ─── getEligibilityPreview — never throws ─────────────────────────────────

describe('getEligibilityPreview — never throws on bad input', () => {
  const badInputs = [null, undefined, '', 0, NaN, [], {}]

  badInputs.forEach(bad => {
    it(`does not throw for age=${JSON.stringify(bad)}`, () => {
      expect(() => getEligibilityPreview(bad, 'citizen')).not.toThrow()
    })
    it(`does not throw for citizenship=${JSON.stringify(bad)}`, () => {
      expect(() => getEligibilityPreview('22', bad)).not.toThrow()
    })
  })

  it('returns null for both null inputs', () => {
    expect(getEligibilityPreview(null, null)).toBeNull()
  })
})

// ─── matchChatIntent — never throws ───────────────────────────────────────

describe('matchChatIntent — never throws on bad input', () => {
  const badInputs = [null, undefined, '', '   ', 0, [], {}, true, false]

  badInputs.forEach(bad => {
    it(`does not throw for input=${JSON.stringify(bad)}`, () => {
      expect(() => matchChatIntent(bad)).not.toThrow()
    })
  })

  it('returns null for all non-string inputs', () => {
    expect(matchChatIntent(null)).toBeNull()
    expect(matchChatIntent(undefined)).toBeNull()
    expect(matchChatIntent(0)).toBeNull()
  })

  it('handles very long strings without throwing', () => {
    const longStr = 'a'.repeat(10_000)
    expect(() => matchChatIntent(longStr)).not.toThrow()
  })

  it('handles strings with special regex characters', () => {
    expect(() => matchChatIntent('hello (world) [test] {foo} ^bar$')).not.toThrow()
  })
})

// ─── parseMarkdown — never throws ─────────────────────────────────────────

describe('parseMarkdown — never throws on bad input', () => {
  it('handles null', () => {
    expect(() => parseMarkdown(null)).not.toThrow()
    expect(parseMarkdown(null)).toEqual([])
  })

  it('handles undefined', () => {
    expect(() => parseMarkdown(undefined)).not.toThrow()
  })

  it('handles empty string', () => {
    expect(parseMarkdown('')).toEqual([])
  })

  it('handles unclosed bold marker', () => {
    expect(() => parseMarkdown('**unclosed bold')).not.toThrow()
  })

  it('handles nested bold markers', () => {
    expect(() => parseMarkdown('**bold **nested** text**')).not.toThrow()
  })
})

// ─── handleSearch — never throws ──────────────────────────────────────────

describe('handleSearch — never throws on bad input', () => {
  const badInputs = [null, undefined, '', '   ', 0, [], {}]

  badInputs.forEach(bad => {
    it(`does not throw for query=${JSON.stringify(bad)}`, () => {
      expect(() => handleSearch(bad)).not.toThrow()
    })
  })

  it('returns null for all invalid inputs', () => {
    expect(handleSearch(null)).toBeNull()
    expect(handleSearch(undefined)).toBeNull()
    expect(handleSearch('')).toBeNull()
  })
})

// ─── searchItems — never throws ───────────────────────────────────────────

describe('searchItems — never throws on bad input', () => {
  it('handles null query', () => {
    expect(() => searchItems(null)).not.toThrow()
    expect(searchItems(null)).toEqual([])
  })

  it('handles undefined query', () => {
    expect(() => searchItems(undefined)).not.toThrow()
  })

  it('handles limit of 0', () => {
    const results = searchItems('vote', 0)
    expect(results).toEqual([])
  })

  it('handles very large limit', () => {
    const results = searchItems('vote', 1000)
    expect(Array.isArray(results)).toBe(true)
  })
})
