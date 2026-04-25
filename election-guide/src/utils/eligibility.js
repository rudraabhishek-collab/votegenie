/**
 * eligibility.js — Pure utility functions for eligibility logic.
 * Extracted from data.js so they can be independently tested and reused.
 */

export const MIN_VOTING_AGE = 18
export const VOTER_HELPLINE = '1950'

/**
 * Validate raw form inputs before running eligibility check.
 * Returns an object of field → error message (empty = valid).
 */
export function validateEligibilityForm({ age, citizenship, state }) {
  const errors = {}
  const n = parseInt(age, 10)
  if (!age || isNaN(n) || n < 1 || n > 120) {
    errors.age = 'Please enter a valid age (1–120).'
  }
  if (!citizenship) {
    errors.citizenship = 'Please select your citizenship status.'
  }
  if (!state) {
    errors.state = 'Please select your state / UT.'
  }
  return errors
}

/**
 * Core eligibility decision function.
 * Pure function — no side effects, fully testable.
 *
 * @param {number}  age         - Voter's age
 * @param {string}  citizenship - 'citizen' | 'nri' | 'foreign'
 * @param {string}  registered  - 'yes' | 'unsure' | 'no'
 * @param {object|null} stateData - State object from states array (optional)
 * @returns {{ type: string, icon: string, title: string, body: string }}
 */
export function checkEligibility(age, citizenship, registered, stateData = null) {
  if (!citizenship) {
    return {
      type: 'error',
      icon: '⚠️',
      title: 'Missing Information',
      body: 'Please provide all required fields.',
    }
  }

  if (citizenship === 'foreign') {
    return {
      type: 'ineligible',
      icon: '❌',
      title: 'Not Eligible',
      body: 'Foreign nationals and OCI card holders are not eligible to vote in Indian elections. Only Indian citizens can vote.',
    }
  }

  if (citizenship === 'nri') {
    return {
      type: 'maybe',
      icon: '🌍',
      title: 'NRI — Special Rules Apply',
      body: 'NRIs who hold an Indian passport can register as overseas voters and vote in person at their registered constituency in India. Register using Form 6A on nvsp.in.',
    }
  }

  const numericAge = typeof age === 'number' ? age : parseInt(age, 10)

  if (isNaN(numericAge) || numericAge < 1) {
    return {
      type: 'error',
      icon: '⚠️',
      title: 'Invalid Age',
      body: 'Please enter a valid age.',
    }
  }

  if (numericAge < MIN_VOTING_AGE) {
    return {
      type: 'ineligible',
      icon: '⏳',
      title: 'Not Yet Eligible',
      body: `You must be ${MIN_VOTING_AGE} years old on January 1 of the qualifying year to vote. Register as soon as you turn ${MIN_VOTING_AGE}!`,
    }
  }

  if (registered === 'no') {
    return {
      type: 'maybe',
      icon: '📝',
      title: 'Eligible — But Not Registered',
      body:
        'You appear to be eligible to vote' +
        (stateData ? ' in ' + stateData.label : '') +
        ', but you need to register first. Visit nvsp.in or the Voter Helpline App to fill Form 6. It takes under 5 minutes.',
    }
  }

  if (registered === 'unsure') {
    return {
      type: 'maybe',
      icon: '🔍',
      title: 'Check Your Registration',
      body:
        'You may be eligible to vote' +
        (stateData ? ' in ' + stateData.label : '') +
        `. Check your name on the electoral roll at electoralsearch.eci.gov.in or call the Voter Helpline at ${VOTER_HELPLINE}.`,
    }
  }

  // registered === 'yes' and age >= 18 and citizen
  return {
    type: 'eligible',
    icon: '🎉',
    title: "You're Eligible to Vote!",
    body:
      'Great news! You are eligible to vote' +
      (stateData
        ? ' in ' +
          stateData.label +
          ' (' +
          stateData.seats +
          ' Lok Sabha seat' +
          (stateData.seats !== 1 ? 's' : '') +
          ')'
        : '') +
      '. Carry your EPIC card or any approved photo ID on polling day.',
  }
}

/**
 * Returns a live preview hint while the user is still filling the form.
 * Used for real-time feedback before full submission.
 */
export function getEligibilityPreview(age, citizenship) {
  if (!age || !citizenship) return null
  const n = parseInt(age, 10)
  if (isNaN(n)) return null
  if (citizenship === 'foreign') return { type: 'ineligible', msg: 'Foreign nationals cannot vote in Indian elections.' }
  if (citizenship === 'nri')     return { type: 'maybe',      msg: 'NRIs can vote in person at their registered constituency.' }
  if (n < MIN_VOTING_AGE)        return { type: 'ineligible', msg: `You need to be ${MIN_VOTING_AGE - n} more year${MIN_VOTING_AGE - n > 1 ? 's' : ''} older to vote.` }
  if (n >= MIN_VOTING_AGE && citizenship === 'citizen') return { type: 'eligible', msg: 'Looking good! Complete the form to confirm.' }
  return null
}
