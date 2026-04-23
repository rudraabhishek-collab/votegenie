import { useState, useEffect } from 'react'
import { timeline } from '../data'
import SectionHeader from './SectionHeader'

const LS_REMINDERS = 'eg-reminders'

// ─── Determine which step is "current" based on today's date ──────────────
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

// ─── What-to-do action items per timeline step ────────────────────────────
const actions = [
  ['Visit your election authority website', 'Search your name on the voter roll', 'Create an account if you\'re new'],
  ['Complete the registration form online', 'Double-check your address is current', 'Submit before midnight tonight'],
  ['Watch your mailbox for your voter card', 'Contact authorities if it doesn\'t arrive', 'Keep it safe — you\'ll need it on voting day'],
  ['Find your nearest early voting location', 'Bring your ID and voter card', 'No queues — go mid-morning'],
  ['Arrive at your polling station by 7 PM', 'Bring ID, voter card, and proof of address', 'Mark your ballot clearly and submit'],
  ['Check official results on the election authority website', 'Results are verified before being declared final'],
]

export default function Timeline({ dark, onStateSelect }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_REMINDERS)) || [] } catch { return [] }
  })
  const [reminderFlash, setReminderFlash] = useState(null)
  const timelineData = timeline
  const currentIdx = getCurrentStepIndex(timelineData)

  // Persist reminders
  useEffect(() => {
    localStorage.setItem(LS_REMINDERS, JSON.stringify(reminders))
  }, [reminders])

  const toggle = (i) => setActiveIdx(prev => prev === i ? null : i)

  // ─── Remind Me handler ─────────────────────────────────────────────────
  const handleRemind = (i, e) => {
    e.stopPropagation()
    const item = timelineData[i]
    if (reminders.includes(i)) {
      setReminders(r => r.filter(x => x !== i))
      setReminderFlash({ idx: i, msg: 'Reminder removed.' })
    } else {
      setReminders(r => [...r, i])
      setReminderFlash({ idx: i, msg: `Reminder set for "${item.title}"!` })
    }
    setTimeout(() => setReminderFlash(null), 2500)
  }

  const isReminded = (i) => reminders.includes(i)

  return (
    <section id="timeline" className="scroll-mt-20" aria-labelledby="timeline-h">
      <SectionHeader tag="Key Dates" title="Important deadlines to know"
        subtitle="Click any stage to expand details. The highlighted step is where you are today." dark={dark} />

      {/* Timeline Layout */}
      <div className="mt-6 md:mt-0 md:overflow-x-auto md:pb-3 md:scrollbar-thin md:-mx-2 md:px-2">
        <div className="flex flex-col md:flex-row md:min-w-max py-4 md:py-8 px-4 relative gap-8 md:gap-0">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[2.6rem] left-20 right-20 h-0.5 opacity-40 rounded-full"
            style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)' }} />
          <div className="block md:hidden absolute top-8 bottom-8 left-[2.4rem] w-0.5 opacity-40 rounded-full"
            style={{ background: 'linear-gradient(180deg,#6366f1,#8b5cf6,#ec4899)' }} />

          {timelineData.map((item, i) => {
            const isCurrent = i === currentIdx
            const isActive = activeIdx === i
            const reminded = isReminded(i)

            return (
              <button key={i} onClick={() => toggle(i)}
                aria-label={`${item.date}: ${item.title}`}
                className={`flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-2.5 md:min-w-[150px] flex-1 relative z-10 px-2 group
                  transition-all duration-300 ease-out text-left md:text-center
                  ${isActive ? 'translate-x-2 md:-translate-y-2 md:translate-x-0' : 'hover:translate-x-1 md:hover:translate-x-0 md:hover:-translate-y-1'}`}>

                {/* Dot */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg
                  transition-all duration-300 border-2 relative
                  ${isActive
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent text-white shadow-[0_0_0_8px_rgba(99,102,241,0.18)] scale-110'
                    : isCurrent
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 border-transparent text-white shadow-[0_0_0_6px_rgba(236,72,153,0.2)] scale-105'
                      : item.highlight
                        ? 'bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent text-white shadow-[0_0_0_5px_rgba(99,102,241,0.12)]'
                        : dark
                          ? 'bg-gray-900 border-slate-700 group-hover:border-indigo-500 group-hover:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
                          : 'bg-white border-slate-200 group-hover:border-indigo-400 group-hover:shadow-[0_0_0_4px_rgba(99,102,241,0.08)] shadow-card'
                  }`}>
                  {item.icon}
                  {/* Reminder indicator */}
                  {reminded && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-pink-500 border-2 border-white dark:border-gray-900" />
                  )}
                </div>

                {/* "TODAY" badge */}
                {isCurrent && (
                  <span className="absolute top-0 md:left-1/2 left-8 md:-translate-x-1/2 -translate-y-3 md:-translate-y-3 text-[0.6rem] font-extrabold uppercase tracking-widest bg-pink-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                    Today
                  </span>
                )}

                <div className="flex flex-col md:items-center mt-1 md:mt-0">
                  <span className={`text-[0.67rem] font-extrabold uppercase tracking-[0.08em] md:text-center
                    ${isActive ? 'text-indigo-500' : isCurrent ? 'text-pink-500' : item.highlight ? 'text-indigo-500' : dark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.date}
                  </span>
                  <span className={`text-[0.8rem] font-bold md:text-center leading-snug md:max-w-[130px]
                    ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                    {item.title}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Reminder flash toast */}
      {reminderFlash && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-[0.85rem] font-semibold mb-4 shadow-glow animate-[fadeUp_0.3s_ease_both]">
          🔔 {reminderFlash.msg}
        </div>
      )}

      {/* Detail panel */}
      {activeIdx !== null && (
        <div className={`relative overflow-hidden rounded-2xl border mt-2 shadow-card-hover
          transition-all duration-300
          ${dark ? 'bg-gray-900 border-violet-800/30' : 'bg-white border-indigo-100'}`}
          style={{ animation: 'slideDown 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

          <div className="p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-[0.7rem] font-extrabold text-indigo-500 uppercase tracking-[0.1em] mb-1">{timelineData[activeIdx].date}</p>
                <h3 className={`text-xl font-black tracking-[-0.03em] mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {timelineData[activeIdx].title}
                </h3>
                <p className={`text-[0.92rem] leading-relaxed mb-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {timelineData[activeIdx].desc}
                </p>
              </div>

              {/* Remind Me button */}
              <button
                onClick={(e) => handleRemind(activeIdx, e)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[0.82rem] font-bold border transition-all duration-200 hover:-translate-y-0.5
                  ${isReminded(activeIdx)
                    ? 'bg-pink-500 border-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)]'
                    : dark
                      ? 'border-white/10 text-slate-400 hover:border-pink-500 hover:text-pink-400'
                      : 'border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600'
                  }`}>
                {isReminded(activeIdx) ? '🔔 Reminded' : '🔔 Remind Me'}
              </button>
            </div>

            {/* Tip */}
            <div className={`rounded-xl px-4 py-3 text-[0.87rem] font-medium border mb-5
              ${dark ? 'bg-indigo-950/60 border-indigo-800/40 text-indigo-300' : 'bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100 text-indigo-700'}`}>
              {timelineData[activeIdx].tip}
            </div>

            {/* What to do — use per-item actions from data */}
            {timelineData[activeIdx].actions?.length > 0 && (
              <div>
                <p className={`text-[0.72rem] font-extrabold uppercase tracking-widest mb-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  What to do
                </p>
                <ul className="space-y-2">
                  {timelineData[activeIdx].actions.map((action, j) => (
                    <li key={j} className={`flex items-start gap-2.5 text-[0.88rem] ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
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
        <span>Dates shown are sample data. Always verify with your official local election authority.</span>
      </div>
    </section>
  )
}
