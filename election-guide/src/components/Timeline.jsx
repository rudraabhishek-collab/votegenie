import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { timeline } from '../data'
import SectionHeader from './SectionHeader'

const LS_REMINDERS = 'eg-reminders'

function getCurrentStepIndex(timelineData = []) {
  const today = new Date()
  for (let i = timelineData.length - 1; i >= 0; i--) {
    try {
      const d = new Date(timelineData[i].date)
      if (!isNaN(d) && today >= d) return i
    } catch {}
  }
  return 0
}

const TYPE_FILTERS = [
  { id: 'all',          label: 'All',          labelHi: 'सभी',              icon: '✦' },
  { id: 'registration', label: 'Registration', labelHi: 'पंजीकरण',          icon: '📋' },
  { id: 'state',        label: 'State',        labelHi: 'राज्य चुनाव',      icon: '🗺️' },
  { id: 'central',      label: 'Central',      labelHi: 'केंद्रीय चुनाव',   icon: '🏛️' },
]

const TYPE_COLORS = {
  registration: { dot: 'from-blue-500 to-cyan-500',   badge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50' },
  state:        { dot: 'from-indigo-500 to-violet-600', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50' },
  central:      { dot: 'from-orange-500 to-rose-500',  badge: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800/50' },
}

export default function Timeline({ dark }) {
  const { t, i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'
  const [activeIdx, setActiveIdx] = useState(null)
  const [filter, setFilter] = useState('all')
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_REMINDERS)) || [] } catch { return [] }
  })
  const [reminderFlash, setReminderFlash] = useState(null)

  const filtered = filter === 'all' ? timeline : timeline.filter(e => e.type === filter)
  const currentIdx = getCurrentStepIndex(filtered)

  useEffect(() => {
    localStorage.setItem(LS_REMINDERS, JSON.stringify(reminders))
  }, [reminders])

  // reset active when filter changes
  useEffect(() => { setActiveIdx(null) }, [filter])

  const toggle = (i) => setActiveIdx(prev => prev === i ? null : i)

  const handleRemind = (i, e) => {
    e.stopPropagation()
    const item = filtered[i]
    if (reminders.includes(item.title)) {
      setReminders(r => r.filter(x => x !== item.title))
      setReminderFlash({ msg: t('timeline.reminderRemoved') })
    } else {
      setReminders(r => [...r, item.title])
      setReminderFlash({ msg: t('timeline.reminderSet', { title: item.title }) })
    }
    setTimeout(() => setReminderFlash(null), 2500)
  }

  const isReminded = (i) => reminders.includes(filtered[i]?.title)

  return (
    <section id="timeline" className="scroll-mt-20" aria-labelledby="timeline-h">
      <SectionHeader
        tag={t('timeline.tag')}
        title={t('timeline.title')}
        subtitle={t('timeline.subtitle')}
        dark={dark}
      />

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TYPE_FILTERS.map(f => {
          const count = f.id === 'all' ? timeline.length : timeline.filter(e => e.type === f.id).length
          const isActive = filter === f.id
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.78rem] font-bold border transition-all duration-200 hover:-translate-y-0.5
                ${isActive
                  ? 'bg-gradient-to-r from-[#FF9933] to-[#f97316] border-transparent text-white shadow-[0_4px_12px_rgba(255,153,51,0.4)]'
                  : dark
                    ? 'bg-white/5 border-white/10 text-slate-600 hover:border-indigo-600/50 hover:text-indigo-400'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}>
              <span>{f.icon}</span>
              <span>{isHindi ? f.labelHi : f.label}</span>
              <span className={`text-[0.68rem] px-1.5 py-0.5 rounded-full font-extrabold
                ${isActive ? 'bg-white/20 text-white' : dark ? 'bg-white/10 text-slate-600' : 'bg-slate-100 text-slate-700'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Timeline scroll */}
      <div className="md:overflow-x-auto md:pb-3 md:scrollbar-thin md:-mx-2 md:px-2">
        <div className="flex flex-col md:flex-row md:min-w-max py-4 md:py-8 px-4 relative gap-8 md:gap-0">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[2.6rem] left-20 right-20 h-0.5 opacity-40 rounded-full"
            style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)' }} />
          <div className="block md:hidden absolute top-8 bottom-8 left-[2.4rem] w-0.5 opacity-40 rounded-full"
            style={{ background: 'linear-gradient(180deg,#6366f1,#8b5cf6,#ec4899)' }} />

          {filtered.map((item, i) => {
            const isCurrent = i === currentIdx
            const isActive = activeIdx === i
            const reminded = isReminded(i)
            const typeColor = TYPE_COLORS[item.type] || TYPE_COLORS.state

            return (
              <button key={i} onClick={() => toggle(i)}
                aria-label={`${item.date}: ${item.title}`}
                className={`flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-2.5 md:min-w-[160px] flex-1 relative z-10 px-2 group
                  transition-all duration-300 ease-out text-left md:text-center
                  ${isActive ? 'translate-x-2 md:-translate-y-2 md:translate-x-0' : 'hover:translate-x-1 md:hover:translate-x-0 md:hover:-translate-y-1'}`}>

                {/* Dot */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg
                  transition-all duration-300 border-2 relative flex-shrink-0
                  ${isActive
                    ? `bg-gradient-to-br ${typeColor.dot} border-transparent text-white shadow-[0_0_0_8px_rgba(99,102,241,0.18)] scale-110`
                    : isCurrent
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 border-transparent text-white shadow-[0_0_0_6px_rgba(236,72,153,0.2)] scale-105'
                      : item.highlight
                        ? `bg-gradient-to-br ${typeColor.dot} border-transparent text-white shadow-[0_0_0_5px_rgba(99,102,241,0.12)]`
                        : dark
                          ? 'bg-gray-900 border-slate-700 group-hover:border-indigo-500'
                          : 'bg-white border-slate-200 group-hover:border-indigo-400 shadow-card'
                  }`}>
                  {item.icon}
                  {reminded && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-pink-500 border-2 border-white dark:border-gray-900" />
                  )}
                </div>

                {/* TODAY badge */}
                {isCurrent && (
                  <span className="absolute top-0 md:left-1/2 left-8 md:-translate-x-1/2 -translate-y-3 text-[0.6rem] font-extrabold uppercase tracking-widest bg-pink-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                    {t('timeline.today')}
                  </span>
                )}

                <div className="flex flex-col md:items-center mt-1 md:mt-0 min-w-0">
                  <span className={`text-[0.67rem] font-extrabold uppercase tracking-[0.08em] md:text-center
                    ${isActive ? 'text-indigo-500' : isCurrent ? 'text-pink-500' : item.highlight ? 'text-indigo-500' : dark ? 'text-white' : 'text-slate-700'}`}>
                    {item.date}
                  </span>
                  <span className={`text-[0.8rem] font-bold md:text-center leading-snug md:max-w-[140px]
                    ${dark ? 'text-white' : 'text-gray-700'}`}>
                    {item.title}
                  </span>
                  {/* Type badge */}
                  {item.type && item.type !== 'registration' && (
                    <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[0.62rem] font-extrabold border ${typeColor.badge}`}>
                      {item.type === 'central' ? (isHindi ? 'केंद्रीय' : 'Central') : (item.state || (isHindi ? 'राज्य' : 'State'))}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Reminder flash */}
      {reminderFlash && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-[0.85rem] font-semibold mb-4 shadow-glow animate-[fadeUp_0.3s_ease_both]">
          🔔 {reminderFlash.msg}
        </div>
      )}

      {/* Detail panel */}
      {activeIdx !== null && filtered[activeIdx] && (
        <div className={`relative overflow-hidden rounded-2xl border mt-2 shadow-card-hover
          ${dark ? 'bg-gray-900 border-violet-800/30' : 'bg-white border-indigo-100'}`}
          style={{ animation: 'slideDown 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
          <div className="p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-[0.7rem] font-extrabold text-indigo-500 uppercase tracking-[0.1em]">
                    {filtered[activeIdx].date}
                  </p>
                  {filtered[activeIdx].type && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-extrabold border ${TYPE_COLORS[filtered[activeIdx].type]?.badge || ''}`}>
                      {filtered[activeIdx].type === 'central'
                        ? (isHindi ? '🏛️ केंद्रीय चुनाव' : '🏛️ Central Election')
                        : filtered[activeIdx].type === 'state'
                          ? `🗺️ ${filtered[activeIdx].state || (isHindi ? 'राज्य' : 'State')}`
                          : (isHindi ? '📋 पंजीकरण' : '📋 Registration')}
                    </span>
                  )}
                </div>
                <h3 className={`text-xl font-black tracking-[-0.03em] mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {filtered[activeIdx].title}
                </h3>
                <p className={`text-[0.92rem] leading-relaxed mb-4 ${dark ? 'text-white' : 'text-slate-700'}`}>
                  {filtered[activeIdx].desc}
                </p>
              </div>
              <button
                onClick={(e) => handleRemind(activeIdx, e)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[0.82rem] font-bold border transition-all duration-200 hover:-translate-y-0.5
                  ${isReminded(activeIdx)
                    ? 'bg-pink-500 border-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)]'
                    : dark
                      ? 'border-white/10 text-slate-600 hover:border-pink-500 hover:text-pink-400'
                      : 'border-slate-200 text-slate-600 hover:border-pink-400 hover:text-pink-600'
                  }`}>
                {isReminded(activeIdx) ? t('timeline.reminded') : t('timeline.remindMe')}
              </button>
            </div>

            {/* Tip */}
            <div className={`rounded-xl px-4 py-3 text-[0.87rem] font-medium border mb-5
              ${dark ? 'bg-indigo-950/60 border-indigo-800/40 text-indigo-300' : 'bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100 text-indigo-700'}`}>
              💡 {filtered[activeIdx].tip}
            </div>

            {/* Actions */}
            {filtered[activeIdx].actions?.length > 0 && (
              <div>
                <p className={`text-[0.72rem] font-extrabold uppercase tracking-widest mb-3 ${dark ? 'text-white' : 'text-slate-700'}`}>
                  {t('timeline.whatToDo')}
                </p>
                <ul className="space-y-2">
                  {filtered[activeIdx].actions.map((action, j) => (
                    <li key={j} className={`flex items-start gap-2.5 text-[0.88rem] ${dark ? 'text-white' : 'text-slate-700'}`}>
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-[0.65rem] font-black flex-shrink-0 mt-0.5">
                        {j + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Callout */}
      <div className={`flex gap-3 items-start mt-5 rounded-xl border-l-[3px] border-indigo-500 px-5 py-4 text-[0.9rem] leading-relaxed
        ${dark ? 'bg-indigo-950/40 border border-indigo-800/30 text-indigo-300' : 'bg-gradient-to-r from-indigo-50 to-violet-50/50 border border-indigo-100 text-indigo-700'}`}>
        <span className="text-lg mt-0.5">💡</span>
        <span>{t('timeline.callout')}</span>
      </div>
    </section>
  )
}
