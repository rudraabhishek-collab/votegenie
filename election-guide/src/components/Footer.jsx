import { useTranslation } from 'react-i18next'

export default function Footer({ dark }) {
  const { t } = useTranslation()
  const trustItems = [...t('footer.trust', { returnObjects: true }), ...t('footer.trust', { returnObjects: true })]

  return (
    <footer className={`relative overflow-hidden border-t
      ${dark ? 'bg-[#060d1f] border-white/[0.07] text-slate-400' : 'bg-[#0B1E3C] border-white/10 text-white/60'}`}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%,rgba(99,102,241,0.06),transparent)' }} />

      {/* Marquee */}
      <div className={`border-b overflow-hidden py-3 border-white/[0.07]`}>
        <div className="flex animate-marquee whitespace-nowrap">
          {trustItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8 text-[0.75rem] font-semibold text-white/50">
              {item}
              <span className="w-1 h-1 rounded-full bg-white/20" />
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12 text-center">
        <div className="text-[1.2rem] font-black tracking-[-0.03em] mb-3 inline-block" style={{ background: "linear-gradient(135deg,#FF9933,#f97316,#1a237e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {t('footer.title')}
        </div>
        <p className="text-[0.9rem] font-medium text-white/60 max-w-md mx-auto leading-relaxed">{t('footer.description')}</p>
        <p className="mt-1.5 text-[0.82rem] max-w-lg mx-auto text-white/45">
          {t('footer.disclaimer')}
        </p>

        <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-6">
          {['#overview', '#eligibility', '#guide', '#stateinfo', '#faq'].map(href => (
            <a key={href} href={href}
              className="text-[0.8rem] font-semibold transition-colors hover:text-[#FF9933] no-underline capitalize text-white/50">
              {href.replace('#', '')}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-4">
          <a href="#" className="text-[0.8rem] transition-colors hover:text-[#FF9933] no-underline text-white/50">{t('footer.about')}</a>
          <a href="#" className="text-[0.8rem] transition-colors hover:text-[#FF9933] no-underline text-white/50">{t('footer.privacy')}</a>
          <a href="https://eci.gov.in/" target="_blank" rel="noopener noreferrer"
            className="text-[0.8rem] transition-colors hover:text-[#FF9933] no-underline whitespace-nowrap flex items-center gap-1 text-white/50">
            {t('footer.eci')}
          </a>
        </div>

        <p className="mt-6">
          <a href="#overview" className="text-[0.8rem] font-semibold transition-all hover:text-[#FF9933] hover:-translate-y-0.5 inline-block text-white/50">
            {t('footer.backToTop')}
          </a>
        </p>
      </div>
    </footer>
  )
}
