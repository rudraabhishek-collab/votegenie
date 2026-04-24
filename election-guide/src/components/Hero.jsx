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
      className="absolute right-4 top-16 md:right-8 md:top-20 z-20 pointer-events-none"
      style={{ transform: 'rotate(2.5deg)', animation: 'fadeUp 0.8s 0.9s ease both', opacity: 0 }}
    >
      <div className="bg-[rgba(13,23,87,0.90)] backdrop-blur-md border border-white/30 rounded-2xl px-4 py-3.5 shadow-lg min-w-[170px]">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-base">{c.flag}</span>
          <span className="font-black text-[0.85rem] text-white">{c.state}</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-[0.68rem] text-white/90 flex items-center gap-1.5">
            <span className="text-[#FF9933]">🗳️</span>
            <span className="font-semibold text-white">{c.next}</span>
          </p>
          <p className="text-[0.68rem] text-white/90 flex items-center gap-1.5">
            <span className="text-[#FF9933]">👤</span>
            <span className="font-semibold text-white">{c.cm}</span>
          </p>
          <p className="text-[0.68rem] text-white/90 flex items-center gap-1.5">
            <span className="text-[#FF9933]">🏛️</span>
            <span className="font-semibold text-white">{c.party}</span>
          </p>
        </div>
        <p className="text-[0.58rem] text-white/70 mt-2 text-right">Live · ECI Data</p>
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
        minHeight: '92vh',
        background: 'linear-gradient(135deg, #FF9933 0%, #fb923c 20%, #fbbf24 40%, #c4b5fd 65%, #a78bfa 85%, #7c3aed 100%)',
      }}
      aria-labelledby="hero-heading"
    >
      {/* Ashoka Chakra watermark */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 200 200" className="w-[680px] h-[680px]">
          <circle cx="100" cy="100" r="92" fill="none" stroke="#1a237e" strokeWidth="2"/>
          <circle cx="100" cy="100" r="12" fill="#1a237e"/>
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * 15 - 90) * Math.PI / 180
            const x1 = 100 + 20 * Math.cos(a), y1 = 100 + 20 * Math.sin(a)
            const x2 = 100 + 90 * Math.cos(a), y2 = 100 + 90 * Math.sin(a)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a237e" strokeWidth="1.5"/>
          })}
        </svg>
      </div>

      <FloatingStateCard />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-32 flex flex-col items-center">

        {/* Floating info cards */}
        <div
          className="absolute left-8 top-24 md:left-16 md:top-32 z-20 pointer-events-none"
          style={{ transform: 'rotate(-3deg)', animation: 'fadeUp 0.8s 0.7s ease both', opacity: 0 }}
        >
          <div className="bg-[rgba(13,23,87,0.90)] backdrop-blur-md border border-white/30 rounded-2xl px-5 py-4 shadow-lg min-w-[160px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🗳️</span>
              <span className="font-black text-[0.9rem] text-white">Voter ID</span>
            </div>
            <p className="text-[0.7rem] text-white/90 leading-relaxed">
              Register online via NVSP portal
            </p>
          </div>
        </div>

        <div
          className="absolute left-8 top-56 md:left-20 md:top-72 z-20 pointer-events-none"
          style={{ transform: 'rotate(2deg)', animation: 'fadeUp 0.8s 0.9s ease both', opacity: 0 }}
        >
          <div className="bg-[rgba(13,23,87,0.90)] backdrop-blur-md border border-white/30 rounded-2xl px-5 py-4 shadow-lg min-w-[140px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👤</span>
              <span className="font-black text-[0.9rem] text-white">Profile</span>
            </div>
            <p className="text-[0.7rem] text-white/90 leading-relaxed">
              Track your registration status
            </p>
          </div>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="text-[clamp(3rem,8vw,5.5rem)] font-black leading-[1.05] tracking-tight mb-6 relative z-10"
          style={{ 
            animation: 'fadeUp 0.55s 0.2s ease both', 
            opacity: 0
          }}
        >
          <span className="text-[#0d1757] drop-shadow-lg text-opacity-100">Your vote matters.</span>
          <br />
          <span className="text-[#FF6B1A] drop-shadow-lg text-opacity-100">
            Let's make it count.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-[1.05rem] text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium relative z-10"
          style={{ 
            animation: 'fadeUp 0.55s 0.3s ease both', 
            opacity: 0
          }}
        >
          A step-by-step interactive guide for Indian voters — check eligibility, register
          on NVSP, and prepare for polling day.
        </p>

        {/* Primary CTA */}
        <div
          className="flex flex-col items-center gap-3"
          style={{ animation: 'fadeUp 0.55s 0.4s ease both', opacity: 0 }}
        >
          <button
            onClick={handleStart}
            disabled={loading}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-semibold text-[1.1rem]
              text-white shadow-md
              hover:shadow-[0_12px_48px_rgba(255,153,51,0.65)]
              hover:-translate-y-1 disabled:opacity-70 disabled:cursor-wait transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #FF9933 0%, #f97316 50%, #ea580c 100%)',
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
                <span className="text-xl">🗳️</span>
                <span>Check if you can vote in India</span>
                <span className="text-lg">→</span>
              </>
            )}
          </button>

          <p className="text-[0.75rem] text-gray-700 dark:text-gray-300 font-semibold tracking-wide">
            Takes less than 2 minutes · No account needed · Powered by ECI &amp; NVSP
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.2))' }}
      />
    </section>
  )
}
