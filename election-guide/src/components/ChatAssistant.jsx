import { useState, useEffect, useRef } from 'react'

// ─── Chatbot knowledge base ────────────────────────────────────────────────
// Each entry: { patterns: [regex], reply: string | fn }
const KB = [
  {
    patterns: [/\bhi\b|\bhello\b|\bhey\b|\bstart\b/i],
    reply: "👋 Hi! I'm your Election Assistant. Ask me anything about voting — eligibility, registration, what to bring, or how the process works.",
  },
  {
    patterns: [/eligible|can i vote|qualify|qualification/i],
    reply: "To vote you generally need to:\n• Be 18 or older\n• Be a citizen\n• Be registered before the deadline\n\nUse the **Eligibility Checker** above to get a personalised result based on your age, state, and citizenship.",
  },
  {
    patterns: [/register|registration|sign up|enroll/i],
    reply: "To register:\n1. Visit your state's election authority website\n2. Fill in your name, address, and ID number\n3. Submit before the **registration deadline**\n\nMost states allow online registration in under 10 minutes. Check the **Key Dates** section for your deadline.",
  },
  {
    patterns: [/deadline|due date|last day|when.*register/i],
    reply: "Registration deadlines vary by state — anywhere from 8 to 30 days before election day. Some states (CO, IL, WA) allow same-day registration.\n\nCheck the **Key Dates** timeline for exact dates, or scroll to the Eligibility section and select your state.",
  },
  {
    patterns: [/document|id|bring|need|require|passport|proof/i],
    reply: "You'll typically need:\n• 🪪 Valid photo ID (passport, driver's license, national ID)\n• 📬 Voter registration card\n• 🏠 Proof of address (utility bill or bank statement)\n\nSome states don't require photo ID. Check the **Documents** section for the full list.",
  },
  {
    patterns: [/early vot|absentee|postal|mail.*vote|vote.*mail/i],
    reply: "Many states offer early voting and absentee/mail-in ballots. Deadlines for these are usually **earlier** than election day.\n\nStates like CA, CO, and WA have extensive early voting. Check the **Key Dates** section and select your state in the Eligibility form.",
  },
  {
    patterns: [/polling|station|where.*vote|location|booth/i],
    reply: "Your polling station is assigned based on your registered address. You can find it:\n• On your voter registration card\n• On your state's election authority website\n\nArrive mid-morning to avoid peak queues. Polls are typically open 7 AM – 8 PM.",
  },
  {
    patterns: [/ballot|how.*vote|mark|cast|voting day|election day/i],
    reply: "On voting day:\n1. Arrive at your polling station with your ID\n2. Check in — an official will find your name\n3. Enter the private voting booth\n4. Mark an **X** next to your choice\n5. Fold and place your ballot in the sealed box\n\nSee the **Voting Guide** section for a full walkthrough.",
  },
  {
    patterns: [/mistake|wrong|error|spoil/i],
    reply: "Made a mistake on your ballot? Don't panic!\n\nRaise your hand and ask an election official for a **replacement ballot**. They'll spoil the incorrect one and give you a fresh one. This is completely normal.",
  },
  {
    patterns: [/secret|private|anonymous|who.*see|see.*vote/i],
    reply: "Yes — your vote is completely secret. 🔒\n\nBallots are anonymous by design. No one — not officials, the government, or your employer — can find out how you voted.",
  },
  {
    patterns: [/disability|accessible|help.*vote|assist/i],
    reply: "Polling stations are required to be accessible. You can:\n• Request assistance from an election official\n• Bring a trusted person to help you\n\nJust inform the presiding officer when you arrive.",
  },
  {
    patterns: [/result|count|tally|accurate|verify/i],
    reply: "Vote counting is done by trained officials and observed by independent monitors and party representatives. Results are verified at multiple levels before being declared official.\n\nPreliminary results are usually available within 24 hours of polls closing.",
  },
  {
    patterns: [/moved|new address|change address|update/i],
    reply: "If you've moved, update your registration before the deadline. Visit your state's election authority website to change your address.\n\n⚠️ Voting at the wrong polling station can invalidate your ballot.",
  },
  {
    patterns: [/citizen|citizenship|permanent resident|visa|non.?resident/i],
    reply: "Only **citizens** (by birth or naturalization) can vote in national elections.\n\nPermanent residents may be eligible for some **local** elections — check with your local election authority.\n\nVisa holders and non-residents are not eligible for national elections.",
  },
  {
    patterns: [/age|how old|18|minimum/i],
    reply: "You must be **18 years old** on or before election day to vote.\n\nSome states allow 17-year-olds to vote in primaries if they'll be 18 by the general election. Check your state's rules.",
  },
  {
    patterns: [/thank|thanks|great|helpful|awesome/i],
    reply: "You're welcome! 😊 Is there anything else you'd like to know about voting?",
  },
]

// ─── chatbotLogic — match query to best reply ─────────────────────────────
function chatbotLogic(input) {
  const text = input.trim()
  if (!text) return null
  for (const entry of KB) {
    if (entry.patterns.some(p => p.test(text))) {
      return typeof entry.reply === 'function' ? entry.reply(text) : entry.reply
    }
  }
  return "I'm not sure about that one. Try asking about:\n• Eligibility\n• Registration\n• Documents to bring\n• Voting day process\n• Early voting\n• Ballot mistakes"
}

// ─── Format reply text (bold **text**, newlines) ──────────────────────────
function FormatMsg({ text }) {
  return (
    <span>
      {text.split('\n').map((line, i) => (
        <span key={i}>
          {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      ))}
    </span>
  )
}

// ─── Suggested quick questions ────────────────────────────────────────────
const SUGGESTIONS = [
  'Am I eligible to vote?',
  'How do I register?',
  'What documents do I need?',
  'How does voting work?',
  'What is early voting?',
]

const LS_CHAT = 'eg-chat-history'

export default function ChatAssistant({ open, onClose, dark }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_CHAT))
      if (saved?.length) return saved
    } catch {}
    return [{ role: 'bot', text: "👋 Hi! I'm your Election Assistant. Ask me anything about voting — eligibility, registration, documents, or what to expect on election day." }]
  })
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Persist chat history
  useEffect(() => {
    localStorage.setItem(LS_CHAT, JSON.stringify(messages))
  }, [messages])

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const send = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')

    // Add user message
    setMessages(m => [...m, { role: 'user', text: msg }])

    // Simulate typing delay
    setTyping(true)
    setTimeout(() => {
      const reply = chatbotLogic(msg)
      setMessages(m => [...m, { role: 'bot', text: reply }])
      setTyping(false)
    }, 600 + Math.random() * 400)
  }

  const clearHistory = () => {
    setMessages([{ role: 'bot', text: "Chat cleared! Ask me anything about voting." }])
    localStorage.removeItem(LS_CHAT)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-3xl border shadow-modal overflow-hidden
          ${dark ? 'bg-gray-900 border-violet-800/30' : 'bg-white border-indigo-100'}
          animate-[fadeUp_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both]`}
        style={{ height: '520px' }}
        role="dialog" aria-label="Election Assistant Chat" aria-modal>

        {/* Top stripe */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

        {/* Header */}
        <div className={`flex items-center gap-3 px-5 py-4 border-b flex-shrink-0
          ${dark ? 'border-white/5' : 'border-indigo-50'}`}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl shadow-glow flex-shrink-0">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-extrabold text-[0.95rem] tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              Election Assistant
            </p>
            <p className="text-[0.72rem] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Online
            </p>
          </div>
          <button onClick={clearHistory} title="Clear chat"
            className={`text-[0.72rem] font-semibold px-2.5 py-1 rounded-lg border transition-all
              ${dark ? 'border-white/10 text-slate-500 hover:text-slate-300' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}>
            Clear
          </button>
          <button onClick={onClose} aria-label="Close chat"
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all hover:rotate-90
              ${dark ? 'bg-white/10 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-gray-700'}`}>
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeUp_0.25s_ease_both]`}>
              {msg.role === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5 shadow-glow">
                  🤖
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[0.87rem] leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm shadow-glow'
                  : dark
                    ? 'bg-white/10 text-slate-200 rounded-bl-sm border border-white/5'
                    : 'bg-slate-100 text-gray-800 rounded-bl-sm'
                }`}>
                <FormatMsg text={msg.text} />
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start animate-[fadeUp_0.2s_ease_both]">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5">
                🤖
              </div>
              <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${dark ? 'bg-white/10 border border-white/5' : 'bg-slate-100'}`}>
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
          <div className={`px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-thin flex-shrink-0 border-t
            ${dark ? 'border-white/5' : 'border-indigo-50'}`}>
            <p className={`text-[0.7rem] font-bold uppercase tracking-widest pt-2.5 pb-1 whitespace-nowrap flex-shrink-0
              ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              Try:
            </p>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s)}
                className={`flex-shrink-0 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full border mt-2 transition-all hover:-translate-y-0.5
                  ${dark
                    ? 'border-violet-800/40 text-indigo-400 hover:bg-indigo-900/40'
                    : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                  }`}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={`flex gap-2 px-4 py-3 border-t flex-shrink-0
          ${dark ? 'border-white/5' : 'border-indigo-50'}`}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask anything about voting…"
            aria-label="Chat input"
            className={`flex-1 rounded-xl px-4 py-2.5 text-[0.88rem] border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400/30
              ${dark
                ? 'bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-400'
                : 'bg-slate-50 border-slate-200 text-gray-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white'
              }`}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || typing}
            aria-label="Send message"
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0">
            ↑
          </button>
        </div>
      </div>
    </>
  )
}
