import { useState, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'

const SECTION_MAP = { eligibility: 'eligibility', guide: 'guide', timeline: 'timeline', documents: 'documents' }

const FAQ_META = [
  { action: 'eligibility', actionKey: 'faqActionEligibility', icon: '✅' },
  { action: 'guide',       actionKey: 'faqActionGuide',       icon: '📝' },
  { action: 'documents',   actionKey: 'faqActionDocuments',   icon: '🪪' },
  { action: 'documents',   actionKey: 'faqActionIDs',         icon: '📄' },
  { action: 'timeline',    actionKey: 'faqActionTimeline',    icon: '📅' },
  { action: null,          actionKey: null,                   icon: '🗳️' },
  { action: null,          actionKey: null,                   icon: '🔘' },
  { action: 'timeline',    actionKey: 'faqActionPostal',      icon: '📍' },
  { action: null,          actionKey: null,                   icon: '⚖️' },
  { action: null,          actionKey: null,                   icon: '📱' },
  { action: null,          actionKey: null,                   icon: '🏢' },
  { action: null,          actionKey: null,                   icon: '📞' },
]

const ACTION_LABELS = {
  faqActionEligibility: { en: 'Check My Eligibility →', hi: 'पात्रता जाँचें →' },
  faqActionGuide:       { en: 'Open Voting Guide →',    hi: 'मतदान गाइड खोलें →' },
  faqActionDocuments:   { en: 'See Documents List →',   hi: 'दस्तावेज़ सूची देखें →' },
  faqActionIDs:         { en: 'See All Accepted IDs →', hi: 'सभी स्वीकृत ID देखें →' },
  faqActionTimeline:    { en: 'View Key Dates →',       hi: 'मुख्य तिथियाँ देखें →' },
  faqActionPostal:      { en: 'Check Postal Ballot →',  hi: 'डाक मतपत्र जाँचें →' },
}

function FAQItem({ item, meta, isOpen, onToggle, dark, lang }) {
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200
      ${isOpen
        ? dark ? 'border-indigo-600/40 shadow-[0_4px_24px_rgba(99,102,241,0.15)]' : 'border-indigo-300/60 shadow-[0_4px_24px_rgba(99,102,241,0.1)]'
        : dark ? 'border-white/[0.08] hover:border-violet-700/30' : 'border-slate-200 hover:border-indigo-200'
      } ${dark ? 'bg-gray-900' : 'bg-white'}`}>
      <button onClick={onToggle} aria-expanded={isOpen}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200
          ${isOpen ? dark ? 'bg-indigo-950/50' : 'bg-gradient-to-r from-indigo-50 to-violet-50/60'
                   : dark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'}`}>
        <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-200
          ${isOpen ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_4px_12px_rgba(99,102,241,0.35)]'
                   : dark ? 'bg-white/[0.07] border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
          {meta.icon}
        </span>
        <span className={`flex-1 font-bold text-[0.95rem] tracking-[-0.02em] leading-snug text-left
          ${isOpen ? dark ? 'text-indigo-300' : 'text-indigo-700'
                   : dark ? 'text-white' : 'text-gray-900'}`}>
          {item.q}
        </span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] font-bold border transition-all duration-300
          ${isOpen ? 'bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent text-white rotate-180'
                   : dark ? 'bg-white/[0.07] border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>▾</span>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className={`px-5 pb-5 pt-3 border-t ${dark ? 'border-white/[0.06]' : 'border-indigo-50'}`}>
            <div className="flex gap-3">
              <div className="w-0.5 flex-shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 self-stretch" />
              <div>
                <p className={`text-[0.9rem] leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{item.a}</p>
                {meta.action && meta.actionKey && (
                  <button onClick={() => document.getElementById(SECTION_MAP[meta.action])?.scrollIntoView({ behavior: 'smooth' })}
                    className={`inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl text-[0.82rem] font-bold border transition-all duration-200 hover:-translate-y-0.5
                      ${dark ? 'bg-indigo-950/60 border-indigo-700/50 text-indigo-400 hover:bg-indigo-900/60'
                             : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'}`}>
                    {ACTION_LABELS[meta.actionKey]?.[lang] || ACTION_LABELS[meta.actionKey]?.en}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQ({ dark, onOpenAssistant }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'hi' ? 'hi' : 'en'
  const [openIdx,  setOpenIdx]  = useState(null)
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState('all')
  const [showAll,  setShowAll]  = useState(false)
  const searchRef  = useRef(null)
  const sectionRef = useScrollReveal(60)

  const faqs = t('faq.items', { returnObjects: true })

  const CATEGORIES = [
    { id: 'all',          label: t('faq.catAll'),          icon: '✦' },
    { id: 'eligibility',  label: t('faq.catEligibility'),  icon: '✅' },
    { id: 'registration', label: t('faq.catRegistration'), icon: '📝' },
    { id: 'voting',       label: t('faq.catVotingDay'),    icon: '🗳️' },
  ]

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i)

  const filtered = useMemo(() => {
    let list = faqs.map((f, i) => ({ ...f, _idx: i }))
    if (category !== 'all') list = list.filter(f => f.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    }
    return list
  }, [query, category, faqs])

  useMemo(() => { setOpenIdx(null); setShowAll(false) }, [query, category])

  const INITIAL = 5
  const visible = showAll ? filtered : filtered.slice(0, INITIAL)
  const hasMore = filtered.length > INITIAL && !showAll

  return (
    <section id="faq" className="scroll-mt-20" aria-labelledby="faq-h" ref={sectionRef}>
      <SectionHeader tag={t('faq.tag')} title={t('faq.title')} subtitle={t('faq.subtitle')} dark={dark} />

      {/* Search */}
      <div className="sr relative mb-5">
        <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${dark ? 'text-slate-500' : 'text-slate-400'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input ref={searchRef} type="search" value={query}
          onChange={e => { setQuery(e.target.value); setOpenIdx(null); setShowAll(false) }}
          placeholder={t('faq.searchPlaceholder')} aria-label={t('faq.searchPlaceholder')}
          className={`w-full rounded-2xl pl-11 pr-12 py-3.5 text-[0.92rem] border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/30
            ${dark ? 'bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/60 focus:bg-white/[0.08]'
                   : 'bg-slate-50 border-indigo-100 text-gray-900 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white'}`} />
        {query && (
          <button onClick={() => { setQuery(''); searchRef.current?.focus() }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all hover:scale-110
              ${dark ? 'bg-white/10 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-500 hover:text-gray-700'}`}>✕</button>
        )}
      </div>

      {/* Category pills */}
      <div className="sr flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => {
          const count = cat.id === 'all' ? faqs.length : faqs.filter(f => f.category === cat.id).length
          const isActive = category === cat.id
          return (
            <button key={cat.id} onClick={() => { setCategory(cat.id); setOpenIdx(null); setShowAll(false) }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.78rem] font-bold border transition-all duration-200 hover:-translate-y-0.5
                ${isActive ? 'bg-gradient-to-r from-indigo-500 to-violet-600 border-transparent text-white shadow-glow'
                           : dark ? 'bg-white/5 border-white/10 text-slate-400 hover:border-indigo-600/50 hover:text-indigo-400'
                                  : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}>
              <span>{cat.icon}</span>{cat.label}
              <span className={`text-[0.68rem] px-1.5 py-0.5 rounded-full font-extrabold
                ${isActive ? 'bg-white/20 text-white' : dark ? 'bg-white/10 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {query && filtered.length > 0 && (
        <p className={`text-[0.8rem] font-semibold mb-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          {filtered.length} {filtered.length !== 1 ? (lang === 'hi' ? 'परिणाम' : 'results') : (lang === 'hi' ? 'परिणाम' : 'result')} &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <div className={`rounded-2xl border p-10 text-center ${dark ? 'bg-gray-900 border-violet-900/20' : 'bg-white border-indigo-100'}`}>
          <div className="text-4xl mb-4">🤔</div>
          <p className={`font-bold text-[1rem] mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{t('faq.noResults', { query })}</p>
          <p className={`text-[0.88rem] mb-5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{t('faq.noResultsSub')}</p>
          <button onClick={onOpenAssistant}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[0.88rem] text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow hover:-translate-y-0.5 transition-all">
            {t('faq.askAssistant')}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {visible.map((item) => (
              <FAQItem key={item._idx} item={item} meta={FAQ_META[item._idx] || { icon: '❓', action: null, actionKey: null }}
                isOpen={openIdx === item._idx} onToggle={() => toggle(item._idx)} dark={dark} lang={lang} />
            ))}
          </div>
          {hasMore && (
            <button onClick={() => setShowAll(true)}
              className={`mt-4 w-full py-3 rounded-2xl text-[0.88rem] font-bold border transition-all hover:-translate-y-0.5
                ${dark ? 'border-white/10 text-slate-400 hover:border-indigo-600/50 hover:text-indigo-400 bg-white/[0.03]'
                       : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 bg-white'}`}>
              {t('faq.showMore', { count: filtered.length - INITIAL })}
            </button>
          )}
        </>
      )}

      <div className={`mt-8 rounded-2xl border p-6 flex flex-col sm:flex-row items-center gap-5
        ${dark ? 'bg-gradient-to-br from-indigo-950/60 to-violet-950/40 border-indigo-800/30' : 'bg-gradient-to-br from-indigo-50 to-violet-50/60 border-indigo-100'}`}>
        <div className="flex-1 text-center sm:text-left">
          <p className={`font-extrabold text-[1rem] tracking-[-0.02em] mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{t('faq.stillHaveQuestions')}</p>
          <p className={`text-[0.88rem] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{t('faq.stillHaveQuestionsSub')}</p>
        </div>
        <button onClick={onOpenAssistant}
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[0.88rem] text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow hover:-translate-y-0.5 hover:shadow-glow-lg active:scale-95 transition-all">
          {t('faq.askAssistant')}
        </button>
      </div>
    </section>
  )
}
