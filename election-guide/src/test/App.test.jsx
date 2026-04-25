import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ── Minimal mocks so the component tree renders without real deps ──────────

// Mock i18next — return the key as the translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, opts) => {
      // Return arrays for keys that expect returnObjects
      if (key === 'journey.steps')    return ['Check\nEligibility','Gather\nDocuments','Register\non NVSP','Find Your\nBooth','Cast\nYour Vote']
      if (key === 'overview.items')   return []
      if (key === 'guide.steps')      return []
      if (key === 'faq.items')        return []
      if (key === 'documents.items')  return []
      if (key === 'footer.trust')     return []
      if (key === 'chat.suggestions') return []
      return opts?.defaultValue ?? key
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}))

// Mock Firebase so no real network calls happen
vi.mock('../services/firebase', () => ({
  logEligibilityCheck: vi.fn().mockResolvedValue(undefined),
  logChatMessage:      vi.fn().mockResolvedValue(undefined),
}))

// Mock heavy SVG/map data
vi.mock('../data/indiaPaths', () => ({
  INDIA_SVG_PATHS: {},
  INDIA_CENTROIDS: {},
  MAP_W: 600,
  MAP_H: 700,
}))

import App from '../App'

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('App — smoke render', () => {
  beforeEach(() => {
    // Suppress console errors from missing SVG APIs in jsdom
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('renders the Navbar', () => {
    render(<App />)
    // Logo text is always present
    expect(screen.getByLabelText(/votegenie home/i)).toBeTruthy()
  })

  it('renders the Hero section', () => {
    render(<App />)
    const hero = document.querySelector('section[aria-labelledby="hero-heading"]')
    expect(hero).toBeTruthy()
  })

  it('renders the main content area', () => {
    render(<App />)
    const main = document.getElementById('main-content')
    expect(main).toBeTruthy()
  })

  it('renders the FAB chat button', () => {
    render(<App />)
    const fab = screen.getByLabelText(/open voter assistant/i)
    expect(fab).toBeTruthy()
  })
})

describe('App — dark mode toggle', () => {
  it('toggles dark class on html element', async () => {
    const user = userEvent.setup()
    render(<App />)
    const toggle = screen.getByLabelText(/toggle dark mode/i)
    const html = document.documentElement
    const wasDark = html.classList.contains('dark')
    await user.click(toggle)
    expect(html.classList.contains('dark')).toBe(!wasDark)
  })
})
