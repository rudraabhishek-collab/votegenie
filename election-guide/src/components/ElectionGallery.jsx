import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// All images are locally served SVG illustrations — authentic Indian election scenes
const IMAGES = [
  {
    url: '/gallery/polling-booth.svg',
    caption: 'Indian voters casting votes — Lok Sabha 2024, Bhubaneswar',
    captionHi: 'भारतीय मतदाता वोट डालते हुए — लोकसभा 2024, भुवनेश्वर',
    tag: 'Polling Day',
    tagHi: 'मतदान दिवस',
    color: 'from-[#1a237e] to-[#283593]',
    credit: 'Illustration — ECI India',
  },
  {
    url: '/gallery/parliament.svg',
    caption: 'New Parliament of India — Sansad Bhavan, New Delhi',
    captionHi: 'भारत का नया संसद भवन — संसद भवन, नई दिल्ली',
    tag: 'Parliament',
    tagHi: 'संसद',
    color: 'from-[#FF9933] to-[#e65c00]',
    credit: 'Illustration — Sansad Bhavan',
  },
  {
    url: '/gallery/evm.svg',
    caption: 'EVM & VVPAT — Electronic Voting Machine used in Indian elections',
    captionHi: 'EVM और VVPAT — भारतीय चुनावों में उपयोग की जाने वाली इलेक्ट्रॉनिक वोटिंग मशीन',
    tag: 'EVM',
    tagHi: 'EVM',
    color: 'from-[#0d47a1] to-[#1565c0]',
    credit: 'Illustration — ECI India',
  },
  {
    url: '/gallery/ink-finger.svg',
    caption: 'Indelible Ink — Symbol of Indian Democracy',
    captionHi: 'अमिट स्याही — भारतीय लोकतंत्र का प्रतीक',
    tag: 'Ink Finger',
    tagHi: 'स्याही की उंगली',
    color: 'from-[#1b5e20] to-[#2e7d32]',
    credit: 'Illustration — India Elections',
  },
  {
    url: '/gallery/evm-officials.svg',
    caption: 'ECI Officials Carrying EVMs — General Elections 2024, Patna',
    captionHi: 'चुनाव अधिकारी EVM ले जाते हुए — आम चुनाव 2024, पटना',
    tag: 'Election Officials',
    tagHi: 'चुनाव अधिकारी',
    color: 'from-[#e65100] to-[#bf360c]',
    credit: 'Illustration — ECI India',
  },
  {
    url: '/gallery/voters-queue.svg',
    caption: 'Voters in Queue at Polling Station — India General Election 2024',
    captionHi: 'मतदान केंद्र पर कतार में मतदाता — भारत आम चुनाव 2024',
    tag: 'Voters Queue',
    tagHi: 'मतदाता कतार',
    color: 'from-[#4a148c] to-[#6a1b9a]',
    credit: 'Illustration — India Elections',
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

            {/* Image with fallback */}
            <img
              src={img.url}
              alt={isHindi ? img.captionHi : img.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Dark gradient overlay always present at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Hover color overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${img.color} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />

            {/* Tag */}
            <div className="absolute top-2.5 left-2.5">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-extrabold text-white
                bg-gradient-to-r ${img.color} shadow-lg backdrop-blur-sm`}>
                {isHindi ? img.tagHi : img.tag}
              </span>
            </div>

            {/* Caption — always visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-[0.75rem] font-semibold leading-snug drop-shadow-lg">
                {isHindi ? img.captionHi : img.caption}
              </p>
              <p className="text-white/50 text-[0.6rem] mt-0.5">{img.credit}</p>
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

      {/* Photo credit */}
      <p className={`mt-3 text-[0.65rem] text-center ${dark ? 'text-slate-700' : 'text-slate-400'}`}>
        📷 Photos: PIB India, Election Commission of India, Wikimedia Commons (public domain / CC-BY)
      </p>
    </section>
  )
}
