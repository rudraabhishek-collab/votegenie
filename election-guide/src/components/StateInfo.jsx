import { useState } from 'react'
import { stateData, STATES_WITH_ASSEMBLY, UTS_WITHOUT_ASSEMBLY, getPartyColor } from '../data/stateData'
import SectionHeader from './SectionHeader'

// ─── Party badge ───────────────────────────────────────────────────────────
function PartyBadge({ party }) {
  const c = getPartyColor(party)
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-extrabold border ${c.bg} ${c.text} ${c.border}`}>
      {party}
    </span>
  )
}

// ─── Info row ──────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, highlight, dark }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
        <p className={`text-[0.9rem] font-semibold leading-snug break-words ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-800 dark:text-slate-200'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

// ─── UT notice card (no assembly) ─────────────────────────────────────────
function UTCard({ data, dark }) {
  return (
    <div className={`rounded-2xl border overflow-hidden shadow-card ${dark ? 'bg-gray-900 border-violet-900/20' : 'bg-white border-indigo-100'}`}>
      <div className="h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">🏛️</div>
        <h3 className={`text-[1.1rem] font-black mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{data.fullName}</h3>
        <p className={`text-[0.88rem] mb-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Capital: {data.capital}</p>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.85rem] font-semibold border
          ${dark ? 'bg-amber-950/50 border-amber-800/40 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
          ⚠️ This UT has no state legislative assembly
        </div>
        <p className={`mt-3 text-[0.82rem] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          Administered directly by the Central Government via a Lieutenant Governor / Administrator.
        </p>
        <div className={`mt-4 rounded-xl px-4 py-3 border text-[0.85rem] ${dark ? 'bg-indigo-950/40 border-indigo-800/30 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
          📊 Lok Sabha Seats: <strong>{data.lokSabhaSeats}</strong> &nbsp;·&nbsp; 📞 Voter Helpline: <strong>{data.voterHelpline}</strong>
        </div>
      </div>
    </div>
  )
}

// ─── Full state card ───────────────────────────────────────────────────────
function StateCard({ data, dark }) {
  return (
    <div className={`rounded-2xl border overflow-hidden shadow-card transition-all duration-300
      ${dark ? 'bg-gray-900 border-violet-900/20' : 'bg-white border-indigo-100'}`}>
      <div className="h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

      {/* Header */}
      <div className={`px-6 py-5 border-b ${dark ? 'border-white/[0.07]' : 'border-indigo-50'}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className={`text-[1.15rem] font-black tracking-[-0.03em] ${dark ? 'text-white' : 'text-gray-900'}`}>
              {data.fullName}
            </h3>
            <p className={`text-[0.78rem] mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              Capital: {data.capital} · {data.seats} Assembly seats
            </p>
          </div>
          <PartyBadge party={data.rulingParty} />
        </div>
      </div>

      {/* Body — two columns */}
      <div className="px-6 py-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <div>
          <p className={`text-[0.68rem] font-extrabold uppercase tracking-[0.12em] mt-4 mb-1 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            🗓️ Election Info
          </p>
          <div className={`divide-y ${dark ? 'divide-white/[0.05]' : 'divide-slate-100'}`}>
            <InfoRow icon="📅" label="Next Election"  value={data.nextElection}  highlight dark={dark} />
            <InfoRow icon="🗳️" label="Last Election"  value={data.lastElection}  dark={dark} />
            <InfoRow icon="📊" label="Recent Result"  value={data.recentResult}  dark={dark} />
          </div>
        </div>
        <div>
          <p className={`text-[0.68rem] font-extrabold uppercase tracking-[0.12em] mt-4 mb-1 ${dark ? 'text-violet-400' : 'text-violet-600'}`}>
            🏛️ Government
          </p>
          <div className={`divide-y ${dark ? 'divide-white/[0.05]' : 'divide-slate-100'}`}>
            <InfoRow icon="👤" label="Chief Minister"  value={data.cm}               highlight dark={dark} />
            <InfoRow icon="🏳️" label="Ruling Alliance" value={data.rulingAlliance}   dark={dark} />
            <InfoRow icon="⚔️" label="Opposition"      value={data.oppositionParty}  dark={dark} />
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className={`mx-6 my-4 rounded-xl px-4 py-3 flex flex-wrap gap-4 border
        ${dark ? 'bg-indigo-950/40 border-indigo-800/30' : 'bg-gradient-to-r from-indigo-50 to-violet-50/60 border-indigo-100'}`}>
        {[
          { label: 'Lok Sabha Seats', value: data.lokSabhaSeats },
          { label: 'Voter Helpline',  value: data.voterHelpline },
          { label: 'Postal Voting',   value: data.postalVoting ? '✅ Available' : '❌ Not available' },
        ].map(s => (
          <div key={s.label} className="flex-1 min-w-[100px]">
            <p className={`text-[0.65rem] font-extrabold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{s.label}</p>
            <p className={`text-[0.88rem] font-bold mt-0.5 ${dark ? 'text-slate-200' : 'text-gray-800'}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Compare view ──────────────────────────────────────────────────────────
const ALL_NAMES = [...STATES_WITH_ASSEMBLY, ...UTS_WITHOUT_ASSEMBLY]

const COMPARE_FIELDS = [
  { icon: '📅', label: 'Next Election',    key: 'nextElection'    },
  { icon: '🗳️', label: 'Last Election',    key: 'lastElection'    },
  { icon: '👤', label: 'Chief Minister',   key: 'cm'              },
  { icon: '🏳️', label: 'Ruling Party',     key: 'rulingParty'     },
  { icon: '⚔️', label: 'Opposition',       key: 'oppositionParty' },
  { icon: '🏛️', label: 'Assembly Seats',   key: 'seats'           },
  { icon: '📊', label: 'Lok Sabha Seats',  key: 'lokSabhaSeats'   },
  { icon: '📮', label: 'Postal Voting',    key: 'postalVoting'    },
]

function CompareView({ dark }) {
  const [stateA, setStateA] = useState('')
  const [stateB, setStateB] = useState('')
  const dataA = stateData[stateA]
  const dataB = stateData[stateB]

  const selectCls = `w-full rounded-xl px-4 py-2.5 text-[0.88rem] border appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400/30 transition-all
    ${dark ? 'bg-white/[0.07] border-white/10 text-white focus:border-indigo-400' : 'bg-slate-50 border-indigo-100 text-gray-900 focus:border-indigo-400 focus:bg-white'}`

  const formatVal = (key, val) => {
    if (key === 'postalVoting') return val ? '✅ Yes' : '❌ No'
    return String(val)
  }

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-card ${dark ? 'bg-gray-900 border-violet-900/20' : 'bg-white border-indigo-100'}`}>
      <div className="h-[3px] bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500" />
      <div className="p-6">
        <p className={`text-[0.78rem] font-extrabold uppercase tracking-[0.1em] mb-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          ⚖️ Compare Two States / UTs
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[{ val: stateA, set: setStateA, label: 'State A' }, { val: stateB, set: setStateB, label: 'State B' }].map(({ val, set, label }) => (
            <div key={label} className="relative">
              <select value={val} onChange={e => set(e.target.value)} className={selectCls}>
                <option value="">— {label} —</option>
                <optgroup label="States">
                  {STATES_WITH_ASSEMBLY.map(s => <option key={s} value={s}>{s}</option>)}
                </optgroup>
                <optgroup label="Union Territories">
                  {UTS_WITHOUT_ASSEMBLY.map(s => <option key={s} value={s}>{s}</option>)}
                </optgroup>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▾</span>
            </div>
          ))}
        </div>

        {dataA && dataB ? (
          <div className="overflow-x-auto">
            <table className="w-full text-[0.85rem]">
              <thead>
                <tr>
                  <th className={`text-left py-2 px-3 text-[0.68rem] font-extrabold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Field</th>
                  <th className={`text-left py-2 px-3 text-[0.82rem] font-black ${dark ? 'text-indigo-400' : 'text-indigo-700'}`}>{stateA}</th>
                  <th className={`text-left py-2 px-3 text-[0.82rem] font-black ${dark ? 'text-violet-400' : 'text-violet-700'}`}>{stateB}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_FIELDS.map(f => (
                  <tr key={f.key} className={`border-t ${dark ? 'border-white/[0.05]' : 'border-slate-100'}`}>
                    <td className={`py-2.5 px-3 font-semibold whitespace-nowrap ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {f.icon} {f.label}
                    </td>
                    <td className={`py-2.5 px-3 font-semibold ${dark ? 'text-slate-200' : 'text-gray-800'}`}>{formatVal(f.key, dataA[f.key])}</td>
                    <td className={`py-2.5 px-3 font-semibold ${dark ? 'text-slate-200' : 'text-gray-800'}`}>{formatVal(f.key, dataB[f.key])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={`text-center text-[0.85rem] py-6 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            Select two states above to compare them side-by-side.
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main StateInfo section ────────────────────────────────────────────────
export default function StateInfo({ dark }) {
  const [selected, setSelected] = useState('')
  const [showCompare, setShowCompare] = useState(false)
  const data = stateData[selected]
  const isUT = data && data.seats === 0

  const selectCls = `w-full sm:w-80 rounded-xl px-4 py-2.5 text-[0.9rem] border appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400/30 transition-all
    ${dark ? 'bg-white/[0.07] border-white/10 text-white focus:border-indigo-400' : 'bg-slate-50 border-indigo-100 text-gray-900 focus:border-indigo-400 focus:bg-white'}`

  return (
    <section id="stateinfo" className="scroll-mt-20" aria-labelledby="stateinfo-h">
      <SectionHeader
        tag="State Election Info"
        title="Current leaders & upcoming elections"
        subtitle="Select any of India's 28 states or 8 Union Territories to see its Chief Minister, ruling party, and next election date."
        dark={dark}
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 sm:flex-none">
          <select value={selected} onChange={e => { setSelected(e.target.value); setShowCompare(false) }}
            className={selectCls} aria-label="Select state or UT">
            <option value="">— Select a state or UT —</option>
            <optgroup label="States (28)">
              {STATES_WITH_ASSEMBLY.map(s => <option key={s} value={s}>{s}</option>)}
            </optgroup>
            <optgroup label="Union Territories (8)">
              {UTS_WITHOUT_ASSEMBLY.map(s => <option key={s} value={s}>{s}</option>)}
            </optgroup>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▾</span>
        </div>

        <button
          onClick={() => { setShowCompare(c => !c); setSelected('') }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.82rem] font-bold border transition-all duration-200 hover:-translate-y-0.5
            ${showCompare
              ? 'bg-gradient-to-r from-indigo-500 to-violet-600 border-transparent text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
              : dark
                ? 'border-white/10 text-slate-400 hover:border-indigo-600/50 hover:text-indigo-400'
                : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
            }`}>
          ⚖️ Compare States
        </button>
      </div>

      {/* State card */}
      {data && !showCompare && (
        isUT ? <UTCard data={data} dark={dark} /> : <StateCard data={data} dark={dark} />
      )}

      {/* Empty state */}
      {!data && !showCompare && (
        <div className={`rounded-2xl border p-10 text-center ${dark ? 'bg-gray-900 border-violet-900/20' : 'bg-white border-indigo-100'}`}>
          <div className="text-4xl mb-3">🗺️</div>
          <p className={`font-bold text-[1rem] mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Select a state or UT to get started
          </p>
          <p className={`text-[0.88rem] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            All 28 states and 8 Union Territories covered — Chief Minister, ruling party, and upcoming election dates.
          </p>
          {/* Quick picks */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['Maharashtra', 'Delhi', 'Uttar Pradesh', 'Tamil Nadu', 'West Bengal', 'Karnataka'].map(s => (
              <button key={s} onClick={() => setSelected(s)}
                className={`px-3 py-1.5 rounded-full text-[0.78rem] font-semibold border transition-all hover:-translate-y-0.5
                  ${dark ? 'border-white/10 text-slate-400 hover:border-indigo-600/50 hover:text-indigo-400' : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compare view */}
      {showCompare && <CompareView dark={dark} />}

      {/* Disclaimer */}
      <div className={`flex gap-3 items-start mt-5 rounded-xl border-l-[3px] border-indigo-500 px-5 py-4 text-[0.88rem] leading-relaxed
        ${dark ? 'bg-indigo-950/40 border border-indigo-800/30 text-indigo-300' : 'bg-gradient-to-r from-indigo-50 to-violet-50/50 border border-indigo-100 text-indigo-700'}`}>
        <span className="text-lg mt-0.5">💡</span>
        <span>Data reflects the most recent elections as of 2025. Always verify with <strong>eci.gov.in</strong> for the latest official information.</span>
      </div>
    </section>
  )
}
