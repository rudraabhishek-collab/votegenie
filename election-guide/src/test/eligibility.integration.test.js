/**
 * eligibility.integration.test.js
 * Integration tests: simulate the full user flow from form input → result.
 * Tests the interaction between validateEligibilityForm + checkEligibility.
 */
import { describe, it, expect } from 'vitest'
import { validateEligibilityForm, checkEligibility } from '../utils/eligibility'

/** Simulate the full submit flow: validate then check. */
function submitEligibilityForm(form) {
  const errors = validateEligibilityForm(form)
  if (Object.keys(errors).length > 0) {
    return { errors, result: null }
  }
  const stateData = form.state ? { label: form.state, seats: 10 } : null
  const result = checkEligibility(
    parseInt(form.age, 10),
    form.citizenship,
    form.registered,
    stateData
  )
  return { errors: {}, result }
}

// ─── Happy path flows ──────────────────────────────────────────────────────

describe('Integration: eligible voter flow', () => {
  it('18-year-old registered citizen → eligible', () => {
    const { errors, result } = submitEligibilityForm({
      age: '18', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(errors).toEqual({})
    expect(result.type).toBe('eligible')
    expect(result.title).toMatch(/eligible/i)
  })

  it('25-year-old registered citizen in UP → eligible with state info', () => {
    const { result } = submitEligibilityForm({
      age: '25', citizenship: 'citizen', state: 'UP', registered: 'yes',
    })
    expect(result.type).toBe('eligible')
    expect(result.body).toContain('UP')
  })

  it('80-year-old registered citizen → eligible', () => {
    const { result } = submitEligibilityForm({
      age: '80', citizenship: 'citizen', state: 'KA', registered: 'yes',
    })
    expect(result.type).toBe('eligible')
  })
})

// ─── Ineligible flows ─────────────────────────────────────────────────────

describe('Integration: ineligible voter flows', () => {
  it('17-year-old → ineligible (too young)', () => {
    const { result } = submitEligibilityForm({
      age: '17', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(result.type).toBe('ineligible')
  })

  it('foreign national → ineligible', () => {
    const { result } = submitEligibilityForm({
      age: '30', citizenship: 'foreign', state: 'DL', registered: 'yes',
    })
    expect(result.type).toBe('ineligible')
    expect(result.body).toMatch(/foreign nationals/i)
  })

  it('age exactly 17 → ineligible', () => {
    const { result } = submitEligibilityForm({
      age: '17', citizenship: 'citizen', state: 'TN', registered: 'yes',
    })
    expect(result.type).toBe('ineligible')
  })
})

// ─── Maybe / action-required flows ────────────────────────────────────────

describe('Integration: maybe / action-required flows', () => {
  it('NRI → maybe with special rules', () => {
    const { result } = submitEligibilityForm({
      age: '28', citizenship: 'nri', state: 'MH', registered: 'yes',
    })
    expect(result.type).toBe('maybe')
    expect(result.body).toMatch(/nri/i)
  })

  it('eligible age but not registered → maybe (needs registration)', () => {
    const { result } = submitEligibilityForm({
      age: '22', citizenship: 'citizen', state: 'GJ', registered: 'no',
    })
    expect(result.type).toBe('maybe')
    expect(result.title).toMatch(/not registered/i)
  })

  it('eligible age but unsure about registration → maybe (check roll)', () => {
    const { result } = submitEligibilityForm({
      age: '22', citizenship: 'citizen', state: 'GJ', registered: 'unsure',
    })
    expect(result.type).toBe('maybe')
    expect(result.title).toMatch(/check/i)
  })
})

// ─── Validation error flows ────────────────────────────────────────────────

describe('Integration: form validation errors', () => {
  it('empty form → 3 validation errors, no result', () => {
    const { errors, result } = submitEligibilityForm({
      age: '', citizenship: '', state: '', registered: 'yes',
    })
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(3)
    expect(result).toBeNull()
  })

  it('missing age → age error only', () => {
    const { errors } = submitEligibilityForm({
      age: '', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(errors.age).toBeDefined()
    expect(errors.citizenship).toBeUndefined()
    expect(errors.state).toBeUndefined()
  })

  it('missing state → state error only', () => {
    const { errors } = submitEligibilityForm({
      age: '22', citizenship: 'citizen', state: '', registered: 'yes',
    })
    expect(errors.state).toBeDefined()
    expect(errors.age).toBeUndefined()
  })

  it('age 0 → validation error', () => {
    const { errors } = submitEligibilityForm({
      age: '0', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(errors.age).toBeDefined()
  })

  it('age 121 → validation error', () => {
    const { errors } = submitEligibilityForm({
      age: '121', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(errors.age).toBeDefined()
  })

  it('non-numeric age → validation error', () => {
    const { errors } = submitEligibilityForm({
      age: 'abc', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(errors.age).toBeDefined()
  })
})

// ─── Edge cases ────────────────────────────────────────────────────────────

describe('Integration: edge cases', () => {
  it('age exactly 18 → eligible (boundary)', () => {
    const { result } = submitEligibilityForm({
      age: '18', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(result.type).toBe('eligible')
  })

  it('age 1 → ineligible (too young)', () => {
    const { result } = submitEligibilityForm({
      age: '1', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(result.type).toBe('ineligible')
  })

  it('age 120 → eligible (max valid age)', () => {
    const { result } = submitEligibilityForm({
      age: '120', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(result.type).toBe('eligible')
  })

  it('no state provided → eligible without state info', () => {
    const { errors, result } = submitEligibilityForm({
      age: '22', citizenship: 'citizen', state: '', registered: 'yes',
    })
    // state is required — should fail validation
    expect(errors.state).toBeDefined()
    expect(result).toBeNull()
  })

  it('result includes icon field', () => {
    const { result } = submitEligibilityForm({
      age: '22', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(result.icon).toBeTruthy()
  })

  it('result includes body field', () => {
    const { result } = submitEligibilityForm({
      age: '22', citizenship: 'citizen', state: 'MH', registered: 'yes',
    })
    expect(result.body).toBeTruthy()
    expect(typeof result.body).toBe('string')
  })
})
