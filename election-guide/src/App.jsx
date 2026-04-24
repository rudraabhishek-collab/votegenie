import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import JourneyTracker from './components/JourneyTracker'
import Overview from './components/Overview'
import Timeline from './components/Timeline'
import EligibilityChecker from './components/EligibilityChecker'
import VotingGuide from './components/VotingGuide'
import Documents from './components/Documents'
import FAQ from './components/FAQ'
import StateInfo from './components/StateInfo'
import AssistantModal from './components/AssistantModal'
import ChatAssistant from './components/ChatAssistant'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import UserMenu from './components/UserMenu'
import ElectionGallery from './components/ElectionGallery'
import IndiaMap from './components/IndiaMap'

const LS_STEP  = 'eg-journey-step'
const LS_GUIDE = 'eg-guide-completed'
const LS_THEME = 'eg-theme'
const LS_USER  = 'eg-user'

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem(LS_THEME) === 'dark' } catch { return false }
  })
  const [currentStep, setCurrentStep] = useState(() => {
    try { return parseInt(localStorage.getItem(LS_STEP)) || 0 } catch { return 0 }
  })
  const [guideCompleted, setGuideCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_GUIDE)) || [] } catch { return [] }
  })
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [chatOpen,      setChatOpen]      = useState(false)
  const [selectedState, setSelectedState] = useState('')
  const [authOpen,      setAuthOpen]      = useState(false)
  const [user,          setUser]          = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_USER)) || null } catch { return null }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(LS_THEME, dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => { localStorage.setItem(LS_STEP, currentStep) }, [currentStep])
  useEffect(() => { localStorage.setItem(LS_GUIDE, JSON.stringify(guideCompleted)) }, [guideCompleted])

  // Scroll-based journey advancement
  useEffect(() => {
    const map = { eligibility: 0, guide: 2, documents: 3, timeline: 1 }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const mapped = map[e.target.id]
          if (mapped !== undefined) setCurrentStep(s => Math.max(s, mapped))
        }
      })
    }, { threshold: 0.3 })
    Object.keys(map).forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const handleEligible = () => setCurrentStep(s => Math.max(s, 1))

  const handleGuideComplete = (idx) => {
    setGuideCompleted(prev => prev.includes(idx) ? prev : [...prev, idx])
    const stepMap = { 0: 2, 1: 3, 2: 4 }
    if (stepMap[idx] !== undefined) setCurrentStep(s => Math.max(s, stepMap[idx]))
  }

  const bg = dark ? 'bg-[#0a0d1f] bg-mesh-dark' : 'bg-[#fff8f0] bg-mesh-light'

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300 dark:text-slate-100`}>
      <Navbar
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
        onOpenAssistant={() => setAssistantOpen(true)}
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={() => { setUser(null); localStorage.removeItem(LS_USER) }}
      />

      <Hero onOpenAssistant={() => setAssistantOpen(true)} />

      {/* Decorative Wave Transition */}
      <div className="w-full relative z-10 leading-none -mt-1 overflow-hidden pointer-events-none">
        <svg className="block w-full h-[35px] sm:h-[50px] md:h-[70px]" preserveAspectRatio="none" viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C240 70 480 70 720 35C960 0 1200 0 1440 35V70H0V0Z" fill={dark ? "#0a0d1f" : "#fff8f0"} />
        </svg>
      </div>

      {/* Authority logos bar */}
      <div className={`border-b py-3 px-6 ${dark ? 'bg-[#0d1757]/80 border-white/[0.07]' : 'bg-white border-[#1a237e]/10'}`}>
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-6 flex-wrap">
          {[
            { src: '/logos/eci.svg', name: 'Election Commission of India', url: 'https://eci.gov.in' },
            { src: '/logos/nvsp.svg', name: 'NVSP — Voter Service Portal', url: 'https://nvsp.in' },
            { src: '/logos/emblem.svg', name: 'Government of India', url: 'https://india.gov.in' },
          ].map(logo => (
            <a key={logo.name} href={logo.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200 no-underline">
              <img src={logo.src} alt={logo.name} className="w-7 h-7" />
              <span className={`text-[0.72rem] font-semibold hidden sm:block ${dark ? 'text-slate-400' : 'text-[#1a237e]/70'}`}>{logo.name}</span>
            </a>
          ))}
          <span className={`text-[0.65rem] font-bold ml-auto hidden md:block ${dark ? 'text-slate-600' : 'text-[#1a237e]/40'}`}>
            Official civic education resource
          </span>
        </div>
      </div>

      <JourneyTracker
        onStepClick={i => setCurrentStep(i)}
        dark={dark}
      />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20" id="main-content">
        <Overview dark={dark} />
        <Timeline dark={dark} selectedState={selectedState} />
        <EligibilityChecker
          dark={dark}
          onEligible={handleEligible}
          selectedState={selectedState}
          onStateChange={setSelectedState}
        />
        <VotingGuide dark={dark} completed={guideCompleted} onComplete={handleGuideComplete} />
        <Documents dark={dark} />
        <ElectionGallery dark={dark} />
        <IndiaMap dark={dark} onStateSelect={setSelectedState} />
        <StateInfo dark={dark} />
        <FAQ dark={dark} onOpenAssistant={() => setChatOpen(true)} />
      </main>

      <Footer dark={dark} />

      {/* FAB */}
      <button
        onClick={() => setChatOpen(o => !o)}
        aria-label={chatOpen ? 'Close assistant' : 'Open voter assistant'}
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-[0.88rem] text-white
          bg-gradient-to-r from-[#FF9933] via-[#f97316] to-[#1a237e]
          shadow-[0_8px_32px_rgba(255,153,51,0.45),0_0_0_3px_rgba(26,35,126,0.3)]
          hover:-translate-y-1.5 hover:scale-105 hover:shadow-[0_12px_40px_rgba(255,153,51,0.55)]
          active:scale-95 transition-all duration-300
          ${chatOpen ? 'animate-glow-pulse' : ''}`}>
        <span className={`text-lg transition-transform duration-300 ${chatOpen ? 'rotate-90' : ''}`}>
          {chatOpen ? '✕' : '🗳️'}
        </span>
        <span className="hidden sm:inline">{chatOpen ? 'Close' : 'Ask Assistant'}</span>
        {!chatOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-400 border-2 border-[#0a0d1f]" />
          </span>
        )}
      </button>

      <ChatAssistant open={chatOpen} onClose={() => setChatOpen(false)} dark={dark} />

      <AssistantModal
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        dark={dark}
        onEligible={handleEligible}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={u => setUser(u)}
        dark={dark}
      />
    </div>
  )
}
