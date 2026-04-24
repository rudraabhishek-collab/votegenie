import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { scrollToSection } from './Hero'
import { stateData } from '../data/stateData'

// ─── State info lookup for chat ────────────────────────────────────────────
function getStateInfoReply(input, t) {
  const text = input.toLowerCase()
  // Match "cm of X", "chief minister of X", "who rules X", "next election in X", "ruling party in X"
  const stateNames = Object.keys(stateData)
  for (const name of stateNames) {
    if (text.includes(name.toLowerCase())) {
      const d = stateData[name]
      if (/cm|chief minister|minister|who.*rule|leader|मुख्यमंत्री|सीएम|नेता/.test(text)) {
        return t('chat.kb.stateInfoCM', {
          name, cm: d.cm, cmParty: d.cmParty,
          rulingAlliance: d.rulingAlliance, oppositionParty: d.oppositionParty,
          defaultValue: `The Chief Minister of **${name}** is **${d.cm}** (${d.cmParty}).\n\nRuling Alliance: ${d.rulingAlliance}\nOpposition: ${d.oppositionParty}\n\n👉 See the **State Info** section for full details.`
        })
      }
      if (/next election|when.*election|election.*date|अगला चुनाव|चुनाव कब/.test(text)) {
        return t('chat.kb.stateInfoElection', {
          name, nextElection: d.nextElection, lastElection: d.lastElection, recentResult: d.recentResult,
          defaultValue: `The next assembly election in **${name}** is expected in **${d.nextElection}**.\n\nLast election: ${d.lastElection}\nRecent result: ${d.recentResult}\n\n👉 See the **State Info** section for full details.`
        })
      }
      if (/ruling party|government|party in power|सत्तारूढ़|सरकार/.test(text)) {
        return t('chat.kb.stateInfoParty', {
          name, rulingParty: d.rulingParty, rulingAlliance: d.rulingAlliance,
          cm: d.cm, oppositionParty: d.oppositionParty,
          defaultValue: `The ruling party in **${name}** is **${d.rulingParty}** (${d.rulingAlliance}).\n\nCM: ${d.cm}\nOpposition: ${d.oppositionParty}\n\n👉 See the **State Info** section for full details.`
        })
      }
      // Generic state query
      return t('chat.kb.stateInfoGeneric', {
        name, cm: d.cm, cmParty: d.cmParty,
        rulingAlliance: d.rulingAlliance, nextElection: d.nextElection, recentResult: d.recentResult,
        defaultValue: `Here's a quick summary for **${name}**:\n\n👤 CM: ${d.cm} (${d.cmParty})\n🏛️ Ruling: ${d.rulingAlliance}\n📅 Next Election: ${d.nextElection}\n📊 Last Result: ${d.recentResult}\n\n👉 See the **State Info** section for full details.`
      })
    }
  }
  return null
}

// ─── India-specific knowledge base ────────────────────────────────────────
function chatbotLogic(input, t) {
  const text = input.trim()
  if (!text) return null
  // Check state-specific queries first
  const stateReply = getStateInfoReply(text, t)
  if (stateReply) return stateReply
  
  // Use translation keys for responses
  const lowerText = text.toLowerCase()
  
  if (/\bhi\b|\bhello\b|\bhey\b|\bnamaste\b|\bstart\b/i.test(lowerText)) {
    return t('chat.kb.greeting')
  }
  if (/eligible|can i vote|qualify|who can vote/i.test(lowerText)) {
    return t('chat.kb.eligible')
  }
  if (/nvsp|register|form 6|enroll|sign up/i.test(lowerText)) {
    return t('chat.kb.register')
  }
  if (/epic|voter id|voter card|id card/i.test(lowerText)) {
    return t('chat.kb.epic')
  }
  if (/aadhaar|aadhar/i.test(lowerText)) {
    return t('chat.kb.aadhaar')
  }
  if (/evm|electronic voting|machine|reliable/i.test(lowerText)) {
    return t('chat.kb.evm')
  }
  if (/vvpat|paper slip|verify vote/i.test(lowerText)) {
    return t('chat.kb.vvpat')
  }
  if (/nota|none of the above/i.test(lowerText)) {
    return t('chat.kb.nota')
  }
  if (/deadline|last date|when.*register|registration.*date/i.test(lowerText)) {
    return t('chat.kb.deadline')
  }
  if (/document|bring|carry|need|require|booth/i.test(lowerText)) {
    return t('chat.kb.documents')
  }
  if (/postal|absentee|away|different city|outside/i.test(lowerText)) {
    return t('chat.kb.postal')
  }
  if (/mcc|model code|conduct/i.test(lowerText)) {
    return t('chat.kb.mcc')
  }
  if (/cvigil|report|violation|complaint/i.test(lowerText)) {
    return t('chat.kb.cvigil')
  }
  if (/helpline|1950|contact|phone|call/i.test(lowerText)) {
    return t('chat.kb.helpline')
  }
  if (/secret|private|anonymous|who.*see|employer/i.test(lowerText)) {
    return t('chat.kb.secret')
  }
  if (/nri|overseas|abroad|foreign.*indian/i.test(lowerText)) {
    return t('chat.kb.nri')
  }
  if (/electoralsearch|check.*name|name.*roll|voter.*list/i.test(lowerText)) {
    return t('chat.kb.electoralSearch')
  }
  if (/booth|polling station|where.*vote|location/i.test(lowerText)) {
    return t('chat.kb.booth')
  }
  if (/how.*vote|voting day|election day|process|steps/i.test(lowerText)) {
    return t('chat.kb.howToVote')
  }
  if (/thank|thanks|great|helpful|awesome|good/i.test(lowerText)) {
    return t('chat.kb.thanks')
  }
  
  return t('chat.kb.fallback')
}

// ─── Format bold **text** and newlines ────────────────────────────────────
function FormatMsg({ text }) {
  return (
    <span>
      {text.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </span>
  )
}

const LS_CHAT = 'eg-chat-history'

export default function ChatAssistant({ open, onClose, dark }) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_CHAT))
      if (saved?.length) return saved
    } catch {}
    return [{ role: 'bot', text: t('chat.kb.init') }]
  })
  const [input,   setInput]   = useState('')
  const [typing,  setTyping]  = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    localStorage.setItem(LS_CHAT, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const send = useCallback((text) => {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: msg }])
    setTyping(true)
    setTimeout(() => {
      const reply = chatbotLogic(msg, t)
      setMessages(m => [...m, { role: 'bot', text: reply }])
      setTyping(false)
    }, 500 + Math.random() * 400)
  }, [input, t])

  const clearHistory = () => {
    const init = [{ role: 'bot', text: t('chat.cleared') }]
    setMessages(init)
    localStorage.setItem(LS_CHAT, JSON.stringify(init))
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-3xl border shadow-modal overflow-hidden
          ${dark ? 'bg-[#0a0e1f] border-violet-800/30' : 'bg-white border-indigo-100'}
          animate-[fadeUp_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both]`}
        style={{ height: '520px' }}
        role="dialog" aria-label="VoteGenie Chat" aria-modal>

        {/* Top stripe */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

        {/* Header */}
        <div className={`flex items-center gap-3 px-4 py-3.5 border-b flex-shrink-0
          ${dark ? 'border-white/[0.07]' : 'border-indigo-50'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg shadow-glow flex-shrink-0">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-extrabold text-[0.92rem] tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              {t('chat.title')}
            </p>
            <p className="text-[0.68rem] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {t('chat.status')}
            </p>
          </div>
          <button onClick={clearHistory}
            className={`text-[0.68rem] font-semibold px-2 py-1 rounded-lg border transition-all
              ${dark ? 'border-white/10 text-slate-600 hover:text-slate-300' : 'border-slate-200 text-slate-600 hover:text-slate-700'}`}>
            {t('chat.clear')}
          </button>
          <button onClick={onClose} aria-label={t('chat.close')}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all hover:rotate-90
              ${dark ? 'bg-white/10 border-white/10 text-slate-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-gray-700'}`}>
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'bot' && (
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs flex-shrink-0 mb-0.5 shadow-glow">
                  🤖
                </div>
              )}
              <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[0.85rem] leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm shadow-glow'
                  : dark
                    ? 'bg-white/[0.08] text-slate-200 rounded-bl-sm border border-white/[0.06]'
                    : 'bg-slate-100 text-gray-800 rounded-bl-sm'
                }`}>
                <FormatMsg text={msg.text} />
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs flex-shrink-0 shadow-glow">
                🤖
              </div>
              <div className={`px-3.5 py-3 rounded-2xl rounded-bl-sm ${dark ? 'bg-white/[0.08] border border-white/[0.06]' : 'bg-slate-100'}`}>
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(j => (
                    <span key={j} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: `${j * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions */}
        {messages.length <= 2 && (
          <div className={`px-3 pb-2 border-t flex-shrink-0 ${dark ? 'border-white/[0.07]' : 'border-indigo-50'}`}>
            <p className={`text-[0.65rem] font-bold uppercase tracking-widest pt-2 pb-1.5 ${dark ? 'text-white' : 'text-slate-700'}`}>
              {t('chat.trySuggestions')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {t('chat.suggestions', { returnObjects: true }).map((s, i) => (
                <button key={i} onClick={() => send(s)}
                  className={`text-[0.72rem] font-semibold px-2.5 py-1 rounded-full border transition-all hover:-translate-y-0.5
                    ${dark
                      ? 'border-violet-800/40 text-indigo-400 hover:bg-indigo-900/40'
                      : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                    }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className={`flex gap-2 px-3 py-3 border-t flex-shrink-0
          ${dark ? 'border-white/[0.07]' : 'border-indigo-50'}`}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={t('chat.inputPlaceholder')}
            aria-label="Chat input"
            className={`flex-1 rounded-xl px-3.5 py-2.5 text-[0.85rem] border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400/30
              ${dark
                ? 'bg-white/[0.07] border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-400'
                : 'bg-slate-50 border-slate-200 text-gray-900 placeholder:text-slate-600 focus:border-indigo-400 focus:bg-white'
              }`}
          />
          <button onClick={() => send()} disabled={!input.trim() || typing}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-glow
              hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm">
            ↑
          </button>
        </div>
      </div>
    </>
  )
}
