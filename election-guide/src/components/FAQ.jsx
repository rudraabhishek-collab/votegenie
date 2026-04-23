import { useState, useMemo, useRef } from 'react'
import SectionHeader from './SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'

// ─── FAQ data — India ──────────────────────────────────────────────────────
const faqs = [
  { question: 'Who is eligible to vote in India?', answer: 'Any Indian citizen aged 18 or above on January 1 of the qualifying year who is ordinarily resident in a constituency is eligible. You must be registered on the electoral roll.', action: 'eligibility', actionLabel: 'Check My Eligibility →', category: 'eligibility', icon: '✅' },
  { question: 'How do I register as a new voter?', answer: 'Visit nvsp.in or download the Voter Helpline App. Fill Form 6 with your name, date of birth, address, and a passport-size photo. You can also visit your local BLO (Booth Level Officer) office.', action: 'guide', actionLabel: 'Open Voting Guide →', category: 'registration', icon: '📝' },
  { question: 'What is an EPIC card?', answer: "EPIC stands for Electors' Photo Identity Card — commonly called the Voter ID card. It is issued by the Election Commission of India and is the primary identity document for voting.", action: 'documents', actionLabel: 'See Documents List →', category: 'registration', icon: '🪪' },
  { question: "I don't have my EPIC card. Can I still vote?", answer: 'Yes. ECI accepts 12 alternative photo IDs including Aadhaar, Passport, Driving Licence, PAN card, MNREGA Job Card, Bank Passbook with photo, and more. You can also use the e-EPIC (digital Voter ID) on your phone.', action: 'documents', actionLabel: 'See All Accepted IDs →', category: 'registration', icon: '📄' },
  { question: 'When is the last date to register?', answer: 'Registration closes approximately 30 days before the election. Check the Key Dates section for the exact deadline for the current election cycle.', action: 'timeline', actionLabel: 'View Key Dates →', category: 'registration', icon: '📅' },
  { question: 'What is an EVM and is it reliable?', answer: 'An Electronic Voting Machine (EVM) is a standalone device used to record votes. It is not connected to the internet. The VVPAT machine lets you verify your vote on a paper slip for 7 seconds.', action: null, category: 'voting', icon: '🗳️' },
  { question: 'What is NOTA?', answer: 'NOTA stands for "None of the Above." It is the last option on every EVM ballot. If you are not satisfied with any candidate, you can press NOTA. Your vote is counted but does not go to any candidate.', action: null, category: 'voting', icon: '🔘' },
  { question: 'Can I vote if I am away from my constituency?', answer: 'You must vote in your registered constituency. However, senior citizens (80+), persons with disabilities (PwD), and essential service workers can apply for a Postal Ballot.', action: 'timeline', actionLabel: 'Check Postal Ballot Deadlines →', category: 'voting', icon: '📍' },
  { question: 'What is the Model Code of Conduct?', answer: 'The Model Code of Conduct (MCC) is a set of guidelines issued by ECI that governs the conduct of political parties and candidates during elections. It comes into effect when the election schedule is announced.', action: null, category: 'eligibility', icon: '⚖️' },
  { question: 'How do I report election violations?', answer: 'Use the cVIGIL app to report MCC violations with photo or video evidence. ECI guarantees a response within 100 minutes. You can also call the National Voter Helpline at 1950.', action: null, category: 'voting', icon: '📱' },
  { question: 'Can my employer stop me from voting?', answer: 'No. Under Section 135B of the Representation of the People Act, every employer must give employees paid leave on polling day. Refusing to do so is a punishable offence.', action: null, category: 'eligibility', icon: '🏢' },
  { question: 'What is the Voter Helpline number?', answer: 'The National Voter Helpline number is 1950. You can call to check your voter registration, find your polling booth, report issues, or get any election-related information.', action: null, category: 'registration', icon: '📞' },
]

const CATEGORIES = [
  { id: 'all',          label: 'All',          icon: '✦' },
  { id: 'eligibility',  label: 'Eligibility',  icon: '✅' },
  { id: 'registration', label: 'Registration', icon: '📝' },
  { id: 'voting',       label: 'Voting Day',   icon: '🗳️' },
]

const SECTION_MAP = { eligibility: 'eligibility', guide: 'guide', timeline: 'timeline', documents: 'documents' }

// ─── Single FAQ item — pure CSS accordion, no JS height measurement ────────
function FAQItem({ item, isOpen, onToggle, dark }) {
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200
      ${isOpen
        ? dark ? 'border-indigo-600/40 shadow-[0_4px_24px_rgba(99,102,241,0.15)]' : 'border-indigo-300/60 shadow-[0_4px_24px_rgba(99,102,241,0.1)]'
        : dark ? 'border-white/[0.08] hover:border-violet-700/30' : 'border-slate-200 hover:border-indigo-200'
      } ${dark ? 'bg-gray-900' : 'bg-white'}`}>

      {/* Question button */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200
          ${isOpen
            ? dark ? 'bg-indigo-950/50' : 'bg-gradient-to-r from-indigo-50 to-violet-50/60'
            : dark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'
          }`}>

        {/* Icon tile */}
        <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-200
          ${isOpen
            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_4px_12px_rgba(99,102,241,0.35)]'
            : dark ? 'bg-white/[0.07] border border-white/10' : 'bg-slate-100 border border-slate-200'
          }`}>
          {item.icon}
        </span>

        {/* Question text */}
        <span className={`flex-1 font-bold text-[0.95rem] tracking-[-0.02em] leading-snug text-left
          ${isOpen
            ? dark ? 'text-indigo-300' : 'text-indigo-700'
            : dark ? 'text-white' : 'text-gray-900'
          }`}>
          {item.question}
        </span>

        {/* Chevron */}
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] font-bold border transition-all duration-300
          ${isOpen
            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent text-white rotate-180'
            : dark ? 'bg-white/[0.07] border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-400'
          }`}>
          ▾
        </span>
      </button>

      {/* Answer — CSS grid trick: grid-rows-[0fr] → grid-rows-[1fr] */}
      <div className={`grid transition-all duration-300 ease-in-out
        ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className={`px-5 pb-5 pt-3 border-t ${dark ? 'border-white/[0.06]' : 'border-indigo-50'}`}>
            <div className="flex gap-3">
              {/* Left accent bar */}
              <div className="w-0.5 flex-shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 self-stretch" />
              <div>
                <p className={`text-[0.9rem] leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.answer}
                </p>
                {item.action && (
                  <button
                    onClick={() => document.getElementById(SECTION_MAP[item.action])?.scrollIntoView({ behavior: 'smooth' })}
                    className={`inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl text-[0.82rem] font-bold border transition-all duration-200 hover:-translate-y-0.5
                      ${dark
                        ? 'bg-indigo-950/60 border-indigo-700/50 text-indigo-400 hover:bg-indigo-900/60'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                      }`}>
                    {item.actionLabel}
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

// ─── Main FAQ ──────────────────────────────────────────────────────────────
export default function FAQ({ dark, onOpenAssistant }) {
  const [openIdx,  setOpenIdx]  = useState(null)
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState('all')
  const [showAll,  setShowAll]  = useState(false)
  const searchRef  = useRef(null)
  const sectionRef = useScrollReveal(60)

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i)

  const filtered = useMemo(() => {
    let list = faqs
    if (category !== 'all') list = list.filter(f => f.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
    }
    return list
  }, [query, category])

  // Reset open item when filter changes
  useMemo(() => { setOpenIdx(null); setShowAll(false) }, [query, category])

  const INITIAL = 5
  const visible = showAll ? filtered : filtered.slice(0, INITIAL)
  const hasMore = filtered.length > INITIAL && !showAll

  return (
    <section id="faq" className="scroll-mt-20" aria-labelledby="faq-h" ref={sectionRef}>
      <SectionHeader
        tag="FAQ"
        title="Common questions answered"
        subtitle="Search below or browse by category. Can't find what you need? Ask the assistant."
        dark={dark}
      />

      {/* Search */}
      <div className="sr relative mb-5">
        <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${dark ? 'text-slate-500' : 'text-slate-400'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpenIdx(null); setShowAll(false) }}
          placeholder="Ask a question…"
          aria-label="Search FAQ"
          className={`w-full rounded-2xl pl-11 pr-12 py-3.5 text-[0.92rem] border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/30
            ${dark
              ? 'bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/60 focus:bg-white/[0.08]'
              : 'bg-slate-50 border-indigo-100 text-gray-900 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white'
            }`}
        />
        {query && (
          <button onClick={() => { setQuery(''); searchRef.current?.focus() }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all hover:scale-110
              ${dark ? 'bg-white/10 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-500 hover:text-gray-700'}`}>
            ✕
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="sr flex flex-wrap gap-2 mb-6" style={{ transitionDelay: '55ms' }}>
        {CATEGORIES.map(cat => {
          const count = cat.id === 'all' ? faqs.length : faqs.filter(f => f.category === cat.id).length
          const isActive = category === cat.id
          return (
            <button key={cat.id} onClick={() => { setCategory(cat.id); setOpenIdx(null); setShowAll(false) }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.78rem] font-bold border transition-all duration-200 hover:-translate-y-0.5
                ${isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 border-transparent text-white shadow-glow'
                  : dark
                    ? 'bg-white/5 border-white/10 text-slate-400 hover:border-indigo-600/50 hover:text-indigo-400'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                }`}>
              <span>{cat.icon}</span>
              {cat.label}
              <span className={`text-[0.68rem] px-1.5 py-0.5 rounded-full font-extrabold
                ${isActive ? 'bg-white/20 text-white' : dark ? 'bg-white/10 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Results count */}
      {query && filtered.length > 0 && (
        <p className={`text-[0.8rem] font-semibold mb-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"
        </p>
      )}

      {/* FAQ list */}
      {filtered.length === 0 ? (
        <div className={`rounded-2xl border p-10 text-center ${dark ? 'bg-gray-900 border-violet-900/20' : 'bg-white border-indigo-100'}`}>
          <div className="text-4xl mb-4">🤔</div>
          <p className={`font-bold text-[1rem] mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>No results for "{query}"</p>
          <p className={`text-[0.88rem] mb-5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Try a different keyword, or ask the assistant directly.</p>
          <button onClick={onOpenAssistant}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[0.88rem] text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow hover:-translate-y-0.5 transition-all">
            🤖 Ask the Assistant
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {visible.map((item) => {
              const idx = faqs.indexOf(item)
              return (
                <FAQItem
                  key={idx}
                  item={item}
                  isOpen={openIdx === idx}
                  onToggle={() => toggle(idx)}
                  dark={dark}
                />
              )
            })}
          </div>

          {hasMore && (
            <button onClick={() => setShowAll(true)}
              className={`mt-4 w-full py-3 rounded-2xl text-[0.88rem] font-bold border transition-all hover:-translate-y-0.5
                ${dark
                  ? 'border-white/10 text-slate-400 hover:border-indigo-600/50 hover:text-indigo-400 bg-white/[0.03]'
                  : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 bg-white'
                }`}>
              Show {filtered.length - INITIAL} more ↓
            </button>
          )}
        </>
      )}

      {/* Still need help */}
      <div className={`mt-8 rounded-2xl border p-6 flex flex-col sm:flex-row items-center gap-5
        ${dark ? 'bg-gradient-to-br from-indigo-950/60 to-violet-950/40 border-indigo-800/30' : 'bg-gradient-to-br from-indigo-50 to-violet-50/60 border-indigo-100'}`}>
        <div className="flex-1 text-center sm:text-left">
          <p className={`font-extrabold text-[1rem] tracking-[-0.02em] mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>Still have questions?</p>
          <p className={`text-[0.88rem] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Our assistant can answer anything about voting, registration, and election day.</p>
        </div>
        <button onClick={onOpenAssistant}
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[0.88rem] text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-glow hover:-translate-y-0.5 hover:shadow-glow-lg active:scale-95 transition-all">
          🤖 Ask the Assistant
        </button>
      </div>
    </section>
  )
}
