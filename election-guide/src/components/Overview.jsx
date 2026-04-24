import { overview } from '../data'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'

/* ── Simple card — no tilt/mousemove (removes layout thrash) ─────────────── */
function OverviewCard({ item, dark, index }) {
  return (
    <article
      className={`sr relative overflow-hidden rounded-2xl p-6 border cursor-default group
        transition-all duration-300 hover:-translate-y-1
        ${dark
          ? 'bg-gray-900 border-[#FF9933]/20 hover:border-[#FF9933]/40 hover:shadow-[0_8px_32px_rgba(255,153,51,0.15)]'
          : 'bg-white border-[#FF9933]/20 hover:border-[#FF9933]/40 hover:shadow-[0_8px_32px_rgba(255,153,51,0.18)]'
        } shadow-card`}
      style={{ transitionDelay: `${index * 60}ms` }}>

      {/* Top accent bar — tricolor */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9933] via-white to-[#1a237e]
        scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-xl mb-4 border
        ${dark ? 'bg-[#FF9933]/20 border-[#FF9933]/30' : 'bg-gradient-to-br from-[#fff3e0] to-[#fff8f0] border-[#FF9933]/30'}`}>
        {item.icon}
      </div>

      <h3 className={`font-extrabold text-[1rem] mb-1.5 tracking-[-0.025em]
        ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
        {item.title}
      </h3>
      <p className={`text-[0.875rem] leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
        {item.body}
      </p>
    </article>
  )
}

export default function Overview({ dark }) {
  const { t } = useTranslation()
  const items = t('overview.items', { returnObjects: true })
  const ref = useScrollReveal(70)
  return (
    <section id="overview" className="scroll-mt-20" aria-labelledby="overview-h" ref={ref}>
      <SectionHeader tag={t('overview.tag')} title={t('overview.title')}
        subtitle={t('overview.subtitle')} dark={dark} />
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <OverviewCard key={i} item={item} dark={dark} index={i} />
        ))}
      </div>
    </section>
  )
}
