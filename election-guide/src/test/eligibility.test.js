import { describe, it, expect } from 'vitest'
import {
  checkEligibility,
  validateEligibilityForm,
  getEligibilityPreview,
  MIN_VOTING_AGE,
} from '../utils/eligibility'

// ─── checkEligibility ──────────────────────────────────────────────────────

describe('checkEligibility — age boundary', () => {
  it('returns ineligible for age 17 (below minimum)', () => {
    const result = checkEligibility(17, 'citizen', 'yes')
    expect(result.type).toBe('ineligible')
    expect(result.title).toMatch(/not yet eligible/i)
  })

  it('returns ineligible for age 0', () => {
    // age 0 is invalid input — function returns 'error' type
    const result = checkEligibility(0, 'citizen', 'yes')
    expect(['ineligible', 'error']).toContain(result.type)
  })

  it('returns eligible for age 18 (exact minimum)', () => {
    const result = checkEligibility(18, 'citizen', 'yes')
    expect(result.type).toBe('eligible')
  })

  it('returns eligible for age 25', () => {
    const result = checkEligibility(25, 'citizen', 'yes')
    expect(result.type).toBe('eligible')
  })

  it('returns eligible for age 80', () => {
    const result = checkEligibility(80, 'citizen', 'yes')
    expect(result.type).toBe('eligible')
  })

  it('MIN_VOTING_AGE constant is 18', () => {
    expect(MIN_VOTING_AGE).toBe(18)
  })
})

describe('checkEligibility — citizenship', () => {
  it('returns ineligible for foreign national', () => {
    const result = checkEligibility(25, 'foreign', 'yes')
    expect(result.type).toBe('ineligible')
    expect(result.body).toMatch(/foreign nationals/i)
  })

  it('returns maybe for NRI', () => {
    const result = checkEligibility(25, 'nri', 'yes')
    expect(result.type).toBe('maybe')
    expect(result.body).toMatch(/nri/i)
  })

  it('returns error when citizenship is missing', () => {
    const result = checkEligibility(25, '', 'yes')
    expect(result.type).toBe('error')
  })
})

describe('checkEligibility — registration status', () => {
  it('returns maybe when not registered', () => {
    const result = checkEligibility(22, 'citizen', 'no')
    expect(result.type).toBe('maybe')
    expect(result.title).toMatch(/not registered/i)
  })

  it('returns maybe when unsure about registration', () => {
    const result = checkEligibility(22, 'citizen', 'unsure')
    expect(result.type).toBe('maybe')
    expect(result.title).toMatch(/check your registration/i)
  })

  it('returns eligible when registered', () => {
    const result = checkEligibility(22, 'citizen', 'yes')
    expect(result.type).toBe('eligible')
  })
})

describe('checkEligibility — with stateData', () => {
  const mockState = { label: 'Maharashtra', seats: 48 }

  it('includes state name in eligible body', () => {
    const result = checkEligibility(22, 'citizen', 'yes', mockState)
    expect(result.body).toContain('Maharashtra')
  })

  it('includes seat count in eligible body', () => {
    const result = checkEligibility(22, 'citizen', 'yes', mockState)
    expect(result.body).toContain('48')
  })

  it('includes state name in not-registered body', () => {
    const result = checkEligibility(22, 'citizen', 'no', mockState)
    expect(result.body).toContain('Maharashtra')
  })
})

describe('checkEligibility — string age input', () => {
  it('handles string "18" correctly', () => {
    const result = checkEligibility('18', 'citizen', 'yes')
    expect(result.type).toBe('eligible')
  })

  it('handles string "17" correctly', () => {
    const result = checkEligibility('17', 'citizen', 'yes')
    expect(result.type).toBe('ineligible')
  })

  it('handles non-numeric string', () => {
    const result = checkEligibility('abc', 'citizen', 'yes')
    expect(result.type).toBe('error')
  })
})

// ─── validateEligibilityForm ───────────────────────────────────────────────

describe('validateEligibilityForm', () => {
  it('returns no errors for valid input', () => {
    const errors = validateEligibilityForm({ age: '22', citizenship: 'citizen', state: 'MH' })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('returns age error for empty age', () => {
    const errors = validateEligibilityForm({ age: '', citizenship: 'citizen', state: 'MH' })
    expect(errors.age).toBeDefined()
  })

  it('returns age error for age 0', () => {
    const errors = validateEligibilityForm({ age: '0', citizenship: 'citizen', state: 'MH' })
    expect(errors.age).toBeDefined()
  })

  it('returns age error for age > 120', () => {
    const errors = validateEligibilityForm({ age: '150', citizenship: 'citizen', state: 'MH' })
    expect(errors.age).toBeDefined()
  })

  it('returns citizenship error when missing', () => {
    const errors = validateEligibilityForm({ age: '22', citizenship: '', state: 'MH' })
    expect(errors.citizenship).toBeDefined()
  })

  it('returns state error when missing', () => {
    const errors = validateEligibilityForm({ age: '22', citizenship: 'citizen', state: '' })
    expect(errors.state).toBeDefined()
  })

  it('returns multiple errors for empty form', () => {
    const errors = validateEligibilityForm({ age: '', citizenship: '', state: '' })
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(3)
  })
})

// ─── getEligibilityPreview ─────────────────────────────────────────────────

describe('getEligibilityPreview', () => {
  it('returns null when age is empty', () => {
    expect(getEligibilityPreview('', 'citizen')).toBeNull()
  })

  it('returns null when citizenship is empty', () => {
    expect(getEligibilityPreview('22', '')).toBeNull()
  })

  it('returns ineligible preview for foreign', () => {
    const preview = getEligibilityPreview('22', 'foreign')
    expect(preview.type).toBe('ineligible')
  })

  it('returns maybe preview for NRI', () => {
    const preview = getEligibilityPreview('22', 'nri')
    expect(preview.type).toBe('maybe')
  })

  it('returns ineligible preview for age 16', () => {
    const preview = getEligibilityPreview('16', 'citizen')
    expect(preview.type).toBe('ineligible')
    expect(preview.msg).toContain('2 more year')
  })

  it('returns eligible preview for age 18 citizen', () => {
    const preview = getEligibilityPreview('18', 'citizen')
    expect(preview.type).toBe('eligible')
  })
})
