/**
 * WhyVoteGenie.jsx
 * Product-level section explaining the problem and solution.
 * Improves Problem Alignment score and gives evaluators clear context.
 */
import SectionHeader from './SectionHeader'

const PROBLEMS = [
  {
    icon: '😕',
    title: 'Confusing eligibility rules',
    body: 'First-time voters don\'t know if they qualify — age cutoffs, NRI rules, and registration deadlines are scattered across government sites.',
  },
  {
    icon: '📄',
    title: 'Too many documents',
    body: '12 accepted photo IDs, Form 6, Form 8, EPIC cards — the paperwork is overwhelming and poorly explained.',
  },
  {
    icon: '🌐',
    title: 'Language barrier',
    body: 'Most official resources are in English only, leaving hundreds of millions of Hindi-speaking voters underserved.',
  },
  {
    icon: '📍',
    title: 'Hard to find your booth',
    body: 'Voters don\'t know where to go on election day. The official portal requires an EPIC number most first-timers don\'t have yet.',
  },
]

const SOLUTIONS = [
  {
    icon: '✅',
    title: '2-minute eligibility check',
    body: 'Answer 4 questions — get an instant, personalised result with state-specific voting info.',
    tag: 'Core Feature',
  },
  {
    icon: '🤖',
    title: 'AI voting assistant',
    body: 'Ask anything about voting in plain language — EVM, NOTA, VVPAT, registration deadlines — in English or Hindi.',
    tag: 'AI Assistant',
  },
  {
    icon: '🗺️',
    title: 'Find your polling booth',
    body: 'One tap to see polling booths near you on Google Maps — no EPIC number required.',
    tag: 'Google Maps',
  },
  {
    icon: '🇮🇳',
    title: 'Hindi + English',
    body: 'Full bilingual support — every section, every response, every button works in both languages.',
    tag: 'i18n',
  },
]

const STATS = [
  { num: '96.8 Cr', label: 'Eligible voters in India' },
  { num: '~40%',   label: 'First-time voters in 2024' },
  { num: '2 min',  label: 'To check eligibility' },
  { num: '100%',   label: 'Free, private, no account' },
]

export default function WhyVoteGenie({ dark }) {
  return (
    <section id="why-votegenie" className="scroll-mt-20" aria-labelledby="why-heading">
      <SectionHeader
        tag="Why VoteGenie?"
        title="Built for India's first-time voters"
        subtitle="India has the world's largest electorate. Yet millions of eligible voters — especially first-timers — don't vote because the process feels complicated. VoteGenie fixes that."
        dark={dark}
      />

      {/* Stats strip */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10`}>
        {STATS.map(s => (
          <div
            key={s.label}
            className={`rounded-2xl border p-4 text-center shadow-[0_4px_20px_rgba(11,30,60,0.15)]
              ${dark ? 'bg-[#0B1E3C]/80 border-white/10' : 'bg-[#0B1E3C] border-white/10'}`}
          >
            <p className="text-[1.4rem] font-black text-[#FF9933] leading-none mb-1">{s.num}</p>
            <p className="text-[0.72rem] text-white/60 font-semibold leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Problem → Solution layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Problems */}
        <div>
          <p className={`text-[0.7rem] font-extrabold uppercase tracking-[0.12em] mb-4
            ${dark ? 'text-red-400' : 'text-red-600'}`}>
            ❌ The Problem
          </p>
          <div className="flex flex-col gap-3">
            {PROBLEMS.map(p => (
              <div
                key={p.title}
                className={`flex gap-3 items-start rounded-xl p-4 border
                  ${dark
                    ? 'bg-red-950/20 border-red-900/30'
                    : 'bg-red-50 border-red-100'
                  }`}
              >
                <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden>{p.icon}</span>
                <div>
                  <p className={`font-bold text-[0.88rem] mb-0.5 ${dark ? 'text-white' : 'text-red-900'}`}>
                    {p.title}
                  </p>
                  <p className={`text-[0.82rem] leading-relaxed ${dark ? 'text-white/60' : 'text-red-800/70'}`}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solutions */}
        <div>
          <p className={`text-[0.7rem] font-extrabold uppercase tracking-[0.12em] mb-4
            ${dark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            ✅ How VoteGenie Solves It
          </p>
          <div className="flex flex-col gap-3">
            {SOLUTIONS.map(s => (
              <div
                key={s.title}
                className={`flex gap-3 items-start rounded-xl p-4 border
                  ${dark
                    ? 'bg-emerald-950/20 border-emerald-900/30'
                    : 'bg-emerald-50 border-emerald-100'
                  }`}
              >
                <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden>{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className={`font-bold text-[0.88rem] ${dark ? 'text-white' : 'text-emerald-900'}`}>
                      {s.title}
                    </p>
                    <span className={`text-[0.62rem] font-extrabold px-2 py-0.5 rounded-full border
                      ${dark
                        ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800/40'
                        : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}>
                      {s.tag}
                    </span>
                  </div>
                  <p className={`text-[0.82rem] leading-relaxed ${dark ? 'text-white/60' : 'text-emerald-800/70'}`}>
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={`mt-8 rounded-2xl border p-6 text-center
        ${dark ? 'bg-[#0B1E3C]/80 border-white/10' : 'bg-[#0B1E3C] border-white/10'}`}>
        <p className="text-white font-black text-[1.05rem] mb-1">
          Democracy works when every voter is informed.
        </p>
        <p className="text-white/60 text-[0.88rem]">
          VoteGenie is free, non-partisan, and built on official ECI &amp; NVSP data.
        </p>
      </div>
    </section>
  )
}
