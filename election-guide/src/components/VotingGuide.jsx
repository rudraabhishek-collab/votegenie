import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'

function Collapsible({ open, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open) { el.style.maxHeight = el.scrollHeight + 'px'; el.style.opacity = '1' }
    else { el.style.maxHeight = '0'; el.style.opacity = '0' }
  }, [open])
  return (
    <div ref={ref} style={{ maxHeight: 0, opacity: 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease' }}>
      {children}
    </div>
  )
}

export default function VotingGuide({ dark, completed, onComplete }) {
  const { t } = useTranslation()
  const [openIdx, setOpenIdx] = useState(null)
  const steps = t('guide.steps', { returnObjects: true })
  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i)
  const pct = Math.round((completed.length / steps.length) * 100)

  return (
    <section id="guide" className="scroll-mt-20" aria-labelledby="guide-h">
      <SectionHeader tag={t('guide.tag')} title={t('guide.title')} subtitle={t('guide.subtitle')} dark={dark} />

      {/* Progress bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`flex-1 h-2 rounded-full overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }} />
        </div>
        <span className={`text-[0.8rem] font-bold whitespace-nowrap tabular-nums ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {completed.length}/{steps.length} {t('guide.done')}
        </span>
        {pct === 100 && (
          <span className="text-[0.78rem] font-extrabold text-emerald-500 animate-[fadeUp_0.4s_ease_both]">
            {t('guide.allDone')}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step, i) => {
          const isDone = completed.includes(i)
          const isOpen = openIdx === i
          return (
            <div key={i} className={`rounded-2xl border overflow-hidden transition-all duration-300
              ${isDone ? dark ? 'border-emerald-800/40 bg-gray-900' : 'border-emerald-200/60 bg-white'
                       : dark ? 'border-violet-900/20 bg-gray-900' : 'border-indigo-100/60 bg-white'}
              ${isOpen ? 'shadow-card-hover scale-[1.005]' : 'shadow-card hover:shadow-card-hover hover:scale-[1.002]'}`}>

              <button onClick={() => toggle(i)} aria-expanded={isOpen}
                className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors duration-200
                  ${dark ? 'hover:bg-white/5' : 'hover:bg-slate-50/80'}`}>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[0.95rem] font-black flex-shrink-0 transition-all duration-300
                  ${isDone ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                           : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow' + (isOpen ? ' scale-110' : '')}`}>
                  {isDone ? '✓' : step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-extrabold text-[1.02rem] tracking-[-0.025em] ${dark ? 'text-white' : 'text-gray-900'}`}>{step.title}</div>
                  <div className={`text-[0.82rem] mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {isDone ? t('guide.completed') : step.subtitle}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); if (!isDone) onComplete(i) }}
                  aria-label={isDone ? t('guide.completed') : t('guide.markComplete')}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 mr-1
                    ${isDone ? 'bg-emerald-500 border-emerald-500 text-white'
                             : dark ? 'border-slate-600 hover:border-emerald-500' : 'border-slate-300 hover:border-emerald-400'}`}>
                  {isDone && <span className="text-[0.7rem] font-black">✓</span>}
                </button>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.85rem] border flex-shrink-0 transition-all duration-300
                  ${isOpen ? dark ? 'bg-indigo-900/60 border-indigo-700 text-indigo-400 rotate-180' : 'bg-indigo-50 border-indigo-200 text-indigo-600 rotate-180'
                           : dark ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>▾</div>
              </button>

              <Collapsible open={isOpen}>
                <div className={`border-t px-6 pb-6 ${dark ? 'border-white/5' : 'border-indigo-50'}`}>
                  <p className={`text-[0.92rem] leading-relaxed mt-5 mb-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{step.body}</p>
                  <div className="flex flex-col gap-2.5">
                    {step.items.map((item, j) => (
                      <div key={j} className={`flex gap-3 items-start rounded-xl p-3.5 border transition-all duration-200
                        ${dark ? 'bg-white/5 border-white/5 hover:border-indigo-700/40 hover:bg-indigo-950/30'
                               : 'bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50'}`}>
                        <div className={`w-8 h-8 rounded-[9px] flex items-center justify-center text-[0.9rem] flex-shrink-0 border
                          ${dark ? 'bg-indigo-950/60 border-indigo-800/40' : 'bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100'}`}>
                          {item.icon}
                        </div>
                        <div>
                          <strong className={`block font-extrabold text-[0.88rem] mb-0.5 ${dark ? 'text-white' : 'text-gray-800'}`}>{item.title}</strong>
                          <span className={`text-[0.84rem] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap mt-5">
                    {!isDone ? (
                      <button onClick={() => onComplete(i)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[0.85rem] text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all">
                        <span className="w-5 h-5 rounded border-2 border-white flex items-center justify-center text-[0.65rem] font-black">✓</span>
                        {t('guide.markDone')}
                      </button>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.78rem] font-extrabold border
                        ${dark ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {t('guide.completed')}
                      </span>
                    )}
                    <a href={step.ctaHref}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-[0.85rem] border transition-all hover:border-indigo-400 hover:text-indigo-500 no-underline
                        ${dark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                      {step.cta} →
                    </a>
                  </div>
                </div>
              </Collapsible>
            </div>
          )
        })}
      </div>
    </section>
  )
}
