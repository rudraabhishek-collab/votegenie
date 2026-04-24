import { useTranslation } from 'react-i18next'

export default function Footer({ dark }) {
  const { t } = useTranslation()
  const trustItems = [...t('footer.trust', { returnObjects: true }), ...t('footer.trust', { returnObjects: true })]

  return (
    <footer className={`relative overflow-hidden border-t
      ${dark ? 'bg-gray-950 border-violet-900/20 text-slate-400' : 'bg-white border-indigo-100 text-slate-500'}`}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%,rgba(99,102,241,0.06),transparent)' }} />

      {/* Marquee */}
      <div className={`border-b overflow-hidden py-3 ${dark ? 'border-violet-900/20' : 'border-indigo-50'}`}>
        <div className="flex animate-marquee whitespace-nowrap">
          {trustItems.map((item, i) => (
            <span key={i} className={`inline-flex items-center gap-2 mx-8 text-[0.75rem] font-semibold ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
              {item}
              <span className={`w-1 h-1 rounded-full ${dark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12 text-center">
        <div className="text-[1.2rem] font-black tracking-[-0.03em] mb-3 text-gradient inline-block">
          {t('footer.title')}
        </div>
        <p className="text-[0.88rem] max-w-md mx-auto leading-relaxed">{t('footer.description')}</p>
        <p className={`mt-1.5 text-[0.82rem] max-w-lg mx-auto ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
          {t('footer.disclaimer')}
        </p>

        <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-6">
          {['#overview', '#eligibility', '#guide', '#stateinfo', '#faq'].map(href => (
            <a key={href} href={href}
              className={`text-[0.8rem] font-semibold transition-colors hover:text-indigo-500 no-underline capitalize
                ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
              {href.replace('#', '')}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-4">
          <a href="#" className={`text-[0.8rem] transition-colors hover:text-indigo-500 no-underline ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{t('footer.about')}</a>
          <a href="#" className={`text-[0.8rem] transition-colors hover:text-indigo-500 no-underline ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{t('footer.privacy')}</a>
          <a href="https://eci.gov.in/" target="_blank" rel="noopener noreferrer"
            className={`text-[0.8rem] transition-colors hover:text-indigo-500 no-underline whitespace-nowrap flex items-center gap-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('footer.eci')}
          </a>
        </div>

        <p className="mt-6">
          <a href="#overview" className={`text-[0.8rem] font-semibold transition-all hover:text-indigo-500 hover:-translate-y-0.5 inline-block ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
            {t('footer.backToTop')}
          </a>
        </p>
      </div>
    </footer>
  )
}
