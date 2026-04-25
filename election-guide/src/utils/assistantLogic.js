/**
 * assistantLogic.js — Pure chat-bot knowledge-base logic.
 * Extracted from ChatAssistant.jsx so it can be tested independently.
 */

/**
 * Match a user message against the knowledge base and return a translation key.
 * Returns null if no match — caller should use fallback.
 *
 * @param {string} input  - Raw user message
 * @returns {string|null} - i18n key path (e.g. 'chat.kb.eligible') or null
 */
export function matchChatIntent(input) {
  if (!input || typeof input !== 'string' || !input.trim()) return null
  const text = input.toLowerCase().trim()

  if (/\bhi\b|\bhello\b|\bhey\b|\bnamaste\b|\bstart\b/i.test(text))          return 'chat.kb.greeting'
  if (/eligible|can i vote|qualify|who can vote/i.test(text))                 return 'chat.kb.eligible'
  if (/nvsp|register|form 6|enroll|sign up/i.test(text))                      return 'chat.kb.register'
  if (/epic|voter id|voter card|id card/i.test(text))                         return 'chat.kb.epic'
  if (/aadhaar|aadhar/i.test(text))                                           return 'chat.kb.aadhaar'
  if (/evm|electronic voting|machine|reliable/i.test(text))                   return 'chat.kb.evm'
  if (/vvpat|paper slip|verify vote/i.test(text))                             return 'chat.kb.vvpat'
  if (/nota|none of the above/i.test(text))                                   return 'chat.kb.nota'
  if (/deadline|last date|when.*register|registration.*date/i.test(text))     return 'chat.kb.deadline'
  if (/document|bring|carry|need|require|booth/i.test(text))                  return 'chat.kb.documents'
  if (/postal|absentee|away|different city|outside/i.test(text))              return 'chat.kb.postal'
  if (/mcc|model code|conduct/i.test(text))                                   return 'chat.kb.mcc'
  if (/cvigil|report|violation|complaint/i.test(text))                        return 'chat.kb.cvigil'
  if (/helpline|1950|contact|phone|call/i.test(text))                         return 'chat.kb.helpline'
  if (/secret|private|anonymous|who.*see|employer/i.test(text))               return 'chat.kb.secret'
  if (/nri|overseas|abroad|foreign.*indian/i.test(text))                      return 'chat.kb.nri'
  if (/electoralsearch|check.*name|name.*roll|voter.*list/i.test(text))       return 'chat.kb.electoralSearch'
  if (/booth|polling station|where.*vote|location/i.test(text))               return 'chat.kb.booth'
  if (/how.*vote|voting day|election day|process|steps/i.test(text))          return 'chat.kb.howToVote'
  if (/thank|thanks|great|helpful|awesome|good/i.test(text))                  return 'chat.kb.thanks'

  return null
}

/**
 * Format bold **text** markers and newlines into React-renderable segments.
 * Returns an array of { text, bold } objects.
 *
 * @param {string} raw
 * @returns {Array<{text: string, bold: boolean}>}
 */
export function parseMarkdown(raw) {
  if (!raw) return []
  return raw.split(/\*\*(.+?)\*\*/g).map((part, i) => ({
    text: part,
    bold: i % 2 === 1,
  }))
}
