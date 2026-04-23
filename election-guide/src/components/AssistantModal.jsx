import { useState, useEffect, useRef, useCallback } from 'react'
import { states } from '../data'
import { scrollToSection } from './Hero'

// ─── Conversation flow definition ─────────────────────────────────────────
// Each step: { key, botMsg, type, options?, placeholder?, validate? }
const FLOW = [
  {
    key: 'intro',
    botMsg: "🙏 Namaste! I'm VoteGenie, your personal India election assistant.\n\nI'll help you check if you can vote in the 2026 elections. Let's start with a few quick questions.\n\nHow old are you?",
    type: 'number',
    placeholder: 'Type your age (e.g. 22)',
    validate: v => {
      const n = parseInt(v)
      if (isNaN(n) || n < 1 || n > 120) return 'Please enter a valid age.'
      return null
    },
  },
  {
    key: 'citizenship',
    botMsg: null, // generated dynamically based on age
    type: 'options',
    options: [
      { label: '🇮🇳 Yes, I am an Indian citizen', value: 'citizen' },
      { label: '🌍 I am an NRI (Non-Resident Indian)', value: 'nri' },
      { label: '✈️ I am a foreign national / OCI', value: 'foreign' },
    ],
  },
  {
    key: 'state',
    botMsg: 'Which state or Union Territory are you from?',
    type: 'select',
    placeholder: '— Select your state / UT —',
  },
  {
    key: 'registered',
    botMsg: null, // generated dynamically
    type: 'options',
    options: [
      { label: '✅ Yes, I am registered', value: 'yes' },
      { label: '❓ Not sure — need to check', value: 'unsure' },
      { label: '❌ No, not registered yet', value: 'no' },
    ],
  },
]

// ─── Eligibility decision logic ────────────────────────────────────────────
function computeResult(answers) {
  const { age, citizenship, state, registered } = answers
  const n = parseInt(age)
  const stateData = states.find(s => s.value === state)

  if (citizenship === 'foreign') return {
    type: 'ineligible',
    headline: 'Not Eligible ❌',
    reason: 'Foreign nationals and OCI card holders cannot vote in Indian elections. Only Indian citizens are eligible.',
    suggestions: [],
    stateData: null,
  }
  if (citizenship === 'nri') return {
    type: 'maybe',
    headline: 'NRI — Special Rules Apply ⚠️',
    reason: 'NRIs holding an Indian passport can register as overseas voters and vote in person at their registered constituency. Register using Form 6A on nvsp.in.',
    suggestions: [
      { label: '🌐 Register on nvsp.in (Form 6A)', action: () => window.open('https://nvsp.in', '_blank') },
    ],
    stateData: null,
  }
  if (n < 18) return {
    type: 'ineligible',
    headline: 'Not Yet Eligible ❌',
    reason: `You must be 18 years old on January 1 of the qualifying year. You are ${18 - n} year${18 - n > 1 ? 's' : ''} away from your first vote. Save this app — it'll be ready when you are! 🗳️`,
    suggestions: [],
    stateData: null,
  }
  if (registered === 'no') return {
    type: 'action',
    headline: 'Eligible — But Not Registered 📝',
    reason: `Great news! You are eligible to vote${stateData ? ` in ${stateData.label}` : ''}. But you need to register first. It takes under 5 minutes on nvsp.in.`,
    suggestions: [
      { label: '📝 Register on nvsp.in (Form 6)', action: () => window.open('https://nvsp.in', '_blank') },
      { label: '📅 Check registration deadline', action: () => scrollToSection('timeline') },
    ],
    stateData,
  }
  if (registered === 'unsure') return {
    type: 'action',
    headline: 'Check Your Registration 🔍',
    reason: `You may be eligible to vote${stateData ? ` in ${stateData.label}` : ''}. Check your name on the electoral roll first.`,
    suggestions: [
      { label: '🔍 Check at electoralsearch.eci.gov.in', action: () => window.open('https://electoralsearch.eci.gov.in', '_blank') },
      { label: '📞 Call Voter Helpline 1950', action: () => window.open('tel:1950') },
    ],
    stateData,
  }
  return {
    type: 'eligible',
    headline: "You're Eligible to Vote! 🎉",
    reason: `Congratulations! You are eligible to vote${stateData ? ` in ${stateData.label} (${stateData.seats} Lok Sabha seat${stateData.seats !== 1 ? 's' : ''})` : ''}. Here's what to do next:`,
    suggestions: [
      { label: '📅 View registration deadline', action: () => scrollToSection('timeline') },
      { label: '🗳️ Start Voting Guide', action: () => scrollToSection('guide') },
      { label: '📄 See required documents', action: () => scrollToSection('documents') },
      ...(stateData?.postalVoting ? [{ label: '📮 Postal ballot available in your state', action: () => scrollToSection('guide') }] : []),
    ],
    stateData,
  }
}

// ─── Dynamic bot message generator ────────────────────────────────────────
function getBotMsg(stepKey, answers) {
  if (stepKey === 'citizenship') {
    const n = parseInt(answers.age)
    if (n >= 18) return `Great! ${n} years old — you meet the age requirement ✓\n\nAre you an Indian citizen?`
    return `You're ${n} years old. The minimum voting age in India is 18.\n\nAre you an Indian citizen?`
  }
  if (stepKey === 'state') {
    const cit = answers.citizenship
    if (cit === 'citizen') return "Perfect! Indian citizens can vote in national and state elections.\n\nWhich state or UT are you from?"
    return "Which state or UT are you from?"
  }
  if (stepKey === 'registered') {
    const stateData = states.find(s => s.value === answers.state)
    return `Got it${stateData ? ` — ${stateData.label}` : ''}!\n\nAre you currently registered on the electoral roll?`
  }
  return null
}

// ─── Message bubble ────────────────────────────────────────────────────────
function Bubble({ msg, dark }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm flex-shrink-0 mb-0.5 shadow-glow">
          🤖
        </div>
      )}
      {/* Bubble */}
      <div className={`max-w-[82%] px-4 py-2.5 text-[0.88rem] leading-relaxed whitespace-pre-line
        ${isUser
          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl rounded-br-sm shadow-glow'
          : dark
            ? 'bg-white/[0.09] text-slate-200 rounded-2xl rounded-bl-sm border border-white/[0.07]'
            : 'bg-slate-100 text-gray-800 rounded-2xl rounded-bl-sm'
        }`}>
        {msg.text}
        {/* Result card inside bubble */}
        {msg.result && <ResultInBubble result={msg.result} dark={dark} />}
      </div>
    </div>
  )
}

// ─── Result card rendered inside a bot bubble ──────────────────────────────
function ResultInBubble({ result, dark }) {
  const colors = {
    eligible:   { bg: dark ? 'bg-emerald-950/60 border-emerald-700/40' : 'bg-emerald-50 border-emerald-200', text: dark ? 'text-emerald-300' : 'text-emerald-800' },
    ineligible: { bg: dark ? 'bg-red-950/60 border-red-700/40'         : 'bg-red-50 border-red-200',         text: dark ? 'text-red-300'     : 'text-red-800'     },
    maybe:      { bg: dark ? 'bg-amber-950/60 border-amber-700/40'     : 'bg-amber-50 border-amber-200',     text: dark ? 'text-amber-300'   : 'text-amber-800'   },
    action:     { bg: dark ? 'bg-blue-950/60 border-blue-700/40'       : 'bg-blue-50 border-blue-200',       text: dark ? 'text-blue-300'    : 'text-blue-800'    },
  }
  const c = colors[result.type] || colors.action

  return (
    <div className={`mt-3 rounded-xl border p-3 ${c.bg}`}>
      <p className={`font-extrabold text-[0.9rem] mb-1 ${c.text}`}>{result.headline}</p>
      <p className={`text-[0.82rem] leading-relaxed mb-3 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
        {result.reason}
      </p>
      {/* State info */}
      {result.stateData && result.type === 'eligible' && (
        <div className={`rounded-lg p-2.5 mb-3 text-[0.78rem] border ${dark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'}`}>
          <p className={`font-bold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>📍 {result.stateData.label}</p>
          <p className={dark ? 'text-slate-300' : 'text-slate-600'}>🗓️ Deadline: {result.stateData.regDeadline}</p>
          <p className={dark ? 'text-slate-300' : 'text-slate-600'}>📮 Postal ballot: {result.stateData.postalVoting ? '✅' : '❌'}</p>
          <p className={dark ? 'text-slate-300' : 'text-slate-600'}>📞 Helpline: 1950</p>
        </div>
      )}
      {/* Action buttons */}
      {result.suggestions?.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {result.suggestions.map((s, i) => (
            <button key={i} onClick={s.action}
              className={`w-full text-left px-3 py-2 rounded-lg text-[0.8rem] font-semibold border transition-all hover:-translate-y-0.5
                ${dark
                  ? 'bg-indigo-950/60 border-indigo-700/50 text-indigo-300 hover:bg-indigo-900/60'
                  : 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                }`}>
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Typing indicator ──────────────────────────────────────────────────────
function TypingDots({ dark }) {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm flex-shrink-0 shadow-glow">
        🤖
      </div>
      <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${dark ? 'bg-white/[0.09] border border-white/[0.07]' : 'bg-slate-100'}`}>
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: `${i * 160}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main AssistantModal ───────────────────────────────────────────────────
const LS_KEY = 'eg-assistant-session'

export default function AssistantModal({ open, onClose, dark, onEligible }) {
  const [messages,  setMessages]  = useState([])
  const [flowStep,  setFlowStep]  = useState(-1)   // -1 = not started
  const [answers,   setAnswers]   = useState({})
  const [inputVal,  setInputVal]  = useState('')
  const [inputErr,  setInputErr]  = useState('')
  const [typing,    setTyping]    = useState(false)
  const [done,      setDone]      = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Focus input
  useEffect(() => {
    if (open && !typing && !done) setTimeout(() => inputRef.current?.focus(), 120)
  }, [open, flowStep, typing, done])

  // Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Start conversation when opened
  useEffect(() => {
    if (!open) return
    // Try restore session
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY))
      if (saved?.messages?.length && saved?.done) {
        setMessages(saved.messages)
        setAnswers(saved.answers || {})
        setDone(true)
        setFlowStep(FLOW.length)
        return
      }
    } catch {}
    // Fresh start
    startConversation()
  }, [open])

  const startConversation = useCallback(() => {
    setMessages([])
    setAnswers({})
    setFlowStep(-1)
    setDone(false)
    setInputVal('')
    setInputErr('')
    // Bot intro after short delay
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const firstMsg = FLOW[0].botMsg
      setMessages([{ role: 'bot', text: firstMsg }])
      setFlowStep(0)
    }, 700)
  }, [])

  // Add a bot message with typing delay
  const botSay = useCallback((text, result = null, delay = 800) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { role: 'bot', text, result }])
    }, delay)
  }, [])

  // Handle user submitting an answer
  const handleAnswer = useCallback((value, label) => {
    const step = FLOW[flowStep]
    if (!step) return

    // Validate
    if (step.validate) {
      const err = step.validate(value)
      if (err) { setInputErr(err); return }
    }
    setInputErr('')
    setInputVal('')

    // Add user bubble
    const displayLabel = label || value
    const newAnswers = { ...answers, [step.key]: value }
    setAnswers(newAnswers)
    setMessages(m => [...m, { role: 'user', text: displayLabel }])

    const nextIdx = flowStep + 1

    if (nextIdx >= FLOW.length) {
      // All answers collected — compute result
      const result = computeResult(newAnswers)
      if (result.type === 'eligible') onEligible?.()
      localStorage.setItem(LS_KEY, JSON.stringify({ messages: [], answers: newAnswers, done: true }))
      botSay(result.type === 'eligible'
        ? "Let me check your eligibility… 🔍"
        : "Let me check your eligibility… 🔍", null, 600)
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { role: 'bot', text: '', result }])
        setDone(true)
        setFlowStep(FLOW.length)
        // Persist
        localStorage.setItem(LS_KEY, JSON.stringify({
          messages: [...messages, { role: 'user', text: displayLabel }, { role: 'bot', text: '', result }],
          answers: newAnswers,
          done: true,
        }))
      }, 1400)
    } else {
      // Move to next step
      const nextStep = FLOW[nextIdx]
      const nextMsg = getBotMsg(nextStep.key, newAnswers) || nextStep.botMsg
      setFlowStep(nextIdx)
      botSay(nextMsg)
    }
  }, [flowStep, answers, messages, botSay, onEligible])

  const handleTextSubmit = () => {
    const val = inputVal.trim()
    if (!val) return
    handleAnswer(val, val)
  }

  const currentStep = FLOW[flowStep]

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose}
        className={`fixed inset-0 z-40 transition-all duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(10,8,24,0.65)', backdropFilter: 'blur(8px)' }} />

      {/* Slide-in panel */}
      <aside
        role="dialog" aria-modal aria-labelledby="assistant-title"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[440px] flex flex-col
          transition-transform duration-[380ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}
          ${dark ? 'bg-[#0a0e1f] border-l border-white/[0.08]' : 'bg-white border-l border-slate-200'}
          shadow-[-8px_0_60px_rgba(99,102,241,0.2)]`}>

        {/* Top stripe */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

        {/* Header */}
        <div className={`flex items-center gap-3 px-5 pt-6 pb-4 border-b flex-shrink-0
          ${dark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl flex-shrink-0 shadow-glow">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="assistant-title" className={`font-black text-[1rem] tracking-[-0.03em] ${dark ? 'text-white' : 'text-gray-900'}`}>
              VoteGenie Assistant
            </h2>
            <p className="text-[0.72rem] text-emerald-500 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              {done ? 'Analysis complete' : typing ? 'Typing…' : 'Online · India 2026'}
            </p>
          </div>
          {/* Step counter */}
          {!done && flowStep >= 0 && (
            <div className={`text-[0.7rem] font-bold px-2.5 py-1 rounded-full border
              ${dark ? 'border-white/10 text-slate-400 bg-white/5' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
              {flowStep + 1} / {FLOW.length}
            </div>
          )}
          <button onClick={onClose} aria-label="Close"
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all hover:rotate-90
              ${dark ? 'border-white/10 text-slate-400 hover:bg-white/10' : 'border-slate-200 text-slate-400 hover:bg-slate-100'}`}>
            ✕
          </button>
        </div>

        {/* Progress bar */}
        {!done && flowStep >= 0 && (
          <div className={`px-5 py-2 flex gap-1 flex-shrink-0 ${dark ? 'bg-white/[0.02]' : 'bg-slate-50/50'}`}>
            {FLOW.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500
                ${i < flowStep ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                  : i === flowStep ? 'bg-indigo-400 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]'
                  : dark ? 'bg-white/10' : 'bg-slate-200'
                }`} />
            ))}
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
          {messages.map((msg, i) => (
            <Bubble key={i} msg={msg} dark={dark} />
          ))}
          {typing && <TypingDots dark={dark} />}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className={`flex-shrink-0 border-t ${dark ? 'border-white/[0.07] bg-[#0a0e1f]' : 'border-slate-100 bg-white'}`}>

          {/* Option buttons */}
          {!done && !typing && currentStep?.type === 'options' && (
            <div className="px-4 pt-3 pb-3 flex flex-col gap-2">
              {currentStep.options.map(opt => (
                <button key={opt.value} onClick={() => handleAnswer(opt.value, opt.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[0.88rem] font-semibold text-left border
                    transition-all duration-200 hover:translate-x-1 active:scale-[0.98]
                    ${dark
                      ? 'bg-white/[0.05] border-white/[0.1] text-slate-300 hover:bg-indigo-900/40 hover:border-indigo-600/50 hover:text-indigo-300'
                      : 'bg-slate-50 border-slate-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'
                    }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Select dropdown */}
          {!done && !typing && currentStep?.type === 'select' && (
            <div className="px-4 pt-3 pb-3">
              <div className="relative">
                <select
                  ref={inputRef}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  className={`w-full rounded-xl px-4 py-3 text-[0.9rem] border appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400/30
                    ${dark
                      ? 'bg-white/[0.07] border-white/10 text-white focus:border-indigo-400'
                      : 'bg-slate-50 border-slate-200 text-gray-900 focus:border-indigo-400 focus:bg-white'
                    }`}>
                  <option value="">{currentStep.placeholder}</option>
                  {states.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▾</span>
              </div>
              <button
                onClick={() => inputVal && handleAnswer(inputVal, states.find(s => s.value === inputVal)?.label)}
                disabled={!inputVal}
                className="mt-2 w-full py-2.5 rounded-xl font-bold text-[0.88rem] text-white
                  bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow
                  hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0
                  transition-all duration-200">
                Continue →
              </button>
            </div>
          )}

          {/* Text / number input */}
          {!done && !typing && currentStep?.type === 'number' && (
            <div className="px-4 pt-3 pb-3">
              {inputErr && (
                <p className="text-red-500 text-[0.75rem] font-semibold mb-2">{inputErr}</p>
              )}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="number"
                  min="1" max="120"
                  value={inputVal}
                  onChange={e => { setInputVal(e.target.value); setInputErr('') }}
                  onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
                  placeholder={currentStep.placeholder}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-[0.9rem] border focus:outline-none focus:ring-2 focus:ring-indigo-400/30
                    ${dark
                      ? 'bg-white/[0.07] border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-400'
                      : 'bg-slate-50 border-slate-200 text-gray-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white'
                    }`}
                />
                <button onClick={handleTextSubmit} disabled={!inputVal.trim()}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-glow
                    hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  ↑
                </button>
              </div>
              {/* Live age hint */}
              {inputVal && (
                <p className={`mt-2 text-[0.75rem] font-semibold px-2.5 py-1 rounded-lg border inline-block
                  ${parseInt(inputVal) >= 18
                    ? dark ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : dark ? 'bg-red-950/60 border-red-800/40 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                  {parseInt(inputVal) >= 18 ? '✓ Age requirement met' : `Need ${18 - parseInt(inputVal)} more year${18 - parseInt(inputVal) > 1 ? 's' : ''}`}
                </p>
              )}
            </div>
          )}

          {/* Done state — restart or close */}
          {done && (
            <div className="px-4 pt-3 pb-4 flex gap-2">
              <button onClick={startConversation}
                className={`flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] border transition-all hover:-translate-y-0.5
                  ${dark ? 'border-white/10 text-slate-400 hover:border-indigo-600/50 hover:text-indigo-400' : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}>
                ↺ Start Over
              </button>
              <button onClick={() => { onClose(); scrollToSection('eligibility') }}
                className="flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow hover:-translate-y-0.5 transition-all">
                Full Eligibility Form →
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
