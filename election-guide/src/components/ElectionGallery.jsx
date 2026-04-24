import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Real election-related images from Unsplash (free to use)
const IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&q=80',
    caption: 'Voters at polling booth',
    captionHi: 'मतदान केंद्र पर मतदाता',
    tag: 'Polling Day',
    tagHi: 'मतदान दिवस',
    color: 'from-[#1a237e] to-[#283593]',
  },
  {
    url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80',
    caption: 'Democracy in action',
    captionHi: 'लोकतंत्र की शक्ति',
    tag: 'Democracy',
    tagHi: 'लोकतंत्र',
    color: 'from-[#FF9933] to-[#e65c00]',
  },
  {
    url: 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=600&q=80',
    caption: 'Voter registration drive',
    captionHi: 'मतदाता पंजीकरण अभियान',
    tag: 'Registration',
    tagHi: 'पंजीकरण',
    color: 'from-[#138808] to-[#1b5e20]',
  },
  {
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
    caption: 'EVM — Electronic Voting Machine',
    captionHi: 'EVM — इलेक्ट्रॉनिक वोटिंग मशीन',
    tag: 'EVM',
    tagHi: 'EVM',
    color: 'from-[#1a237e] to-[#3949ab]',
  },
  {
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80',
    caption: 'Citizens exercising their right',
    captionHi: 'नागरिक अपने अधिकार का प्रयोग',
    tag: 'Civic Duty',
    tagHi: 'नागरिक कर्तव्य',
    color: 'from-[#FF9933] to-[#1a237e]',
  },
  {
    url: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=600&q=80',
    caption: 'India — the world\'s largest democracy',
    captionHi: 'भारत — विश्व का सबसे बड़ा लोकतंत्र',
    tag: 'India',
    tagHi: 'भारत',
    color: 'from-[#138808] to-[#1a237e]',
  },
]

export default function ElectionGallery({ dark }) {
  const { i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'
  const [active, setActive] = useState(null)

  return (
    <section className="scroll-mt-20 py-2" aria-label="Election photo gallery">
      {/* Section header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]
            px-3 py-1.5 rounded-full mb-3 border ${dark ? 'bg-[#1a237e]/80 text-[#FF9933] border-[#283593]' : 'bg-[#1a237e] text-white border-[#283593]'}`}>
            {isHindi ? '📸 चुनाव गैलरी' : '📸 Election Gallery'}
          </span>
          <h2 className={`text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
            {isHindi ? 'भारतीय लोकतंत्र की झलकियाँ' : 'Glimpses of Indian Democracy'}
          </h2>
          <p className={`mt-1.5 text-[0.9rem] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isHindi ? 'मतदान प्रक्रिया की वास्तविक तस्वीरें' : 'Real moments from India\'s election process'}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {IMAGES.map((img, i) => (
          <button key={i} onClick={() => setActive(active === i ? null : i)}
            className={`relative overflow-hidden rounded-2xl group transition-all duration-300
              ${active === i ? 'ring-4 ring-[#FF9933] scale-[1.02]' : 'hover:scale-[1.02]'}
              ${i === 0 ? 'col-span-2 row-span-1' : ''}`}
            style={{ aspectRatio: i === 0 ? '16/7' : '4/3' }}>
            
            {/* Image */}
            <img src={img.url} alt={isHindi ? img.captionHi : img.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy" />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${img.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
            
            {/* Tag */}
            <div className="absolute top-2.5 left-2.5">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-extrabold text-white
                bg-gradient-to-r ${img.color} shadow-lg`}>
                {isHindi ? img.tagHi : img.tag}
              </span>
            </div>

            {/* Caption on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-[0.78rem] font-semibold leading-snug drop-shadow-lg">
                {isHindi ? img.captionHi : img.caption}
              </p>
            </div>

            {/* India flag corner accent */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[28px] border-l-transparent border-t-[28px] border-t-[#FF9933] opacity-80" />
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className={`mt-5 rounded-2xl border p-4 flex flex-wrap gap-4 justify-around
        ${dark ? 'bg-[#1a237e]/20 border-[#283593]/40' : 'bg-[#e8eaf6] border-[#1a237e]/15'}`}>
        {[
          { num: '96.8 Cr', label: isHindi ? 'पंजीकृत मतदाता' : 'Registered Voters', icon: '🗳️' },
          { num: '10.5 Lakh', label: isHindi ? 'मतदान केंद्र' : 'Polling Stations', icon: '🏛️' },
          { num: '543', label: isHindi ? 'लोकसभा सीटें' : 'Lok Sabha Seats', icon: '🏛️' },
          { num: '1951', label: isHindi ? 'पहला चुनाव' : 'First Election', icon: '📅' },
        ].map(s => (
          <div key={s.label} className="text-center flex-1 min-w-[80px]">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className={`text-[1.1rem] font-black tracking-tight ${dark ? 'text-[#FF9933]' : 'text-[#1a237e]'}`}>{s.num}</div>
            <div className={`text-[0.68rem] font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
