import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LS_USER = 'eg-user'

// ─── Form validation ───────────────────────────────────────────────────────
function validateForm(data, isLogin) {
  const errors = {}
  if (!data.email?.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format'
  
  if (!data.password?.trim()) errors.password = 'Password is required'
  else if (!isLogin && data.password.length < 6) errors.password = 'Password must be at least 6 characters'
  
  if (!isLogin) {
    if (!data.name?.trim()) errors.name = 'Name is required'
    if (!data.mobile?.trim()) errors.mobile = 'Mobile number is required'
    else if (!/^[6-9]\d{9}$/.test(data.mobile)) errors.mobile = 'Invalid Indian mobile number'
    if (!data.gender) errors.gender = 'Please select gender'
  }
  return errors
}

// ─── Auth Modal ────────────────────────────────────────────────────────────
export default function AuthModal({ open, onClose, onLogin, dark }) {
  const { t, i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', name: '', mobile: '', gender: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (open) { setForm({ email: '', password: '', name: '', mobile: '', gender: '' }); setErrors({}); setSuccess(false) }
  }, [open])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validateForm(form, mode === 'login')
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    
    setLoading(true)
    setTimeout(() => {
      if (mode === 'login') {
        const stored = JSON.parse(localStorage.getItem(LS_USER) || '{}')
        if (stored.email === form.email && stored.password === form.password) {
          onLogin(stored)
          setSuccess(true)
          setTimeout(() => onClose(), 1200)
        } else {
          setErrors({ password: isHindi ? 'गलत ईमेल या पासवर्ड' : 'Incorrect email or password' })
        }
      } else {
        localStorage.setItem(LS_USER, JSON.stringify(form))
        onLogin(form)
        setSuccess(true)
        setTimeout(() => onClose(), 1200)
      }
      setLoading(false)
    }, 800)
  }

  const inputCls = (err) => `w-full rounded-xl px-4 py-2.5 text-[0.9rem] border transition-all focus:outline-none focus:ring-2 focus:ring-[#1a237e]/30
    ${err ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : dark ? 'bg-white/[0.07] border-white/10 text-white focus:border-[#FF9933]' : 'bg-slate-50 border-[#1a237e]/20 text-gray-900 focus:border-[#1a237e] focus:bg-white'}`

  const labelCls = `block text-[0.72rem] font-extrabold uppercase tracking-[0.08em] mb-1.5 ${dark ? 'text-white' : 'text-[#1a237e]/70'}`

  if (!open) return null

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300" />
      
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4`}>
        <div className={`w-full max-w-md rounded-3xl border overflow-hidden shadow-modal transition-all duration-300
          ${dark ? 'bg-[#0a0e1f] border-[#283593]/40' : 'bg-white border-[#1a237e]/15'}`}
          style={{ animation: 'scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          
          {/* Top tricolor stripe */}
          <div className="flex h-[4px]">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#138808]" />
          </div>

          {/* Header */}
          <div className={`px-6 py-5 border-b ${dark ? 'border-white/[0.07]' : 'border-[#1a237e]/10'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a237e] to-[#283593] flex items-center justify-center text-xl shadow-glow">
                  {mode === 'login' ? '🔐' : '📝'}
                </div>
                <div>
                  <h2 className={`font-black text-[1.05rem] tracking-tight ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
                    {mode === 'login' ? (isHindi ? 'लॉगिन करें' : 'Login') : (isHindi ? 'साइन अप करें' : 'Sign Up')}
                  </h2>
                  <p className={`text-[0.72rem] ${dark ? 'text-white' : 'text-slate-700'}`}>
                    {mode === 'login' ? (isHindi ? 'अपने खाते में प्रवेश करें' : 'Access your account') : (isHindi ? 'नया खाता बनाएं' : 'Create a new account')}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all hover:rotate-90
                ${dark ? 'border-white/10 text-slate-600 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>✕</button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className={labelCls}>{isHindi ? 'पूरा नाम' : 'Full Name'}</label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder={isHindi ? 'अपना नाम दर्ज करें' : 'Enter your full name'} className={inputCls(errors.name)} />
                  {errors.name && <p className="text-red-500 text-[0.75rem] font-semibold mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>{isHindi ? 'मोबाइल नंबर' : 'Mobile Number'}</label>
                    <input type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)}
                      placeholder={isHindi ? '10 अंक' : '10 digits'} maxLength="10" className={inputCls(errors.mobile)} />
                    {errors.mobile && <p className="text-red-500 text-[0.75rem] font-semibold mt-1">{errors.mobile}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>{isHindi ? 'लिंग' : 'Gender'}</label>
                    <div className="relative">
                      <select value={form.gender} onChange={e => set('gender', e.target.value)} className={inputCls(errors.gender) + ' pr-8'}>
                        <option value="">{isHindi ? '— चुनें —' : '— Select —'}</option>
                        <option value="male">{isHindi ? 'पुरुष' : 'Male'}</option>
                        <option value="female">{isHindi ? 'महिला' : 'Female'}</option>
                        <option value="other">{isHindi ? 'अन्य' : 'Other'}</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-xs">▾</span>
                    </div>
                    {errors.gender && <p className="text-red-500 text-[0.75rem] font-semibold mt-1">{errors.gender}</p>}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={labelCls}>{isHindi ? 'ईमेल' : 'Email'}</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder={isHindi ? 'आपका ईमेल' : 'your@email.com'} className={inputCls(errors.email)} />
              {errors.email && <p className="text-red-500 text-[0.75rem] font-semibold mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className={labelCls}>{isHindi ? 'पासवर्ड' : 'Password'}</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                placeholder={isHindi ? '6+ अक्षर' : '6+ characters'} className={inputCls(errors.password)} />
              {errors.password && <p className="text-red-500 text-[0.75rem] font-semibold mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || success}
              className="w-full py-3.5 rounded-xl font-bold text-white text-[0.95rem] bg-gradient-to-r from-[#1a237e] to-[#283593]
                shadow-[0_4px_16px_rgba(26,35,126,0.4),0_0_0_3px_rgba(255,153,51,0.3)]
                hover:shadow-[0_6px_24px_rgba(26,35,126,0.5),0_0_0_3px_rgba(255,153,51,0.5)]
                hover:-translate-y-0.5 disabled:opacity-100 disabled:cursor-not-allowed transition-all duration-200">
              {loading ? (isHindi ? 'लोड हो रहा है...' : 'Loading...') : success ? '✓ ' + (isHindi ? 'सफल!' : 'Success!') : mode === 'login' ? (isHindi ? 'लॉगिन करें' : 'Login') : (isHindi ? 'साइन अप करें' : 'Sign Up')}
            </button>

            {/* Toggle mode */}
            <p className={`text-center text-[0.85rem] ${dark ? 'text-white' : 'text-slate-700'}`}>
              {mode === 'login'
                ? (isHindi ? 'खाता नहीं है? ' : "Don't have an account? ")
                : (isHindi ? 'पहले से खाता है? ' : 'Already have an account? ')}
              <button type="button" onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setErrors({}) }}
                className="font-bold text-[#FF9933] hover:text-[#e65c00] transition-colors">
                {mode === 'login' ? (isHindi ? 'साइन अप करें' : 'Sign Up') : (isHindi ? 'लॉगिन करें' : 'Login')}
              </button>
            </p>

            {/* Disclaimer */}
            {mode === 'signup' && (
              <p className={`text-[0.75rem] leading-relaxed ${dark ? 'text-white' : 'text-slate-700'}`}>
                {isHindi
                  ? 'साइन अप करके, आप हमारी गोपनीयता नीति और सेवा की शर्तों से सहमत हैं।'
                  : 'By signing up, you agree to our Privacy Policy and Terms of Service.'}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
