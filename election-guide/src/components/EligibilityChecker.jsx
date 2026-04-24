import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { states, determineEligibility } from '../data'
import SectionHeader from './SectionHeader'

const LS_KEY = 'eg-elig-data'
// ─── Real-time age hint ────────────────────────────────────────────────────
function ageHint(age) {
  if (!age) return null
  const n = parseInt(age)
  if (isNaN(n) || n < 1) return { type: 'error', msg: 'Please enter a valid age.' }
  if (n < 16) return { type: 'error', msg: `You must be 18+ to vote. You're ${18 - n} years away.` }
  if (n < 18) return { type: 'warn', msg: `Almost there — you need to be ${18 - n} more year${18 - n > 1 ? 's' : ''} older.` }
  if (n >= 18 && n <= 120) return { type: 'ok', msg: '✓ Age requirement met.' }
  return { type: 'error', msg: 'Please enter a valid age.' }
}

// ─── Inline hint pill ─────────────────────────────────────────────────────
function Hint({ hint }) {
  if (!hint) return null
  const colors = {
    ok: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
    warn: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
    error: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
  }
  return (
    <p className={`mt-1.5 text-[0.75rem] font-semibold px-2.5 py-1 rounded-lg border inline-block transition-all duration-200 ${colors[hint.type]}`}>
      {hint.msg}
    </p>
  )
}

// ─── Animated result card ─────────────────────────────────────────────────
function ResultCard({ result, dark, onReset }) {
  const ref = useRef(null)
  useEffect(() => {
    // Trigger entrance animation
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [])

  const palette = {
    eligible: {
      wrap: dark ? 'bg-gradient-to-br from-emerald-950 to-teal-950 border-emerald-700/40' : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200',
      badge: dark ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-800 border-emerald-300',
      title: dark ? 'text-emerald-300' : 'text-emerald-800',
    },
    ineligible: {
      wrap: dark ? 'bg-gradient-to-br from-red-950 to-rose-950 border-red-700/40' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200',
      badge: dark ? 'bg-red-900/60 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-300',
      title: dark ? 'text-red-300' : 'text-red-800',
    },
    maybe: {
      wrap: dark ? 'bg-gradient-to-br from-amber-950 to-yellow-950 border-amber-700/40' : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
      badge: dark ? 'bg-amber-900/60 text-amber-300 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-300',
      title: dark ? 'text-amber-300' : 'text-amber-800',
    },
  }
  const p = palette[result.type]

  return (
    <div ref={ref} className={`p-7 border-t rounded-b-3xl ${p.wrap}`}>
      {/* Status badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.85rem] uppercase tracking-wide font-black border mb-4 shadow-sm ${p.badge}`}>
        <span className="text-lg">{result.icon}</span>
        {result.type === 'eligible' ? 'Eligible to Vote' : result.type === 'ineligible' ? 'Not Eligible' : 'Eligibility Uncertain'}
      </div>

      <h3 className={`text-xl font-black tracking-[-0.03em] mb-2 ${p.title}`}>{result.title}</h3>
      <p className={`text-[0.92rem] leading-relaxed mb-1 ${dark ? 'text-white' : 'text-slate-700'}`}>{result.body}</p>

      {/* Requirement checklist */}
      <div className={`mt-4 rounded-xl p-4 border text-[0.85rem] space-y-2 ${dark ? 'bg-black/20 border-white/10' : 'bg-white/60 border-white'}`}>
        <p className={`font-extrabold text-[0.75rem] uppercase tracking-widest mb-3 ${dark ? 'text-white' : 'text-slate-700'}`}>Requirements</p>
        {[
          { label: 'Must be 18 or older (on Jan 1 of qualifying year)', met: parseInt(result.age) >= 18 },
          { label: 'Must be an Indian citizen', met: result.citizenship === 'citizen' },
          { label: 'Must be registered on the electoral roll', met: result.registered === 'yes' },
        ].map(req => (
          <div key={req.label} className="flex items-center gap-2.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
              ${req.met ? 'bg-emerald-500 text-white' : 'bg-red-400 text-white'}`}>
              {req.met ? '✓' : '✗'}
            </span>
            <span className={dark ? 'text-white' : 'text-slate-700'}>{req.label}</span>
          </div>
        ))}
      </div>

      {/* State-specific info */}
      {result.type === 'eligible' && result.stateData && (
        <div className={`mt-4 rounded-xl p-4 border text-[0.88rem] leading-relaxed ${dark ? 'bg-gray-900/60 border-white/10' : 'bg-white/80 border-indigo-100'}`}>
          <h4 className={`font-extrabold text-[0.87rem] mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
            📍 {result.stateData.label} — Voting Info
          </h4>
          {[
            ['🏛️', 'Lok Sabha seats',       String(result.stateData.seats)],
            ['🗓️', 'Registration deadline', result.stateData.regDeadline],
            ['📮', 'Postal ballot',          result.stateData.postalVoting ? '✅ Available' : '❌ Not available'],
            ['🪪', 'EPIC card required',     result.stateData.epicRequired ? '✅ Yes' : '❌ No'],
            ['📞', 'Voter Helpline',         '1950'],
          ].map(([icon, label, val]) => (
            <p key={label} className={`mb-1.5 ${dark ? 'text-white' : 'text-slate-700'}`}>
              {icon} <strong>{label}:</strong> {val}
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-3 flex-wrap mt-5">
        {result.type === 'eligible' && (
          <a href="#guide"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-[0.85rem] text-white bg-gradient-to-r from-[#FF9933] to-[#1a237e] shadow-[0_4px_12px_rgba(255,153,51,0.4)] hover:-translate-y-0.5 transition-all no-underline">
            📝 Start Registration Guide →
          </a>
        )}
        <button onClick={onReset}
          className={`px-4 py-2.5 rounded-xl font-bold text-[0.85rem] border transition-all hover:border-indigo-400 hover:text-indigo-500
            ${dark ? 'border-white/10 text-slate-600' : 'border-slate-200 text-slate-700'}`}>
          ← Check Again
        </button>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function EligibilityChecker({ dark, onEligible, selectedState, onStateChange }) {
  const [form, setForm] = useState({ age: '', citizenship: '', state: '', registered: 'yes' })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [touched, setTouched] = useState({})

  // Restore saved form
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY))
      if (saved) setForm(saved)
    } catch {}
  }, [])

  // Sync state from parent (Timeline)
  useEffect(() => {
    if (selectedState) setForm(f => ({ ...f, state: selectedState }))
  }, [selectedState])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setTouched(t => ({ ...t, [k]: true }))
    if (result) setResult(null)
    if (k === 'state' && onStateChange) onStateChange(v)
  }

  const validate = () => {
    const e = {}
    if (!form.age || isNaN(form.age) || +form.age < 1 || +form.age > 120) e.age = 'Please enter a valid age.'
    if (!form.citizenship) e.citizenship = 'Please select your citizenship status.'
    if (!form.state) e.state = 'Please select your state / UT.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    localStorage.setItem(LS_KEY, JSON.stringify(form))
    const stateData = states.find(s => s.value === form.state)
    const res = determineEligibility(+form.age, form.citizenship, form.registered, stateData)
    setResult({ ...res, stateData, age: form.age, citizenship: form.citizenship, registered: form.registered })
    if (res.type === 'eligible') onEligible?.()
  }

  const reset = () => { setResult(null); setErrors({}); setTouched({}) }

  const hint = touched.age ? ageHint(form.age) : null

  const inputCls = (err) =>
    `w-full rounded-xl px-4 py-2.5 text-[0.9rem] border transition-all duration-200 focus:outline-none focus:ring-2 appearance-none
    ${err
      ? 'border-red-400 focus:ring-red-300/40 bg-red-50 dark:bg-red-950/30'
      : dark
        ? 'bg-white/10 border-white/10 text-white focus:border-indigo-400 focus:ring-indigo-400/30'
        : 'bg-slate-50 border-indigo-100 text-gray-900 focus:border-indigo-400 focus:bg-white focus:ring-indigo-400/20'
    }`

  const labelCls = `block text-[0.72rem] font-extrabold uppercase tracking-[0.08em] mb-1.5 ${dark ? 'text-white' : 'text-slate-700'}`

  // Live preview
  const livePreview = (() => {
    if (result) return null
    if (!form.age || !form.citizenship) return null
    const n = parseInt(form.age)
    if (isNaN(n)) return null
    if (form.citizenship === 'foreign') return { type: 'ineligible', msg: 'Foreign nationals cannot vote in Indian elections.' }
    if (form.citizenship === 'nri')     return { type: 'maybe',      msg: 'NRIs can vote in person at their registered constituency.' }
    if (n < 18) return { type: 'ineligible', msg: `You need to be ${18 - n} more year${18 - n > 1 ? 's' : ''} older to vote.` }
    if (n >= 18 && form.citizenship === 'citizen') return { type: 'eligible', msg: 'Looking good! Complete the form to confirm.' }
    return null
  })()

  const previewColors = {
    eligible:   dark ? 'bg-emerald-950/60 border-emerald-700/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700',
    ineligible: dark ? 'bg-red-950/60 border-red-700/40 text-red-400'             : 'bg-red-50 border-red-200 text-red-700',
    maybe:      dark ? 'bg-amber-950/60 border-amber-700/40 text-amber-400'       : 'bg-amber-50 border-amber-200 text-amber-700',
  }

  return (
    <section id="eligibility" className="scroll-mt-20" aria-labelledby="elig-h">
      <SectionHeader tag="Eligibility" title="Check your eligibility"
        subtitle="Fill in the form — results update as you type." dark={dark} />

      <div className={`relative overflow-hidden rounded-3xl border shadow-card-hover
        ${dark ? 'bg-gray-900 border-violet-900/20' : 'bg-white border-indigo-100'}`}>
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

            {/* Age */}
            <div>
              <label className={labelCls}>Your Age</label>
              <input type="number" min="1" max="120" placeholder="e.g. 20"
                value={form.age}
                onChange={e => set('age', e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, age: true }))}
                className={inputCls(errors.age)} aria-required />
              <Hint hint={hint} />
              {errors.age && !hint && <p className="text-red-500 text-[0.75rem] font-semibold mt-1">{errors.age}</p>}
            </div>

            {/* Citizenship */}
            <div>
              <label className={labelCls}>Citizenship Status</label>
              <div className="relative">
                <select value={form.citizenship} onChange={e => set('citizenship', e.target.value)}
                  className={inputCls(errors.citizenship) + ' pr-8'} aria-required>
                  <option value="">— Select —</option>
                  <option value="citizen">Indian Citizen (by birth or naturalization)</option>
                  <option value="nri">NRI — Non-Resident Indian</option>
                  <option value="foreign">Foreign National / OCI Holder</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-xs">▾</span>
              </div>
              {errors.citizenship && <p className="text-red-500 text-[0.75rem] font-semibold mt-1">{errors.citizenship}</p>}
            </div>

            {/* State / UT */}
            <div>
              <label className={labelCls}>State / Union Territory</label>
              <div className="relative">
                <select value={form.state} onChange={e => set('state', e.target.value)}
                  className={inputCls(errors.state) + ' pr-8'} aria-required>
                  <option value="">— Select State / UT —</option>
                  <optgroup label="States">
                    {states.filter(s => !['AN','CH','DN','DL','JK','LA','LD','PY'].includes(s.value))
                      .map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </optgroup>
                  <optgroup label="Union Territories">
                    {states.filter(s => ['AN','CH','DN','DL','JK','LA','LD','PY'].includes(s.value))
                      .map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </optgroup>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-xs">▾</span>
              </div>
              {errors.state && <p className="text-red-500 text-[0.75rem] font-semibold mt-1">{errors.state}</p>}
            </div>

            {/* Electoral roll registration */}
            <div>
              <label className={labelCls}>Registered on Electoral Roll?</label>
              <div className="relative">
                <select value={form.registered} onChange={e => set('registered', e.target.value)}
                  className={inputCls(false) + ' pr-8'}>
                  <option value="yes">Yes, I am registered</option>
                  <option value="unsure">Not sure — need to check</option>
                  <option value="no">No, not registered yet</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-xs">▾</span>
              </div>
            </div>
          </div>

          {/* Live preview */}
          {livePreview && (
            <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-[0.95rem] font-bold mb-5 transition-all duration-300 shadow-sm ${previewColors[livePreview.type]}`}>
              <span className="text-xl">{livePreview.type === 'eligible' ? '👍' : livePreview.type === 'ineligible' ? '⚠️' : '🤔'}</span>
              {livePreview.msg}
            </div>
          )}

          <button onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl font-bold text-white text-[0.95rem] bg-gradient-to-r from-[#FF9933] to-[#1a237e] shadow-[0_4px_16px_rgba(255,153,51,0.4)] hover:shadow-[0_8px_24px_rgba(255,153,51,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
            Check My Eligibility →
          </button>
        </div>

        {result && <ResultCard result={result} dark={dark} onReset={reset} />}
      </div>
    </section>
  )
}
