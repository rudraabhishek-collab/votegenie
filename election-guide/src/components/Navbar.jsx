import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { searchIndex } from '../data'
import { searchItems } from '../utils/search'
import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'

// ─── VoteGenie Logo ────────────────────────────────────────────────────────
function Logo({ size = 38 }) {
  return (
    <img
      src="/logo.svg"
      alt="VoteGenie"
      width={size}
      height={size}
      className="drop-shadow-[0_3px_12px_rgba(168,85,247,0.6)] flex-shrink-0 rounded-xl"
    />
  )
}

// ─── Command-palette search ────────────────────────────────────────────────
function NavSearch({ dark }) {
  const [query,   setQuery]   = useState('')
  const [open,    setOpen]    = useState(false)
  const [results, setResults] = useState([])
  const [focused, setFocused] = useState(false)
  const wrapRef  = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return }
    const hits = searchItems(query, 6)
    setResults(hits)
    setOpen(hits.length > 0)
  }, [query])

  useEffect(() => {
    const h = e => { if (!wrapRef.current?.contains(e.target)) { setOpen(false); setFocused(false) } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Cmd+K shortcut
  useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setFocused(true)
      }
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  const go = useCallback((section) => {
    document.querySelector(section)?.scrollIntoView({ behavior: 'smooth' })
    setQuery(''); setOpen(false); setFocused(false); inputRef.current?.blur()
  }, [])

  const hl = (text) => {
    if (!query.trim()) return text
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return text.replace(new RegExp(`(${esc})`, 'gi'), '<mark class="bg-transparent text-indigo-500 font-bold not-italic">$1</mark>')
  }

  return (
    <div ref={wrapRef} className="relative hidden lg:block">
      {/* Input pill */}
      <button
        onClick={() => { inputRef.current?.focus(); setFocused(true) }}
        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all duration-200 cursor-text
          ${focused || open
            ? dark
              ? 'bg-gray-800/90 border-indigo-500/60 shadow-[0_0_0_3px_rgba(99,102,241,0.18)] w-52'
              : 'bg-white border-indigo-300 shadow-[0_0_0_3px_rgba(99,102,241,0.06)] w-52'
            : dark
              ? 'bg-white/[0.06] border-white/[0.1] hover:border-white/20 w-40'
              : 'bg-slate-100/90 border-slate-200 hover:border-indigo-200 w-40'
          }`}>
        <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${focused ? 'text-indigo-400' : dark ? 'text-slate-400' : 'text-white/70'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setFocused(false); inputRef.current?.blur() } }}
          placeholder={focused ? 'Search anything…' : 'Search…'}
          aria-label="Search"
          className={`bg-transparent text-[0.8rem] flex-1 min-w-0 focus:outline-none transition-colors
            ${dark ? 'text-white placeholder:text-slate-400' : 'text-gray-900 placeholder:text-slate-400'}`}
        />
        {query
          ? <button onClick={() => { setQuery(''); setOpen(false) }}
              className={`text-[0.68rem] flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center
                ${dark ? 'bg-white/15 text-white' : 'bg-slate-300 text-slate-600'}`}>✕</button>
          : !focused && (
            <kbd className={`flex-shrink-0 text-[0.6rem] font-bold px-1.5 py-0.5 rounded border
              ${dark ? 'border-white/15 text-slate-400 bg-white/5' : 'border-white/30 text-white/60 bg-white/10'}`}>
              ⌘K
            </kbd>
          )
        }
      </button>

      {/* Results dropdown */}
      {open && (
        <div className={`absolute top-[calc(100%+8px)] right-0 w-72 rounded-2xl border overflow-hidden z-50
          shadow-[0_8px_40px_rgba(0,0,0,0.18)]
          ${dark ? 'bg-gray-900/98 border-violet-900/40' : 'bg-white border-indigo-100'}
          animate-[slideDown_0.18s_ease_both]`}>
          <div className={`px-3 py-2 text-[0.68rem] font-bold uppercase tracking-widest border-b
            ${dark ? 'text-slate-600 border-white/5' : 'text-slate-400 border-slate-100'}`}>
            Results
          </div>
          {results.map((r, i) => (
            <button key={i} onClick={() => go(r.section)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-[0.83rem] border-b last:border-0 transition-colors duration-100
                ${dark ? 'border-white/5 hover:bg-indigo-950/70 text-slate-300' : 'border-slate-50 hover:bg-indigo-50 text-gray-700'}`}>
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[0.65rem] flex-shrink-0
                ${dark ? 'bg-indigo-900/60 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>→</span>
              <span dangerouslySetInnerHTML={{ __html: hl(r.title) }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Navbar ───────────────────────────────────────────────────────────
export default function Navbar({ dark, onToggleDark, onOpenAssistant, user, onOpenAuth, onLogout }) {
  const { t } = useTranslation()
  const NAV_LINKS = [
    { href: '#overview',    label: t('nav.overview'),    emoji: '📋' },
    { href: '#timeline',    label: t('nav.keyDates'),    emoji: '📅' },
    { href: '#eligibility', label: t('nav.eligibility'), emoji: '✅' },
    { href: '#guide',       label: t('nav.votingGuide'), emoji: '🗳️' },
    { href: '#stateinfo',   label: 'State Info',         emoji: '🗺️' },
    { href: '#faq',         label: t('nav.faq'),         emoji: '❓' },
  ]
  const [active,   setActive]   = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const h = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.round((y / max) * 100) : 0)
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50">

        {/* ── India tricolor top strip ─────────────────────────────── */}
        <div className="flex h-[4px]">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        {/* ── Main nav bar ─────────────────────────────────────────── */}
        <nav
          className={`flex items-center justify-between px-5 border-b backdrop-blur-2xl transition-all duration-300
            ${scrolled ? 'h-[54px]' : 'h-[64px]'}
            ${dark
              ? 'bg-[#0d1757]/96 border-white/[0.08]'
              : 'bg-[#1a237e] border-[#283593]'
            }
            ${scrolled ? 'shadow-[0_4px_24px_rgba(26,35,126,0.35)]' : ''}`}
          role="navigation" aria-label="Main navigation">

          {/* ── Logo + wordmark ─────────────────────────────────── */}
          <a href="#" className="flex items-center gap-2.5 no-underline flex-shrink-0 group" aria-label="VoteGenie home">
            <div className="transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]">
              <Logo size={scrolled ? 32 : 36} />
            </div>
            <div className="flex flex-col leading-none gap-[3px]">
              {/* Name */}
              <div className="flex items-baseline">
                <span className={`font-black tracking-[-0.05em] leading-none transition-all duration-300
                  ${scrolled ? 'text-[0.92rem]' : 'text-[1rem]'}
                  text-white`}>
                  Vote
                </span>
                <span className={`font-black tracking-[-0.05em] leading-none transition-all duration-300
                  ${scrolled ? 'text-[0.92rem]' : 'text-[1rem]'}
                  bg-gradient-to-r from-violet-300 to-[#FF9933] bg-clip-text text-transparent`}>
                  Genie
                </span>
                <span className="text-[0.75rem] ml-0.5 leading-none opacity-80">✦</span>
              </div>
              {/* Sub-tag */}
              <div className="flex items-center gap-1.5">
                <span className="text-[0.52rem] font-extrabold tracking-[0.15em] uppercase text-white/60">India</span>
                <span className="flex gap-[2px]">
                  <span className="w-[4px] h-[3px] rounded-[1px] bg-[#FF9933]"/>
                  <span className={`w-[4px] h-[3px] rounded-[1px] ${dark ? 'bg-slate-500' : 'bg-slate-300'}`}/>
                  <span className="w-[4px] h-[3px] rounded-[1px] bg-[#138808]"/>
                </span>
                <span className="text-[0.52rem] font-extrabold tracking-[0.12em] text-white/60">2026</span>
              </div>
            </div>
          </a>

          {/* ── Desktop nav links ───────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(l => {
              const isActive = active === l.href
              return (
                <li key={l.href}>
                  <a href={l.href}
                    className={`relative flex items-center gap-1.5 text-[0.8rem] font-semibold px-3 py-1.5 rounded-xl no-underline
                      transition-all duration-200 group
                      ${isActive
                        ? dark
                          ? 'text-white bg-white/20 border border-white/30'
                          : 'text-white bg-white/20 border border-white/30'
                        : dark
                          ? 'text-slate-300 hover:text-white hover:bg-white/[0.1] border border-transparent'
                          : 'text-white/75 hover:text-white hover:bg-white/[0.15] border border-transparent'
                      }`}>
                    {/* Emoji — always show */}
                    <span className="text-[0.85rem] transition-all duration-200 group-hover:scale-110">
                      {l.emoji}
                    </span>
                    {l.label}
                    {/* Active glow dot */}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* ── Right controls ──────────────────────────────────── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <NavSearch dark={dark} />
            <LanguageSwitcher dark={dark} />

            {/* Theme toggle */}
            <button onClick={onToggleDark} aria-label="Toggle dark mode"
              className="w-8 h-8 rounded-xl border border-white/20 flex items-center justify-center text-sm
                transition-all duration-200 hover:scale-110 hover:rotate-12 bg-white/10 hover:bg-white/20">
              {dark ? '☀️' : '🌙'}
            </button>

            {/* Auth — Login or UserMenu */}
            {user ? (
              <UserMenu user={user} onLogout={onLogout} dark={dark} />
            ) : (
              <button onClick={onOpenAuth}
                className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-[0.8rem]
                  text-white border border-white/25 bg-white/10 hover:bg-white/20
                  transition-all duration-200 hover:-translate-y-0.5">
                🔐 {t('nav.login', 'Login')}
              </button>
            )}

            {/* CTA */}
            <button onClick={onOpenAssistant}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[0.8rem]
                text-[#1a237e] bg-[#FF9933]
                shadow-[0_4px_16px_rgba(255,153,51,0.4),0_1px_0_rgba(255,255,255,0.3)_inset]
                hover:shadow-[0_6px_24px_rgba(255,153,51,0.55)] hover:-translate-y-0.5
                active:scale-95 transition-all duration-200 relative overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative">🗳️</span>
              <span className="relative">{t('nav.checkEligibility')}</span>
            </button>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu" aria-expanded={menuOpen}
              className={`md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl border transition-all
                ${dark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              {[0, 1, 2].map(i => (
                <span key={i} className={`block rounded-full transition-all duration-300
                  ${dark ? 'bg-white' : 'bg-gray-700'}
                  ${i === 0 ? `w-[18px] h-[2px] ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}` : ''}
                  ${i === 1 ? `w-[13px] h-[2px] ${menuOpen ? 'opacity-0 scale-x-0' : ''}` : ''}
                  ${i === 2 ? `w-[18px] h-[2px] ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}` : ''}`} />
              ))}
            </button>
          </div>
        </nav>

        {/* ── Scroll progress bar ──────────────────────────────────── */}
        <div className={`h-[2px] ${dark ? 'bg-white/5' : 'bg-slate-100'}`}>
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-[#FF9933] transition-[width] duration-150"
            style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* ── Mobile backdrop ───────────────────────────────────────── */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 transition-all duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(5,8,20,0.55)', backdropFilter: 'blur(6px)' }} />

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] flex flex-col
          transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
          ${dark ? 'bg-[#0a0e1f] border-l border-white/[0.08]' : 'bg-white border-l border-slate-200'}`}
        aria-label="Mobile navigation">

        {/* Drawer header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b
          ${dark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <div className="flex flex-col leading-none gap-[3px]">
              <div className="flex items-baseline">
                <span className={`font-black text-[0.92rem] tracking-[-0.04em] ${dark ? 'text-white' : 'text-gray-900'}`}>Vote</span>
                <span className="font-black text-[0.92rem] tracking-[-0.04em] bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Genie</span>
                <span className="text-[0.8rem] ml-0.5">⭐</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[0.5rem] font-extrabold tracking-[0.15em] uppercase ${dark ? 'text-slate-600' : 'text-slate-400'}`}>India</span>
                <span className="flex gap-[2px]">
                  <span className="w-[4px] h-[3px] rounded-[1px] bg-[#FF9933]"/>
                  <span className={`w-[4px] h-[3px] rounded-[1px] ${dark ? 'bg-slate-500' : 'bg-slate-300'}`}/>
                  <span className="w-[4px] h-[3px] rounded-[1px] bg-[#138808]"/>
                </span>
                <span className={`text-[0.5rem] font-extrabold tracking-[0.12em] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>2026</span>
              </div>
            </div>
          </div>
          <button onClick={() => setMenuOpen(false)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border transition-all duration-200 hover:rotate-90
              ${dark ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/10' : 'border-slate-200 text-slate-400 hover:text-gray-700 hover:bg-slate-100'}`}>
            ✕
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((l, i) => {
            const isActive = active === l.href
            return (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ animationDelay: `${i * 45}ms` }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[0.9rem] no-underline transition-all duration-200
                  ${isActive
                    ? dark
                      ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 text-white border border-indigo-500/30'
                      : 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-200/60'
                    : dark
                      ? 'text-slate-300 hover:bg-white/[0.06] border border-transparent'
                      : 'text-gray-600 hover:bg-slate-50 border border-transparent'
                  }`}>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0
                  ${isActive
                    ? dark ? 'bg-indigo-600/40' : 'bg-indigo-100'
                    : dark ? 'bg-white/[0.06]' : 'bg-slate-100'
                  }`}>
                  {l.emoji}
                </span>
                <span className="flex-1">{l.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex-shrink-0" />
                )}
              </a>
            )
          })}
        </div>

        {/* Drawer footer */}
        <div className={`px-3 py-4 border-t flex flex-col gap-2 ${dark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
          <button onClick={() => { onOpenAssistant(); setMenuOpen(false) }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[0.9rem] text-white
              bg-gradient-to-r from-[#1a237e] to-[#283593]
              shadow-[0_4px_16px_rgba(26,35,126,0.4)] hover:shadow-[0_6px_24px_rgba(26,35,126,0.5)]
              hover:-translate-y-0.5 transition-all duration-200">
            🗳️ {t('nav.checkIfYouCanVote')}
          </button>
          {!user && (
            <button onClick={() => { onOpenAuth(); setMenuOpen(false) }}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-[0.85rem] border transition-all
                ${dark
                  ? 'border-white/20 text-white bg-white/10 hover:bg-white/20'
                  : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
                }`}>
              🔐 {t('nav.login', 'Login / Sign Up')}
            </button>
          )}
          <button onClick={onToggleDark}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-[0.85rem] border transition-all
              ${dark
                ? 'border-white/10 text-slate-400 hover:bg-white/[0.06]'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}>
            {dark ? `☀️ ${t('nav.switchToLight')}` : `🌙 ${t('nav.switchToDark')}`}
          </button>
        </div>
      </nav>
    </>
  )
}
