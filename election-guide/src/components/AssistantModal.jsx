import { useState, useEffect, useRef } from 'react'
import { wizardSteps, states, determineEligibility } from '../data'
import { scrollToSection } from './Hero'
// ─── Step progress bar ─────────────────────────────────────────────────────
function StepBar({ total, current, dark }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-500
            ${i < current
              ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
              : i === current
                ? 'bg-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.2)]'
                : dark ? 'bg-slate-800' : 'bg-slate-200'
            }`} />
      ))}
    </div>
  )
}

// ─── Result card ───────────────────────────────────────────────────────────
function ResultCard({ result, dark, onClose, onRestart }) {
  const palette = {
    eligible:   { bg: dark ? 'from-emerald-950 to-teal-950'  : 'from-emerald-50 to-green-50',  icon: '🎉', ring: 'ring-emerald-500/30' },
    ineligible: { bg: dark ? 'from-red-950 to-rose-950'      : 'from-red-50 to-rose-50',        icon: '❌', ring: 'ring-red-500/30'     },
    maybe:      { bg: dark ? 'from-amber-950 to-yellow-950'  : 'from-amber-50 to-yellow-50',    icon: '⚠️', ring: 'ring-amber-500/30'   },
  }
  const p = palette[result.type]

  const nextSteps = result.type === 'eligible' ? [
    { icon: '📝', text: 'Register on nvsp.in using Form 6' },
    { icon: '🪪', text: 'Keep your EPIC card / Aadhaar ready' },
    { icon: '📍', text: 'Find your polling booth on the Voter Helpline App' },
    ...(result.stateData?.postalVoting ? [{ icon: '📮', text: `${result.stateData.label} offers postal ballot for seniors & PwD` }] : []),
  ] : []

  return (
    <div className="animate-[fadeUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]">
      {/* Result hero */}
      <div className={`rounded-2xl bg-gradient-to-br ${p.bg} p-6 mb-5 ring-1 ${p.ring}`}>
        <div className="text-5xl mb-3">{result.icon}</div>
        <h3 className={`text-xl font-black tracking-[-0.03em] mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
          {result.title}
        </h3>
        <p className={`text-[0.9rem] leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {result.body}
        </p>
      </div>

      {/* State info */}
      {result.type === 'eligible' && result.stateData && (
        <div className={`rounded-xl p-4 mb-5 border text-[0.87rem] leading-relaxed
          ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <p className={`font-extrabold text-[0.78rem] uppercase tracking-widest mb-3
            ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            📍 {result.stateData.label} — Voting Info
          </p>
          {[
            ['🏛️', 'Lok Sabha seats',       String(result.stateData.seats)],
            ['🗓️', 'Registration deadline', result.stateData.regDeadline],
            ['📮', 'Postal ballot',          result.stateData.postalVoting ? '✅ Available' : '❌ Not available'],
            ['🪪', 'EPIC card required',     result.stateData.epicRequired ? '✅ Yes' : '❌ No'],
            ['📞', 'Voter Helpline',         '1950'],
          ].map(([icon, label, val]) => (
            <p key={label} className={`mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              {icon} <strong>{label}:</strong> {val}
            </p>
          ))}
        </div>
      )}

      {/* Next steps */}
      {nextSteps.length > 0 && (
        <div className={`rounded-xl p-4 mb-5 border ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
          <p className={`text-[0.72rem] font-extrabold uppercase tracking-widest mb-3
            ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Your next steps</p>
          {nextSteps.map((s, i) => (
            <div key={i} className="flex gap-2.5 items-start mb-2.5 last:mb-0 text-[0.87rem]">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0
                ${dark ? 'bg-indigo-950 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                {s.icon}
              </div>
              <span className={dark ? 'text-slate-300' : 'text-gray-700'}>{s.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2.5">
        {result.type === 'eligible' && (
          <button
            onClick={() => { onClose(); scrollToSection('guide') }}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow hover:-translate-y-0.5 hover:shadow-glow-lg transition-all">
            📝 Start Voting Guide →
          </button>
        )}
        <button
          onClick={() => { onClose(); scrollToSection('eligibility') }}
          className={`w-full py-2.5 rounded-xl font-bold text-[0.88rem] border transition-all hover:-translate-y-0.5
            ${dark ? 'border-white/10 text-slate-400 hover:border-indigo-700 hover:text-indigo-400' : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}>
          Open Full Eligibility Form
        </button>
        <button
          onClick={onRestart}
          className={`w-full py-2.5 rounded-xl font-bold text-[0.88rem] border transition-all
            ${dark ? 'border-white/10 text-slate-500 hover:border-white/20' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}>
          ↺ Start Over
        </button>
      </div>
    </div>
  )
}

// ─── Main AssistantModal — slide-in panel from right ──────────────────────
export default function AssistantModal({ open, onClose, dark, onEligible }) {
  const [step,     setStep]     = useState(0)
  const [answers,  setAnswers]  = useState({})
  const [result,   setResult]   = useState(null)
  const [inputVal, setInputVal] = useState('')
  const inputRef = useRef(null)

  // Reset on open
  useEffect(() => {
    if (open) { setStep(0); setAnswers({}); setResult(null); setInputVal('') }
  }, [open])

  // Escape key
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  // Focus input when step changes
  useEffect(() => {
    if (open && !result) setTimeout(() => inputRef.current?.focus(), 80)
  }, [step, open, result])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const current = wizardSteps[step]

  const advance = (newAnswers) => {
    if (step < wizardSteps.length - 1) {
      setStep(s => s + 1)
      setInputVal('')
    } else {
      const stateData = states.find(s => s.value === newAnswers.state)
      const res = determineEligibility(+newAnswers.age, newAnswers.citizenship, newAnswers.registered, stateData)
      setResult({ ...res, stateData })
      if (res.type === 'eligible') onEligible?.()
      localStorage.setItem('eg-wizard-result', JSON.stringify(newAnswers))
    }
  }

  const handleOption = (key, value) => {
    const updated = { ...answers, [key]: value }
    setAnswers(updated)
    setTimeout(() => advance(updated), 300)
  }

  const handleContinue = () => {
    if (!inputVal.trim()) return
    const updated = { ...answers, [current.key]: inputVal.trim() }
    setAnswers(updated)
    advance(updated)
  }

  const handleRestart = () => { setStep(0); setAnswers({}); setResult(null); setInputVal('') }

  const inputCls = `w-full rounded-xl px-4 py-3 text-[0.95rem] border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-indigo-400/40
    ${dark
      ? 'bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/12'
      : 'bg-slate-50 border-indigo-100 text-gray-900 focus:border-indigo-400 focus:bg-white'
    }`

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 transition-all duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(10,8,24,0.65)', backdropFilter: 'blur(8px)' }}
        aria-hidden />

      {/* Slide-in panel */}
      <aside
        role="dialog"
        aria-modal
        aria-labelledby="assistant-panel-title"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[460px] flex flex-col
          transition-transform duration-[380ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}
          ${dark ? 'bg-gray-950 border-l border-violet-900/30' : 'bg-white border-l border-indigo-100'}
          shadow-[-8px_0_60px_rgba(99,102,241,0.15)]`}>

        {/* Gradient top stripe */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

        {/* ── Panel header ──────────────────────────────────────────── */}
        <div className={`flex items-center gap-4 px-6 pt-7 pb-5 border-b flex-shrink-0
          ${dark ? 'border-white/5' : 'border-indigo-50'}`}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-glow">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="assistant-panel-title" className={`text-[1.05rem] font-black tracking-[-0.03em] ${dark ? 'text-white' : 'text-gray-900'}`}>
              Voter Assistant
            </h2>
            <p className={`text-[0.78rem] mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              {result
                ? 'Your eligibility result'
                : `Step ${step + 1} of ${wizardSteps.length} — ${current?.question?.split('?')[0]}`
              }
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close assistant"
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border
              transition-all duration-200 hover:rotate-90 flex-shrink-0
              ${dark
                ? 'bg-white/8 border-white/10 text-slate-400 hover:bg-indigo-900/40 hover:text-indigo-400'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
              }`}>
            ✕
          </button>
        </div>

        {/* ── Progress bar ──────────────────────────────────────────── */}
        {!result && (
          <div className={`px-6 py-3 border-b flex-shrink-0 ${dark ? 'border-white/5' : 'border-indigo-50'}`}>
            <StepBar total={wizardSteps.length} current={step} dark={dark} />
          </div>
        )}

        {/* ── Scrollable body ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">

          {result ? (
            <ResultCard result={result} dark={dark} onClose={onClose} onRestart={handleRestart} />
          ) : (
            <div key={step} className="animate-[fadeUp_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both]">

              {/* Question */}
              <p className={`text-[1.05rem] font-extrabold tracking-[-0.025em] leading-snug mb-5
                ${dark ? 'text-white' : 'text-gray-900'}`}>
                {current.question}
              </p>

              {/* Options */}
              {current.type === 'options' && (
                <div className="flex flex-col gap-2.5">
                  {current.options.map(opt => (
                    <button key={opt.value}
                      onClick={() => handleOption(current.key, opt.value)}
                      className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl border text-[0.9rem] font-semibold text-left
                        transition-all duration-200 hover:translate-x-1 active:scale-[0.98]
                        ${answers[current.key] === opt.value
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-600 border-transparent text-white shadow-glow'
                          : dark
                            ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-indigo-900/30 hover:border-indigo-700 hover:text-indigo-300'
                            : 'bg-slate-50 border-slate-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700'
                        }`}>
                      <span className="text-xl flex-shrink-0">{opt.icon}</span>
                      <span>{opt.label}</span>
                      {answers[current.key] === opt.value && (
                        <span className="ml-auto text-white/80 text-sm">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Number / text input */}
              {current.type === 'input' && (
                <div className="flex flex-col gap-3">
                  <label className={`text-[0.72rem] font-extrabold uppercase tracking-[0.1em]
                    ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {current.label}
                  </label>
                  <input
                    ref={inputRef}
                    type={current.inputType}
                    placeholder={current.placeholder}
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleContinue()}
                    className={inputCls}
                    min="1" max="120"
                  />
                  {/* Age hint */}
                  {current.key === 'age' && inputVal && (
                    <p className={`text-[0.78rem] font-semibold px-3 py-1.5 rounded-lg border inline-block
                      ${parseInt(inputVal) >= 18
                        ? dark ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : dark ? 'bg-red-950/60 border-red-800/40 text-red-400'             : 'bg-red-50 border-red-200 text-red-600'
                      }`}>
                      {parseInt(inputVal) >= 18 ? '✓ Age requirement met' : `You need to be ${18 - parseInt(inputVal)} more year${18 - parseInt(inputVal) > 1 ? 's' : ''} older`}
                    </p>
                  )}
                </div>
              )}

              {/* Select */}
              {current.type === 'select' && (
                <div className="flex flex-col gap-3">
                  <label className={`text-[0.72rem] font-extrabold uppercase tracking-[0.1em]
                    ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {current.label}
                  </label>
                  <div className="relative">
                    <select
                      ref={inputRef}
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      className={inputCls + ' pr-8 appearance-none'}>
                      <option value="">— Select your state —</option>
                      {states.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▾</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sticky footer nav ─────────────────────────────────────── */}
        {!result && (
          <div className={`flex gap-3 px-6 py-4 border-t flex-shrink-0
            ${dark ? 'border-white/5 bg-gray-950' : 'border-indigo-50 bg-white'}`}>
            {step > 0 && (
              <button
                onClick={() => { setStep(s => s - 1); setInputVal('') }}
                className={`px-4 py-2.5 rounded-xl font-bold text-[0.88rem] border transition-all hover:-translate-y-0.5
                  ${dark ? 'border-white/10 text-slate-400 hover:border-indigo-700 hover:text-indigo-400' : 'border-slate-200 text-slate-500 hover:border-indigo-300'}`}>
                ← Back
              </button>
            )}
            {(current.type === 'input' || current.type === 'select') && (
              <button
                onClick={handleContinue}
                disabled={!inputVal.trim()}
                className="flex-1 py-2.5 rounded-xl font-bold text-[0.88rem] text-white
                  bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow
                  hover:-translate-y-0.5 hover:shadow-glow-lg
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0
                  transition-all duration-200">
                Continue →
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
