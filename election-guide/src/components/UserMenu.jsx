import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function UserMenu({ user, onLogout, dark }) {
  const { i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() || '?'

  const genderIcon = user.gender === 'female' ? '👩' : user.gender === 'male' ? '👨' : '🧑'

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200">
        <div className="w-7 h-7 rounded-full bg-[#FF9933] flex items-center justify-center text-[0.72rem] font-black text-[#1a237e]">
          {initials}
        </div>
        <span className="hidden sm:block text-[0.8rem] font-semibold text-white max-w-[100px] truncate">
          {user.name || user.email?.split('@')[0]}
        </span>
        <span className={`text-[0.6rem] transition-transform duration-200 text-white/60 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className={`absolute top-[calc(100%+8px)] right-0 w-56 rounded-2xl border overflow-hidden z-50 shadow-modal
          ${dark ? 'bg-[#0d1757] border-[#283593]/50' : 'bg-white border-[#1a237e]/15'}`}
          style={{ animation: 'slideDown 0.2s ease both' }}>
          
          {/* User info */}
          <div className={`px-4 py-3.5 border-b ${dark ? 'border-white/[0.07]' : 'border-[#1a237e]/10'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a237e] to-[#FF9933] flex items-center justify-center text-lg">
                {genderIcon}
              </div>
              <div className="min-w-0">
                <p className={`font-extrabold text-[0.88rem] truncate ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
                  {user.name || (isHindi ? 'मतदाता' : 'Voter')}
                </p>
                <p className={`text-[0.72rem] truncate ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{user.email}</p>
                {user.mobile && (
                  <p className={`text-[0.72rem] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>📱 {user.mobile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2">
            {[
              { icon: '👤', label: isHindi ? 'प्रोफ़ाइल' : 'Profile', action: null },
              { icon: '🗳️', label: isHindi ? 'मेरी यात्रा' : 'My Journey', action: null },
              { icon: '🔔', label: isHindi ? 'रिमाइंडर' : 'Reminders', action: null },
            ].map(item => (
              <button key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.85rem] font-semibold text-left transition-colors
                  ${dark ? 'text-slate-300 hover:bg-white/[0.06]' : 'text-gray-700 hover:bg-[#e8eaf6]'}`}>
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
            <div className={`my-1 border-t ${dark ? 'border-white/[0.07]' : 'border-slate-100'}`} />
            <button onClick={() => { onLogout(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.85rem] font-semibold text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <span>🚪</span>{isHindi ? 'लॉगआउट' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
