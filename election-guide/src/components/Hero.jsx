import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { searchIndex } from '../data'

// ─── Scroll utility ────────────────────────────────────────────────────────
export function scrollToSection(id) {
  const el = document.getElementById(id.replace('#', ''))
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ─── Search utility ────────────────────────────────────────────────────────
export function handleSearch(query) {
  if (!query.trim()) return null
  const q = query.toLowerCase()
  if (/eligib|citizen|age|qualify/.test(q))    return 'eligibility'
  if (/date|deadline|register|when/.test(q))   return 'timeline'
  if (/vote|ballot|booth|poll|how/.test(q))    return 'guide'
  if (/document|id|passport|proof/.test(q))    return 'documents'
  if (/faq|question|help/.test(q))             return 'faq'
  const match = searchIndex.find(i =>
    i.title.toLowerCase().includes(q) || i.keywords.includes(q)
  )
  return match ? match.section.replace('#', '') : null
}

// ─── Floating state info card ──────────────────────────────────────────────
function FloatingStateCard() {
  const [idx, setIdx] = useState(0)
  const cards = [
    { state: 'Maharashtra', flag: '🟠', next: '2029 (Expected)', cm: 'Devendra Fadnavis', party: 'BJP' },
    { state: 'Uttar Pradesh', flag: '🟢', next: '2027 (Expected)', cm: 'Yogi Adityanath', party: 'BJP' },
    { state: 'Tamil Nadu', flag: '🔴', next: '2026 (Expected)', cm: 'M. K. Stalin', party: 'DMK' },
    { state: 'West Bengal', flag: '🟢', next: '2026 (Expected)', cm: 'Mamata Banerjee', party: 'TMC' },
  ]
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % cards.length), 3500)
    return () => clearInterval(t)
  }, [])
  const c = cards[idx]
  return (
    <div
      className="absolute right-6 top-24 md:right-12 md:top-32 z-20 pointer-events-none"
      style={{ animation: 'fadeUp 0.8s 0.9s ease both', opacity: 0 }}
    >
      <div className="bg-[#0B1E3C] backdrop-blur-md border border-white/20 rounded-[20px] px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] min-w-[200px]">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-lg">{c.flag}</span>
          <span className="font-bold text-[0.95rem] text-white">{c.state}</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <p className="text-[0.75rem] text-white/95 flex items-center gap-2">
            <span className="text-[#FF6A00]">📅</span>
            <span className="font-semibold">{c.next}</span>
          </p>
          <p className="text-[0.75rem] text-white/95 flex items-center gap-2">
            <span className="text-[#FF6A00]">👤</span>
            <span className="font-semibold">{c.cm}</span>
          </p>
          <p className="text-[0.75rem] text-white/95 flex items-center gap-2">
            <span className="text-[#FF6A00]">🏛️</span>
            <span className="font-semibold">{c.party}</span>
          </p>
        </div>
        <p className="text-[0.65rem] text-white/60 mt-3 text-right font-medium">Live · ECI Data</p>
      </div>
    </div>
  )
}

export default function Hero({ onOpenAssistant }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleStart = useCallback(() => {
    if (loading) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onOpenAssistant() }, 400)
  }, [loading, onOpenAssistant])

  return (
    <section
      className="relative overflow-hidden text-center"
      style={{
        minHeight: '95vh',
        background: 'linear-gradient(135deg, #f3e7ff 0%, #ffd4b8 35%, #ffcba8 60%, #e8d5ff 100%)',
      }}
      aria-labelledby="hero-heading"
    >
      <FloatingStateCard />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center">

        {/* Top badges row - Authority logos */}
        <div
          className="flex items-center justify-center gap-4 mb-8 flex-wrap"
          style={{ animation: 'fadeUp 0.5s 0.1s ease both', opacity: 0 }}
        >
          {[
            { 
              logo: '/logos/eci.svg', 
              name: 'Election Commission of India',
              url: 'https://eci.gov.in'
            },
            { 
              logo: '/logos/nvsp.svg', 
              name: 'NVSP — Voter Service Portal',
              url: 'https://www.nvsp.in'
            },
            { 
              logo: '/logos/emblem.svg', 
              name: 'Govt. of India',
              url: 'https://www.india.gov.in'
            },
          ].map((badge, i) => (
            <a
              key={i}
              href={badge.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${badge.name} official website`}
              className="relative inline-flex items-center gap-2.5 bg-[#0B1E3C] border border-white/10 rounded-[18px] px-5 py-3 shadow-lg
                hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(255,106,0,0.3)] 
                transition-all duration-300 cursor-pointer no-underline overflow-hidden"
            >
              {/* Ashoka Chakra background watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
                <svg viewBox="0 0 200 200" className="w-24 h-24">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#60a5fa" strokeWidth="3"/>
                  <circle cx="100" cy="100" r="10" fill="#60a5fa"/>
                  {Array.from({ length: 24 }, (_, idx) => {
                    const angle = (idx * 15 - 90) * Math.PI / 180
                    const x1 = 100 + 18 * Math.cos(angle)
                    const y1 = 100 + 18 * Math.sin(angle)
                    const x2 = 100 + 83 * Math.cos(angle)
                    const y2 = 100 + 83 * Math.sin(angle)
                    return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#60a5fa" strokeWidth="2"/>
                  })}
                </svg>
              </div>
              
              {/* Content */}
              <img 
                src={badge.logo} 
                alt={`${badge.name} logo`}
                className="w-6 h-6 object-contain brightness-0 invert relative z-10"
              />
              <span className="text-[0.8rem] font-bold text-white hidden sm:inline relative z-10">{badge.name}</span>
            </a>
          ))}
        </div>

        {/* Small tagline badge */}
        <div
          className="inline-flex items-center gap-2.5 bg-[#0B1E3C] border border-white/10 rounded-full text-[0.7rem] font-extrabold tracking-[0.08em] uppercase px-6 py-2.5 mb-10 text-white shadow-md"
          style={{ animation: 'fadeUp 0.5s 0.2s ease both', opacity: 0 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          First-Time Voter Assistant · India 2026
        </div>

        {/* Main Heading - MAXIMUM VISIBILITY */}
        <h1
          id="hero-heading"
          className="font-black leading-[1.1] tracking-tight mb-8 relative z-10"
          style={{ 
            animation: 'fadeUp 0.6s 0.3s ease both', 
            opacity: 0,
            fontSize: 'clamp(3.5rem, 9vw, 4.5rem)'
          }}
        >
          <span className="block text-[#0B1E3C] font-black drop-shadow-sm mb-2">
            Your vote matters.
          </span>
          <span 
            className="block font-black"
            style={{
              background: 'linear-gradient(135deg, #FF6A00 0%, #FF4500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Let's make it count.
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="text-[1.125rem] text-[#0B1E3C]/70 max-w-[700px] mx-auto mb-12 leading-relaxed font-medium relative z-10"
          style={{ 
            animation: 'fadeUp 0.6s 0.4s ease both', 
            opacity: 0
          }}
        >
          A step-by-step interactive guide for Indian voters — check eligibility, register
          on NVSP, and prepare for polling day.
        </p>

        {/* Primary CTA */}
        <div
          className="flex flex-col items-center gap-3"
          style={{ animation: 'fadeUp 0.6s 0.5s ease both', opacity: 0 }}
        >
          <button
            onClick={handleStart}
            disabled={loading}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-[20px] font-bold text-[1.125rem]
              text-white shadow-[0_8px_32px_rgba(255,106,0,0.4)]
              hover:shadow-[0_12px_48px_rgba(255,106,0,0.5)]
              hover:scale-105 disabled:opacity-70 disabled:cursor-wait transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #FF6A00 0%, #FF4500 100%)',
            }}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>Loading…</span>
              </>
            ) : (
              <>
                <span className="text-xl">☑️</span>
                <span>Check if you can vote in India</span>
                <span className="text-lg">→</span>
              </>
            )}
          </button>

          <p className="text-[0.8rem] text-[#0B1E3C]/60 font-semibold tracking-wide">
            Takes less than 2 minutes · No account needed · Powered by ECI &amp; NVSP
          </p>
        </div>
      </div>
    </section>
  )
}
