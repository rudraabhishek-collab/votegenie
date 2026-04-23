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
import AssistantModal from './components/AssistantModal'
import ChatAssistant from './components/ChatAssistant'
import Footer from './components/Footer'

const LS_STEP  = 'eg-journey-step'
const LS_GUIDE = 'eg-guide-completed'
const LS_THEME = 'eg-theme'

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

  const bg = dark
    ? 'bg-[#0a0d1f] bg-mesh-dark'
    : 'bg-[#fafbff] bg-mesh-light'

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300 dark:text-slate-100`}>
      <Navbar
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
        onOpenAssistant={() => setAssistantOpen(true)}
      />

      <Hero onOpenAssistant={() => setAssistantOpen(true)} />

      {/* Decorative Wave Transition */}
      <div className="w-full relative z-10 leading-none -mt-1 overflow-hidden pointer-events-none">
        <svg className="block w-full h-[35px] sm:h-[50px] md:h-[70px]" preserveAspectRatio="none" viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C240 70 480 70 720 35C960 0 1200 0 1440 35V70H0V0Z" fill={dark ? "#0a0d1f" : "#fafbff"} />
        </svg>
      </div>

      <JourneyTracker
        currentStep={currentStep}
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
        <FAQ dark={dark} onOpenAssistant={() => setChatOpen(true)} />
      </main>

      <Footer dark={dark} />

      {/* FAB */}
      <button
        onClick={() => setChatOpen(o => !o)}
        aria-label={chatOpen ? 'Close assistant' : 'Open voter assistant'}
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-[0.88rem] text-white
          bg-gradient-to-r from-indigo-500 to-violet-600
          shadow-[0_8px_32px_rgba(99,102,241,0.45),0_2px_0_rgba(255,255,255,0.15)_inset]
          hover:-translate-y-1.5 hover:scale-105 hover:shadow-glow-xl
          active:scale-95 transition-all duration-300
          ${chatOpen ? 'animate-glow-pulse' : 'hover:shadow-glow-xl'}`}>
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
    </div>
  )
}
