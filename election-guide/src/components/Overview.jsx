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
          ? 'bg-gray-900/80 border-violet-900/20 hover:border-violet-700/40 hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)]'
          : 'bg-white border-indigo-100/60 hover:border-indigo-200 hover:shadow-card-hover'
        } shadow-card`}
      style={{ transitionDelay: `${index * 60}ms` }}>

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500
        scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-xl mb-4 border
        ${dark ? 'bg-indigo-950/60 border-indigo-800/40' : 'bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100'}`}>
        {item.icon}
      </div>

      <h3 className={`font-extrabold text-[1rem] mb-1.5 tracking-[-0.025em]
        ${dark ? 'text-white' : 'text-gray-900'}`}>
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
