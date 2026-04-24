import { useState, useEffect, useRef, useCallback } from 'react'
import { scrollToSection } from './Hero'
import { stateData } from '../data/stateData'

// ─── State info lookup for chat ────────────────────────────────────────────
function getStateInfoReply(input) {
  const text = input.toLowerCase()
  // Match "cm of X", "chief minister of X", "who rules X", "next election in X", "ruling party in X"
  const stateNames = Object.keys(stateData)
  for (const name of stateNames) {
    if (text.includes(name.toLowerCase())) {
      const d = stateData[name]
      if (/cm|chief minister|minister|who.*rule|leader/.test(text)) {
        return `The Chief Minister of **${name}** is **${d.cm}** (${d.cmParty}).\n\nRuling Alliance: ${d.rulingAlliance}\nOpposition: ${d.oppositionParty}\n\n👉 See the **State Info** section for full details.`
      }
      if (/next election|when.*election|election.*date/.test(text)) {
        return `The next assembly election in **${name}** is expected in **${d.nextElection}**.\n\nLast election: ${d.lastElection}\nRecent result: ${d.recentResult}\n\n👉 See the **State Info** section for full details.`
      }
      if (/ruling party|government|party in power/.test(text)) {
        return `The ruling party in **${name}** is **${d.rulingParty}** (${d.rulingAlliance}).\n\nCM: ${d.cm}\nOpposition: ${d.oppositionParty}\n\n👉 See the **State Info** section for full details.`
      }
      // Generic state query
      return `Here's a quick summary for **${name}**:\n\n👤 CM: ${d.cm} (${d.cmParty})\n🏛️ Ruling: ${d.rulingAlliance}\n📅 Next Election: ${d.nextElection}\n📊 Last Result: ${d.recentResult}\n\n👉 See the **State Info** section for full details.`
    }
  }
  return null
}

// ─── India-specific knowledge base ────────────────────────────────────────
const KB = [
  { p: [/\bhi\b|\bhello\b|\bhey\b|\bnamaste\b|\bstart\b/i],
    r: "🙏 Namaste! I'm VoteGenie, your India election assistant.\n\nAsk me anything about:\n• Eligibility to vote\n• How to register on NVSP\n• What to carry to the booth\n• EVM & VVPAT\n• NOTA\n• Voter Helpline 1950" },

  { p: [/eligible|can i vote|qualify|who can vote/i],
    r: "To vote in India you need to:\n• Be **18 or older** on January 1 of the qualifying year\n• Be an **Indian citizen**\n• Be **registered** on the electoral roll\n\nUse the **Eligibility Checker** on this page for a personalised result, or click **Check if You Can Vote** above." },

  { p: [/nvsp|register|form 6|enroll|sign up/i],
    r: "To register as a new voter:\n1. Visit **nvsp.in** or download the Voter Helpline App\n2. Fill **Form 6** with your name, DOB, address, and photo\n3. Submit — you'll get a reference number\n4. Your **EPIC card** arrives within 30 days\n\nYou can also visit your local **BLO (Booth Level Officer)** office." },

  { p: [/epic|voter id|voter card|id card/i],
    r: "**EPIC** stands for Electors' Photo Identity Card — your Voter ID.\n\nIf you don't have it, ECI accepts **12 alternative IDs** including:\n• Aadhaar card\n• Passport\n• Driving licence\n• PAN card\n• MNREGA Job Card\n\nYou can also use **e-EPIC** (digital Voter ID) on your phone from nvsp.in." },

  { p: [/aadhaar|aadhar/i],
    r: "Yes! **Aadhaar card** is accepted as an alternative photo ID at polling booths.\n\nIf you don't have your EPIC card on polling day, Aadhaar works as a valid substitute." },

  { p: [/evm|electronic voting|machine|reliable/i],
    r: "**EVM (Electronic Voting Machine)** is used in all Indian elections.\n\n• It is a **standalone device** — not connected to the internet\n• **VVPAT** (Voter Verifiable Paper Audit Trail) lets you verify your vote on a paper slip for **7 seconds**\n• EVMs are tested and sealed before elections under ECI supervision" },

  { p: [/vvpat|paper slip|verify vote/i],
    r: "After pressing the EVM button, a **paper slip** appears in the VVPAT machine for **7 seconds** showing:\n• The candidate's name\n• Party symbol\n• Serial number\n\nThe slip then drops into a sealed box. This lets you verify your vote was recorded correctly." },

  { p: [/nota|none of the above/i],
    r: "**NOTA** = None of the Above.\n\nIt's the **last option** on every EVM ballot. If you're not satisfied with any candidate, press NOTA.\n\nYour vote is counted but doesn't go to any candidate. It's your right to reject all candidates." },

  { p: [/deadline|last date|when.*register|registration.*date/i],
    r: "Registration closes approximately **30 days before the election**.\n\nCheck the **Key Dates** section on this page for the exact deadline for the 2026 election cycle.\n\nSome states also have special windows — check with your local election office." },

  { p: [/document|bring|carry|need|require|booth/i],
    r: "Carry to the polling booth:\n• 🪪 **EPIC card** (primary ID)\n• OR any of 12 alternatives (Aadhaar, Passport, PAN, etc.)\n• 📱 **e-EPIC** on your phone is also accepted\n\nCheck the **Documents** section on this page for the full list." },

  { p: [/postal|absentee|away|different city|outside/i],
    r: "You must vote in your **registered constituency**.\n\nHowever, **Postal Ballot** is available for:\n• Senior citizens (80+)\n• Persons with disabilities (PwD)\n• Essential service workers\n\nApply for postal ballot before the deadline through your Returning Officer." },

  { p: [/mcc|model code|conduct/i],
    r: "The **Model Code of Conduct (MCC)** is a set of ECI guidelines that comes into effect when the election schedule is announced.\n\nIt governs:\n• Political party behaviour\n• Government announcements\n• Use of government resources\n\nViolations can be reported via the **cVIGIL app** — ECI responds within 100 minutes." },

  { p: [/cvigil|report|violation|complaint/i],
    r: "Use the **cVIGIL app** to report election violations:\n• Take a photo or video of the violation\n• Submit through the app\n• ECI guarantees a response within **100 minutes**\n\nYou can also call the **National Voter Helpline: 1950**" },

  { p: [/helpline|1950|contact|phone|call/i],
    r: "📞 **National Voter Helpline: 1950**\n\nCall to:\n• Check your voter registration\n• Find your polling booth\n• Report issues\n• Get election information\n\nAvailable in multiple languages." },

  { p: [/secret|private|anonymous|who.*see|employer/i],
    r: "Yes — your vote is **completely secret** in India. 🔒\n\nThe EVM records your vote without linking it to your identity.\n\nAlso: Under **Section 135B** of the Representation of the People Act, your employer **must give you paid leave** on polling day. Refusing is a punishable offence." },

  { p: [/nri|overseas|abroad|foreign.*indian/i],
    r: "**NRIs** holding an Indian passport can vote!\n\nRegister as an overseas voter using **Form 6A** on nvsp.in.\n\nYou must vote **in person** at your registered constituency in India — postal/proxy voting is not available for NRIs currently." },

  { p: [/electoralsearch|check.*name|name.*roll|voter.*list/i],
    r: "Check your name on the electoral roll at:\n🔗 **electoralsearch.eci.gov.in**\n\nSearch by:\n• Name + state\n• EPIC number\n• Mobile number\n\nIf your name is missing, contact your local **BLO (Booth Level Officer)** immediately." },

  { p: [/booth|polling station|where.*vote|location/i],
    r: "Your polling booth is assigned based on your registered address.\n\nFind it:\n• On your **EPIC card**\n• On the **Voter Helpline App**\n• At **electoralsearch.eci.gov.in**\n\nPolling booths are open **7 AM – 6 PM** on polling day." },

  { p: [/how.*vote|voting day|election day|process|steps/i],
    r: "On polling day:\n1. Carry your EPIC card or approved alternative ID\n2. Go to your assigned polling booth\n3. Show ID — officer marks your finger with **indelible ink**\n4. Press the **blue EVM button** next to your candidate\n5. Verify on **VVPAT** (7 seconds)\n\nSee the **Voting Guide** section for full details." },

  { p: [/thank|thanks|great|helpful|awesome|good/i],
    r: "You're welcome! 😊 Every vote counts — make yours count in 2026! 🗳️\n\nAnything else you'd like to know?" },
]

function chatbotLogic(input) {
  const text = input.trim()
  if (!text) return null
  // Check state-specific queries first
  const stateReply = getStateInfoReply(text)
  if (stateReply) return stateReply
  for (const entry of KB) {
    if (entry.p.some(p => p.test(text))) return entry.r
  }
  return "I'm not sure about that. Try asking about:\n• Eligibility to vote\n• How to register (NVSP)\n• EPIC / Voter ID card\n• EVM and VVPAT\n• NOTA\n• Voter Helpline 1950\n• Polling booth location\n• CM of Maharashtra / Delhi / Karnataka…"
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

const SUGGESTIONS = [
  'Am I eligible to vote?',
  'How do I register on NVSP?',
  'What is an EPIC card?',
  'What is EVM and VVPAT?',
  'Who is CM of Maharashtra?',
  'Next election in Delhi?',
]

const LS_CHAT = 'eg-chat-history'

export default function ChatAssistant({ open, onClose, dark }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_CHAT))
      if (saved?.length) return saved
    } catch {}
    return [{ role: 'bot', text: "🙏 Namaste! I'm VoteGenie.\n\nAsk me anything about voting in India — eligibility, NVSP registration, EPIC card, EVM, NOTA, or polling day process." }]
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
      const reply = chatbotLogic(msg)
      setMessages(m => [...m, { role: 'bot', text: reply }])
      setTyping(false)
    }, 500 + Math.random() * 400)
  }, [input])

  const clearHistory = () => {
    const init = [{ role: 'bot', text: "Chat cleared! Ask me anything about voting in India. 🗳️" }]
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
              VoteGenie
            </p>
            <p className="text-[0.68rem] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              India Election Assistant
            </p>
          </div>
          <button onClick={clearHistory}
            className={`text-[0.68rem] font-semibold px-2 py-1 rounded-lg border transition-all
              ${dark ? 'border-white/10 text-slate-500 hover:text-slate-300' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}>
            Clear
          </button>
          <button onClick={onClose} aria-label="Close"
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all hover:rotate-90
              ${dark ? 'bg-white/10 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-gray-700'}`}>
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
            <p className={`text-[0.65rem] font-bold uppercase tracking-widest pt-2 pb-1.5 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
              Try asking:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s, i) => (
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
            placeholder="Ask about voting in India…"
            aria-label="Chat input"
            className={`flex-1 rounded-xl px-3.5 py-2.5 text-[0.85rem] border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400/30
              ${dark
                ? 'bg-white/[0.07] border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-400'
                : 'bg-slate-50 border-slate-200 text-gray-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white'
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
