import { describe, it, expect } from 'vitest'
import { matchChatIntent, parseMarkdown } from '../utils/assistantLogic'

// ─── matchChatIntent ───────────────────────────────────────────────────────

describe('matchChatIntent — greeting', () => {
  it('matches "hi"', ()       => expect(matchChatIntent('hi')).toBe('chat.kb.greeting'))
  it('matches "hello"', ()    => expect(matchChatIntent('hello')).toBe('chat.kb.greeting'))
  it('matches "namaste"', ()  => expect(matchChatIntent('namaste')).toBe('chat.kb.greeting'))
  it('matches "Hey there"', ()=> expect(matchChatIntent('Hey there')).toBe('chat.kb.greeting'))
})

describe('matchChatIntent — eligibility', () => {
  it('matches "am I eligible"', () =>
    expect(matchChatIntent('am I eligible to vote')).toBe('chat.kb.eligible'))
  it('matches "can i vote"', () =>
    expect(matchChatIntent('can i vote')).toBe('chat.kb.eligible'))
  it('matches "who can vote"', () =>
    expect(matchChatIntent('who can vote in India')).toBe('chat.kb.eligible'))
})

describe('matchChatIntent — registration', () => {
  it('matches "nvsp"', () =>
    expect(matchChatIntent('how to register on nvsp')).toBe('chat.kb.register'))
  it('matches "form 6"', () =>
    expect(matchChatIntent('what is form 6')).toBe('chat.kb.register'))
  it('matches "enroll"', () =>
    expect(matchChatIntent('how do I enroll as voter')).toBe('chat.kb.register'))
})

describe('matchChatIntent — EPIC card', () => {
  it('matches "voter id"', () =>
    expect(matchChatIntent('what is voter id')).toBe('chat.kb.epic'))
  it('matches "epic card"', () =>
    expect(matchChatIntent('what is epic card')).toBe('chat.kb.epic'))
})

describe('matchChatIntent — EVM', () => {
  it('matches "evm"', () =>
    expect(matchChatIntent('what is evm')).toBe('chat.kb.evm'))
  it('matches "electronic voting"', () =>
    expect(matchChatIntent('how does electronic voting work')).toBe('chat.kb.evm'))
})

describe('matchChatIntent — NOTA', () => {
  it('matches "nota"', () =>
    expect(matchChatIntent('what is nota')).toBe('chat.kb.nota'))
  it('matches "none of the above"', () =>
    expect(matchChatIntent('none of the above option')).toBe('chat.kb.nota'))
})

describe('matchChatIntent — helpline', () => {
  it('matches "1950"', () =>
    expect(matchChatIntent('what is 1950')).toBe('chat.kb.helpline'))
  it('matches "helpline"', () =>
    expect(matchChatIntent('voter helpline number')).toBe('chat.kb.helpline'))
})

describe('matchChatIntent — fallback', () => {
  it('returns null for empty string', () =>
    expect(matchChatIntent('')).toBeNull())
  it('returns null for whitespace', () =>
    expect(matchChatIntent('   ')).toBeNull())
  it('returns null for unrecognized query', () =>
    expect(matchChatIntent('what is the weather today')).toBeNull())
  it('returns null for null input', () =>
    expect(matchChatIntent(null)).toBeNull())
})

// ─── parseMarkdown ─────────────────────────────────────────────────────────

describe('parseMarkdown', () => {
  it('returns empty array for empty string', () => {
    expect(parseMarkdown('')).toEqual([])
  })

  it('returns empty array for null', () => {
    expect(parseMarkdown(null)).toEqual([])
  })

  it('parses plain text as non-bold', () => {
    const result = parseMarkdown('hello world')
    expect(result).toEqual([{ text: 'hello world', bold: false }])
  })

  it('parses **bold** text correctly', () => {
    const result = parseMarkdown('You are **eligible** to vote')
    expect(result).toContainEqual({ text: 'eligible', bold: true })
    expect(result).toContainEqual({ text: 'You are ', bold: false })
  })

  it('parses multiple bold segments', () => {
    const result = parseMarkdown('**EPIC** card and **Aadhaar**')
    const boldParts = result.filter(r => r.bold).map(r => r.text)
    expect(boldParts).toContain('EPIC')
    expect(boldParts).toContain('Aadhaar')
  })
})
