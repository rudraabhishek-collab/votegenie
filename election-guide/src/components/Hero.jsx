import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useCountUp } from '../hooks/useCountUp'
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

// ─── Particle canvas (lightweight — 25 particles, no line loop) ───────────
function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const particles = []
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        dx: (Math.random() - 0.5) * 0.28,
        dy: (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.35 + 0.1,
      })
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(165,180,252,${p.alpha})`
        ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />
}

// ─── Animated stat ─────────────────────────────────────────────────────────
function AnimatedStat({ num, suffix = '', label, active, color }) {
  const { t } = useTranslation()
  const isNum = !isNaN(parseInt(num))
  const count = useCountUp(isNum ? parseInt(num) : 0, 1400, active)
  return (
    <div className="text-center relative group">
      <div className="text-[2.2rem] font-black tracking-[-0.04em]" style={{ color: color === '#1a237e' ? '#ffffff' : color }}>
        {isNum ? `${count}${suffix}` : num}
      </div>
      <div className="text-[0.72rem] text-white/55 font-semibold mt-0.5 uppercase tracking-[0.1em] cursor-default">{label}</div>
      
      {/* Tooltip for non-partisan */}
      {label === t('hero.statNonPartisan') && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-gray-900/95 border border-indigo-500/30 rounded-lg text-[0.75rem] font-medium text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl z-20">
          {t('hero.tooltipData')}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/95 border-b border-r border-indigo-500/30 rotate-45"></div>
        </div>
      )}
    </div>
  )
}

// ─── Hero search bar ───────────────────────────────────────────────────────
function HeroSearch() {
  const { t } = useTranslation()
  const [query,       setQuery]       = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showDrop,    setShowDrop]    = useState(false)
  const [flash,       setFlash]       = useState(null)
  const inputRef = useRef(null)
  const wrapRef  = useRef(null)

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); setShowDrop(false); return }
    const q = query.toLowerCase()
    const hits = searchIndex
      .filter(i => i.title.toLowerCase().includes(q) || i.keywords.includes(q))
      .slice(0, 5)
    setSuggestions(hits)
    setShowDrop(hits.length > 0)
  }, [query])

  useEffect(() => {
    const h = e => { if (!wrapRef.current?.contains(e.target)) setShowDrop(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const go = useCallback((q) => {
    const section = handleSearch(q)
    if (section) {
      setFlash('found')
      setTimeout(() => { scrollToSection(section); setFlash(null) }, 300)
    } else {
      setFlash('notfound')
      setTimeout(() => setFlash(null), 1800)
    }
    setShowDrop(false)
    setQuery('')
  }, [])

  return (
    <div ref={wrapRef} className="relative w-full max-w-md mx-auto">
      <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 transition-all duration-200
        bg-white border border-[#1a237e]/20 shadow-md
        ${flash === 'notfound'
          ? 'border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
          : flash === 'found'
            ? 'border-green-500 shadow-[0_0_0_3px_rgba(74,222,128,0.15)]'
            : ''
        }`}>
        <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') go(query)
            if (e.key === 'Escape') { setShowDrop(false); inputRef.current?.blur() }
          }}
          onFocus={() => suggestions.length && setShowDrop(true)}
          placeholder={t('hero.searchPlaceholder')}
          aria-label={t('hero.searchAriaLabel')}
          className="flex-1 bg-transparent text-[#1a237e] text-[0.88rem] placeholder:text-slate-600 focus:outline-none min-w-0"
        />
        {query && (
          <kbd className="flex-shrink-0 text-[0.65rem] font-bold text-slate-600 border border-slate-200 rounded px-1.5 py-0.5">↵</kbd>
        )}
      </div>

      {flash === 'notfound' && (
        <p className="absolute -bottom-7 left-0 text-[0.75rem] text-red-500 font-semibold">
          {t('hero.searchNotFound')}
        </p>
      )}

      {showDrop && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl border border-[#1a237e]/15 bg-white shadow-xl overflow-hidden z-20">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => go(s.title)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[0.85rem] text-slate-600 hover:bg-[#f0f4ff] hover:text-[#1a237e] border-b border-slate-100 last:border-0 transition-colors duration-150">
              <span className="text-[#1a237e] text-xs">→</span>
              {s.title}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Floating state info card (slightly rotated, glass effect) ────────────
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
    <div className="absolute right-4 top-16 md:right-8 md:top-20 z-20 pointer-events-none"
      style={{ transform: 'rotate(2.5deg)', animation: 'fadeUp 0.8s 0.9s ease both' }}>
      <div className="bg-[rgba(13,23,87,0.75)] border border-white/25 rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[170px] backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-base">{c.flag}</span>
          <span className="font-black text-[0.85rem] text-white">{c.state}</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-[0.68rem] text-white/60 flex items-center gap-1.5">
            <span className="text-[#FF9933]">🗳️</span>
            <span className="font-semibold text-white/90">{c.next}</span>
          </p>
          <p className="text-[0.68rem] text-white/60 flex items-center gap-1.5">
            <span className="text-[#FF9933]">👤</span>
            <span className="font-semibold text-white/90">{c.cm}</span>
          </p>
          <p className="text-[0.68rem] text-white/60 flex items-center gap-1.5">
            <span className="text-[#FF9933]">🏛️</span>
            <span className="font-semibold text-white/90">{c.party}</span>
          </p>
        </div>
        <p className="text-[0.58rem] text-white/50 mt-2 text-right">Live · ECI Data</p>
      </div>
    </div>
  )
}

// ─── Ink finger visual (subtle, bottom-left) ──────────────────────────────
function InkFingerVisual() {
  return (
    <div className="absolute left-4 bottom-24 md:left-10 md:bottom-28 pointer-events-none opacity-[0.12] z-0"
      style={{ transform: 'rotate(-8deg)' }}>
      <svg viewBox="0 0 80 120" className="w-16 h-24" fill="none">
        {/* Finger shape */}
        <rect x="28" y="30" width="24" height="70" rx="12" fill="#e8eaf6"/>
        <ellipse cx="40" cy="30" rx="12" ry="14" fill="#e8eaf6"/>
        {/* Ink mark */}
        <ellipse cx="40" cy="22" rx="8" ry="5" fill="#1a237e" opacity="0.8"/>
        <ellipse cx="40" cy="22" rx="5" ry="3" fill="#3949ab" opacity="0.6"/>
      </svg>
    </div>
  )
}
// ─── Quick action chips ────────────────────────────────────────────────────
function QuickActions() {
  const { t } = useTranslation()
  const QUICK_ACTIONS = [
    { label: t('hero.quickCheckEligibility'), icon: '✅', section: 'eligibility' },
    { label: t('hero.quickKeyDates'),         icon: '📅', section: 'timeline'    },
    { label: t('hero.quickHowToVote'),        icon: '🗳️', section: 'guide'       },
    { label: t('hero.quickDocuments'),        icon: '📄', section: 'documents'   },
  ]
  const [active, setActive] = useState(null)
  const handleClick = (section, i) => {
    setActive(i)
    setTimeout(() => { scrollToSection(section); setActive(null) }, 250)
  }
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {QUICK_ACTIONS.map((a, i) => (
        <button key={a.section} onClick={() => handleClick(a.section, i)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.8rem] font-bold
            border transition-all duration-200 hover:-translate-y-0.5 active:scale-95
            ${active === i
              ? 'bg-[rgba(13,23,87,0.85)] border-white/40 text-white shadow-md'
              : 'bg-[rgba(13,23,87,0.6)] border-white/25 text-white hover:bg-[rgba(13,23,87,0.8)] hover:border-white/35 shadow-sm hover:shadow-md'
            }`}>
          <span>{a.icon}</span>{a.label}
        </button>
      ))}
    </div>
  )
}

// ─── Trust badges ──────────────────────────────────────────────────────────
function TrustBadges() {
  const { t } = useTranslation()
  const TRUST = [
    { icon: '🔒', text: t('hero.trust100Private'),  sub: t('hero.trustNoData')        },
    { icon: '⚡', text: t('hero.trustUnder2Min'),   sub: t('hero.trustQuickEasy')     },
    { icon: '📋', text: t('hero.trustOfficialInfo'), sub: t('hero.trustVerifiedSources') },
  ]
  return (
    <div className="flex items-center justify-center gap-4 mt-10 flex-wrap"
      style={{ animation: 'fadeUp 0.6s 0.62s ease both' }}>
      {TRUST.map(t => (
        <div key={t.text}
          className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] rounded-full px-3.5 py-1.5 backdrop-blur-sm">
          <span className="text-sm">{t.icon}</span>
          <div className="text-left">
            <p className="text-[0.72rem] font-bold text-white/70 leading-none">{t.text}</p>
            <p className="text-[0.62rem] text-white/50 leading-none mt-0.5">{t.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Hero({ onOpenAssistant }) {
  const { t } = useTranslation()
  const [loading,     setLoading]     = useState(false)
  const [statsActive, setStatsActive] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsActive(true); obs.disconnect() } },
      { threshold: 0.5 }
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const handleStart = useCallback(() => {
    if (loading) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onOpenAssistant() }, 400)
  }, [loading, onOpenAssistant])

  return (
    <section
      className="relative overflow-hidden text-center py-24 px-6"
      style={{
        background: 'linear-gradient(160deg, #0d1757 0%, #1a237e 40%, #2d1b69 70%, #1a0a3e 100%)',
      }}
      aria-labelledby="hero-heading">

      {/* Animated gradient orbs */}
      <div aria-hidden className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FF9933, transparent)' }} />
      <div aria-hidden className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #1a237e, transparent)' }} />

      {/* Large Ashoka Chakra watermark — blue */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <svg viewBox="0 0 200 200" className="w-[700px] h-[700px]">
          <circle cx="100" cy="100" r="92" fill="none" stroke="white" strokeWidth="4"/>
          <circle cx="100" cy="100" r="12" fill="white"/>
          {Array.from({length:24},(_,i)=>{
            const a=(i*15-90)*Math.PI/180
            const x1=100+20*Math.cos(a),y1=100+20*Math.sin(a)
            const x2=100+90*Math.cos(a),y2=100+90*Math.sin(a)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2"/>
          })}
        </svg>
      </div>

      <InkFingerVisual />
      <FloatingStateCard />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Authority logos strip */}
        <div className="flex items-center justify-center gap-5 mb-8 flex-wrap"
          style={{ animation: 'fadeUp 0.5s 0.05s ease both' }}>
          {[
            { src: '/logos/eci.svg', name: 'Election Commission of India', url: 'https://eci.gov.in' },
            { src: '/logos/nvsp.svg', name: 'NVSP', url: 'https://nvsp.in' },
            { src: '/logos/emblem.svg', name: 'Govt. of India', url: 'https://india.gov.in' },
          ].map(logo => (
            <a key={logo.name} href={logo.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-[rgba(13,23,87,0.7)] hover:bg-[rgba(13,23,87,0.85)] border border-white/25 rounded-xl px-4 py-2.5 no-underline transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-xl backdrop-blur-md">
              <img src={logo.src} alt={logo.name} className="w-8 h-8 brightness-0 invert" />
              <span className="text-[0.7rem] font-bold text-white hidden sm:block">{logo.name}</span>
            </a>
          ))}
        </div>

        {/* Live badge */}
        <div className="inline-flex items-center gap-2.5 bg-[rgba(13,23,87,0.7)] border border-white/25 rounded-full text-[0.75rem] font-extrabold tracking-[0.08em] uppercase px-5 py-2 mb-6 text-white shadow-lg backdrop-blur-md"
          style={{ animation: 'fadeUp 0.6s 0.1s ease both' }}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          {t('hero.badge')}
        </div>

        {/* Massive headline */}
        <h1 id="hero-heading"
          className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-[0.95] tracking-[-0.05em] mb-5"
          style={{ animation: 'fadeUp 0.6s 0.18s ease both' }}>
          <span className="text-white">{t('hero.headline1')}</span><br />
          <span style={{
            background: 'linear-gradient(135deg, #FF9933 0%, #f97316 50%, #e65100 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>{t('hero.headline2')}</span>
        </h1>

        {/* Subheading */}
        <p className="text-[1.05rem] text-white/85 max-w-2xl mx-auto mb-8 leading-[1.75] font-medium"
          style={{ animation: 'fadeUp 0.6s 0.28s ease both' }}>
          {t('hero.subheading')}
        </p>

        {/* Primary CTA — massive, bold */}
        <div className="flex flex-col items-center gap-3 mb-8"
          style={{ animation: 'fadeUp 0.6s 0.38s ease both' }}>
          <button onClick={handleStart} disabled={loading}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-[1.1rem]
              text-white bg-gradient-to-r from-[#FF9933] via-[#f97316] to-[#1a237e]
              shadow-[0_8px_32px_rgba(255,153,51,0.4),0_4px_16px_rgba(26,35,126,0.3)]
              hover:shadow-[0_12px_48px_rgba(255,153,51,0.5),0_6px_24px_rgba(26,35,126,0.4)]
              hover:-translate-y-1 hover:scale-105 disabled:opacity-70 disabled:cursor-wait transition-all duration-300">
            {loading ? (
              <>
                <svg className="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>{t('hero.ctaLoading')}</span>
              </>
            ) : (
              <>
                <span className="text-2xl">🗳️</span>
                <span>Check if you can vote in India</span>
                <span className="text-xl">→</span>
              </>
            )}
          </button>
          <p className="text-[0.75rem] text-white/60 font-semibold tracking-wide">
            {t('hero.ctaSubtext')} · Powered by ECI &amp; NVSP
          </p>
        </div>

        {/* Secondary CTAs */}
        <div className="flex gap-3 justify-center flex-wrap mb-8"
          style={{ animation: 'fadeUp 0.6s 0.46s ease both' }}>
          {[
            { href: '#overview', label: t('hero.howItWorks'), icon: '📋' },
            { href: '#indiamap', label: 'Explore States', icon: '🗺️' },
            { href: '#faq',      label: 'FAQ', icon: '❓' },
          ].map(btn => (
            <a key={btn.href} href={btn.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[0.9rem]
                text-white bg-[rgba(13,23,87,0.6)] border border-white/25 shadow-md backdrop-blur-md
                hover:bg-[rgba(13,23,87,0.8)] hover:-translate-y-1 hover:shadow-lg no-underline transition-all duration-200">
              <span>{btn.icon}</span>
              {btn.label}
            </a>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ animation: 'fadeUp 0.6s 0.52s ease both' }}>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-white/50 mb-3">Quick Links</p>
          <QuickActions />
        </div>

        {/* Search */}
        <div className="mt-7" style={{ animation: 'fadeUp 0.6s 0.58s ease both' }}>
          <HeroSearch />
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-10 flex-wrap"
          style={{ animation: 'fadeUp 0.6s 0.62s ease both' }}>
          {[
            { icon: '🔒', text: '100% Private',  sub: 'No data stored', href: null },
            { icon: '⚡', text: 'Under 2 min',   sub: 'Quick & easy',   href: null },
            { icon: '📋', text: 'Official info', sub: 'ECI verified',   href: 'https://eci.gov.in' },
          ].map(b => (
            <a key={b.text} href={b.href || '#'} target={b.href ? '_blank' : '_self'} rel="noopener noreferrer"
              onClick={b.href ? undefined : e => e.preventDefault()}
              className="flex items-center gap-2.5 bg-[rgba(13,23,87,0.6)] border border-white/25 rounded-xl px-4 py-2.5 no-underline transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md backdrop-blur-md"
              style={{ cursor: b.href ? 'pointer' : 'default' }}>
              <span className="text-lg">{b.icon}</span>
              <div className="text-left">
                <p className="text-[0.78rem] font-extrabold text-white leading-none">{b.text}</p>
                <p className="text-[0.68rem] text-white/60 leading-none mt-0.5">{b.sub}</p>
              </div>
              {b.href && <span className="text-[0.65rem] text-[#FF9933] ml-1 font-bold">↗</span>}
            </a>
          ))}
        </div>

        {/* Stats */}
        <div ref={statsRef}
          className="flex justify-center mt-12 pt-10 border-t border-white/15"
          style={{ animation: 'fadeUp 0.6s 0.66s ease both' }}>
          {[
            { num: '5', suffix: ' min', label: t('hero.statToComplete'), color: '#FF9933' },
            { num: '3', suffix: ' steps', label: t('hero.statToRegister'), color: '#1a237e' },
            { num: '100', suffix: '%', label: t('hero.statNonPartisan'), color: '#138808' },
          ].map((s, i) => (
            <div key={i} className={`text-center flex-1 max-w-[180px] px-6 ${i > 0 ? 'border-l border-white/15' : ''}`}>
              <AnimatedStat num={s.num} suffix={s.suffix} label={s.label} active={statsActive} color={s.color} />
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-[0.72rem] text-white/45 font-medium text-center">
          🕐 Last updated: April 2026 · Data is indicative. Verify with{' '}
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-white/70 hover:text-[#FF9933] font-semibold">eci.gov.in</a>
        </p>
      </div>

      {/* Bottom fade */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom,transparent,rgba(13,23,87,0.5))' }} />
    </section>
  )
}
