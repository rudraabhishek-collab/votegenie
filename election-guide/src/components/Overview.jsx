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
          ? 'bg-[#0B1E3C]/80 border-white/10 hover:border-[#FF6A00]/40 hover:shadow-[0_8px_32px_rgba(255,106,0,0.2)]'
          : 'bg-[#0B1E3C] border-white/10 hover:border-[#FF6A00]/60 hover:shadow-[0_8px_40px_rgba(255,106,0,0.25)]'
        } shadow-[0_4px_24px_rgba(11,30,60,0.18)]`}
      style={{ transitionDelay: `${index * 60}ms` }}>

      {/* Ashoka Chakra watermark */}
      <div aria-hidden className="absolute -bottom-4 -right-4 pointer-events-none opacity-[0.06]">
        <svg viewBox="0 0 200 200" className="w-24 h-24">
          <circle cx="100" cy="100" r="85" fill="none" stroke="#60a5fa" strokeWidth="3"/>
          <circle cx="100" cy="100" r="10" fill="#60a5fa"/>
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * 15 - 90) * Math.PI / 180
            return <line key={i} x1={100 + 18*Math.cos(a)} y1={100 + 18*Math.sin(a)} x2={100 + 83*Math.cos(a)} y2={100 + 83*Math.sin(a)} stroke="#60a5fa" strokeWidth="2"/>
          })}
        </svg>
      </div>

      {/* Top accent bar — tricolor */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF6A00] via-white/40 to-[#3b82f6]
        scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-xl mb-4 border bg-[#FF6A00]/20 border-[#FF6A00]/30">
        {item.icon}
      </div>

      <h3 className="font-extrabold text-[1rem] mb-1.5 tracking-[-0.025em] text-white">
        {item.title}
      </h3>
      <p className="text-[0.875rem] leading-relaxed text-white/75">
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
