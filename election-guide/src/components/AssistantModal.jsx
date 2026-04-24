import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { states } from '../data'
import { scrollToSection } from './Hero'

// ─── Build FLOW dynamically from translations ──────────────────────────────
function buildFlow(t) {
  return [
    {
      key: 'intro',
      botMsg: t('assistant.flow.introMsg'),
      type: 'number',
      placeholder: t('assistant.flow.agePlaceholder'),
      validate: v => {
        const n = parseInt(v)
        if (isNaN(n) || n < 1 || n > 120) return t('assistant.flow.ageError')
        return null
      },
    },
    {
      key: 'citizenship',
      botMsg: null,
      type: 'options',
      options: [
        { label: t('assistant.flow.citizenYes'),     value: 'citizen' },
        { label: t('assistant.flow.citizenNRI'),     value: 'nri'     },
        { label: t('assistant.flow.citizenForeign'), value: 'foreign' },
      ],
    },
    {
      key: 'state',
      botMsg: t('assistant.flow.stateQuestion'),
      type: 'select',
      placeholder: t('assistant.flow.statePlaceholder'),
    },
    {
      key: 'registered',
      botMsg: null,
      type: 'options',
      options: [
        { label: t('assistant.flow.registeredYes'),    value: 'yes'    },
        { label: t('assistant.flow.registeredUnsure'), value: 'unsure' },
        { label: t('assistant.flow.registeredNo'),     value: 'no'     },
      ],
    },
  ]
}

// ─── Eligibility decision logic ────────────────────────────────────────────
function computeResult(answers, t) {
  const { age, citizenship, state, registered } = answers
  const n = parseInt(age)
  const stateData = states.find(s => s.value === state)
  const stateLabel = stateData ? ` — ${stateData.label}` : ''
  const stateIn    = stateData ? ` in ${stateData.label}` : ''

  if (citizenship === 'foreign') return {
    type: 'ineligible',
    headline: t('assistant.flow.resultForeign.headline'),
    reason: t('assistant.flow.resultForeign.reason'),
    suggestions: [],
    stateData: null,
  }
  if (citizenship === 'nri') return {
    type: 'maybe',
    headline: t('assistant.flow.resultNRI.headline'),
    reason: t('assistant.flow.resultNRI.reason'),
    suggestions: [
      { label: t('assistant.flow.suggRegisterNRI'), action: () => window.open('https://nvsp.in', '_blank') },
    ],
    stateData: null,
  }
  if (n < 18) return {
    type: 'ineligible',
    headline: t('assistant.flow.resultTooYoung.headline'),
    reason: t('assistant.flow.resultTooYoung.reason', { years: 18 - n }),
    suggestions: [],
    stateData: null,
  }
  if (registered === 'no') return {
    type: 'action',
    headline: t('assistant.flow.resultNotRegistered.headline'),
    reason: t('assistant.flow.resultNotRegistered.reason', { state: stateIn }),
    suggestions: [
      { label: t('assistant.flow.suggRegister'),       action: () => window.open('https://nvsp.in', '_blank') },
      { label: t('assistant.flow.suggCheckDeadline'),  action: () => scrollToSection('timeline') },
    ],
    stateData,
  }
  if (registered === 'unsure') return {
    type: 'action',
    headline: t('assistant.flow.resultUnsure.headline'),
    reason: t('assistant.flow.resultUnsure.reason', { state: stateIn }),
    suggestions: [
      { label: t('assistant.flow.suggCheckRoll'),    action: () => window.open('https://electoralsearch.eci.gov.in', '_blank') },
      { label: t('assistant.flow.suggCallHelpline'), action: () => window.open('tel:1950') },
    ],
    stateData,
  }
  return {
    type: 'eligible',
    headline: t('assistant.flow.resultEligible.headline'),
    reason: t('assistant.flow.resultEligible.reason', { state: stateIn }),
    suggestions: [
      { label: t('assistant.flow.suggViewDeadline'), action: () => scrollToSection('timeline') },
      { label: t('assistant.flow.suggStartGuide'),   action: () => scrollToSection('guide') },
      { label: t('assistant.flow.suggDocuments'),    action: () => scrollToSection('documents') },
      ...(stateData?.postalVoting ? [{ label: t('assistant.flow.suggPostal'), action: () => scrollToSection('guide') }] : []),
    ],
    stateData,
  }
}

// ─── Dynamic bot message generator ────────────────────────────────────────
function getBotMsg(stepKey, answers, t) {
  if (stepKey === 'citizenship') {
    const n = parseInt(answers.age)
    if (n >= 18) return t('assistant.flow.ageOk', { age: n })
    return t('assistant.flow.ageTooYoung', { age: n })
  }
  if (stepKey === 'state') {
    return t('assistant.flow.citizenPerfect')
  }
  if (stepKey === 'registered') {
    const stateObj = states.find(s => s.value === answers.state)
    return t('assistant.flow.stateGotIt', { state: stateObj ? ` — ${stateObj.label}` : '' })
  }
  return null
}

// ─── Message bubble ────────────────────────────────────────────────────────
function Bubble({ msg, dark, t }) {
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
        {msg.result && <ResultInBubble result={msg.result} dark={dark} t={t} />}
      </div>
    </div>
  )
}

// ─── Result card rendered inside a bot bubble ──────────────────────────────
function ResultInBubble({ result, dark, t }) {
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
      <p className={`text-[0.82rem] leading-relaxed mb-3 ${dark ? 'text-white' : 'text-slate-700'}`}>
        {result.reason}
      </p>
      {/* State info */}
      {result.stateData && result.type === 'eligible' && (
        <div className={`rounded-lg p-2.5 mb-3 text-[0.78rem] border ${dark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'}`}>
          <p className={`font-bold mb-1.5 ${dark ? 'text-white' : 'text-slate-700'}`}>📍 {result.stateData.label}</p>
          <p className={dark ? 'text-white' : 'text-slate-700'}>{t('assistant.flow.stateDeadline', { deadline: result.stateData.regDeadline })}</p>
          <p className={dark ? 'text-white' : 'text-slate-700'}>{t('assistant.flow.statePostal', { status: result.stateData.postalVoting ? '✅' : '❌' })}</p>
          <p className={dark ? 'text-white' : 'text-slate-700'}>{t('assistant.flow.stateHelpline')}</p>
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
  const { t } = useTranslation()
  const FLOW = buildFlow(t)
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
      const result = computeResult(newAnswers, t)
      if (result.type === 'eligible') onEligible?.()
      localStorage.setItem(LS_KEY, JSON.stringify({ messages: [], answers: newAnswers, done: true }))
      botSay(t('assistant.flow.checkingEligibility'), null, 600)
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
      const nextMsg = getBotMsg(nextStep.key, newAnswers, t) || nextStep.botMsg
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
              {t('assistant.title')}
            </h2>
            <p className="text-[0.72rem] text-emerald-500 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              {done ? t('assistant.analysisComplete') : typing ? t('assistant.typing') : t('assistant.status')}
            </p>
          </div>
          {/* Step counter */}
          {!done && flowStep >= 0 && (
            <div className={`text-[0.7rem] font-bold px-2.5 py-1 rounded-full border
              ${dark ? 'border-white/10 text-slate-600 bg-white/5' : 'border-slate-200 text-slate-600 bg-slate-50'}`}>
              {flowStep + 1} / {FLOW.length}
            </div>
          )}
          <button onClick={onClose} aria-label={t('assistant.close')}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all hover:rotate-90
              ${dark ? 'border-white/10 text-slate-600 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
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
            <Bubble key={i} msg={msg} dark={dark} t={t} />
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
                  <option value="">{currentStep.placeholder}</option>                  {states.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-xs">▾</span>
              </div>
              <button
                onClick={() => inputVal && handleAnswer(inputVal, states.find(s => s.value === inputVal)?.label)}
                disabled={!inputVal}
                className="mt-2 w-full py-2.5 rounded-xl font-bold text-[0.88rem] text-white
                  bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow
                  hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0
                  transition-all duration-200">
                {t('assistant.continue')}
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
                      ? 'bg-white/[0.07] border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-400'
                      : 'bg-slate-50 border-slate-200 text-gray-900 placeholder:text-slate-600 focus:border-indigo-400 focus:bg-white'
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
                  {parseInt(inputVal) >= 18
                    ? t('assistant.ageMet')
                    : t('assistant.ageNeedMore', { years: 18 - parseInt(inputVal) })}
                </p>
              )}
            </div>
          )}

          {/* Done state — restart or close */}
          {done && (
            <div className="px-4 pt-3 pb-4 flex gap-2">
              <button onClick={startConversation}
                className={`flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] border transition-all hover:-translate-y-0.5
                  ${dark ? 'border-white/10 text-slate-600 hover:border-indigo-600/50 hover:text-indigo-400' : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}>
                {t('assistant.startOver')}
              </button>
              <button onClick={() => { onClose(); scrollToSection('eligibility') }}
                className="flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow hover:-translate-y-0.5 transition-all">
                {t('assistant.fullEligibilityForm')}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
