import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'

export default function LanguageSwitcher({ dark }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  useEffect(() => {
    const h = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Select language"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[0.78rem] font-bold transition-all duration-200
          ${dark
            ? 'bg-white/[0.06] border-white/[0.1] text-slate-300 hover:bg-white/[0.12]'
            : 'bg-slate-100 border-slate-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200'
          }`}>
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <span className={`text-[0.6rem] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className={`absolute top-[calc(100%+6px)] right-0 w-36 rounded-xl border overflow-hidden z-50 shadow-lg
          ${dark ? 'bg-gray-900 border-white/10' : 'bg-white border-slate-200'}`}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[0.82rem] font-semibold text-left transition-colors
                ${i18n.language === lang.code
                  ? dark ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                  : dark ? 'text-slate-300 hover:bg-white/[0.06]' : 'text-gray-700 hover:bg-slate-50'
                }`}>
              <span>{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
              {i18n.language === lang.code && <span className="ml-auto text-indigo-500 text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
