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

// ─── Info row with tooltip ────────────────────────────────────────────────
function InfoRow({ icon, label, value, highlight, dark, tooltip }) {
  const [showTip, setShowTip] = useState(false)
  return (
    <div className="flex items-start gap-3 py-2.5 relative">
      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-white/50">{label}</p>
          {tooltip && (
            <button
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[0.6rem] font-bold text-white/60 hover:bg-white/30 transition-colors">
              ?
            </button>
          )}
        </div>
        <p className={`text-[0.9rem] font-semibold leading-snug break-words ${highlight ? 'text-[#FF9933]' : 'text-white/85'}`}>
          {value}
        </p>
        {showTip && tooltip && (
          <div className="absolute left-0 top-full mt-1 z-20 bg-[#1a237e] text-white text-[0.72rem] px-3 py-2 rounded-lg shadow-xl max-w-[220px] border border-white/20"
            style={{ animation: 'fadeUp 0.2s ease both' }}>
            {tooltip}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-[#1a237e] rotate-45 border-l border-t border-white/20" />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── UT notice card (no assembly) ─────────────────────────────────────────
function UTCard({ data, dark }) {
  return (
    <div className={`rounded-2xl border overflow-hidden shadow-[0_4px_24px_rgba(11,30,60,0.18)] ${dark ? 'bg-[#0B1E3C]/80 border-white/10' : 'bg-[#0B1E3C] border-white/10'}`}>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#FF6A00,#FF4500,#3b82f6)' }} />
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">🏛️</div>
        <h3 className="text-[1.1rem] font-black mb-1 text-white">{data.fullName}</h3>
        <p className="text-[0.88rem] mb-4 text-white/70">Capital: {data.capital}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.85rem] font-semibold border bg-[#FF6A00]/20 border-[#FF6A00]/30 text-[#FF9933]">
          ⚠️ This UT has no state legislative assembly
        </div>
        <p className="mt-3 text-[0.82rem] text-white/65">
          Administered directly by the Central Government via a Lieutenant Governor / Administrator.
        </p>
        <div className="mt-4 rounded-xl px-4 py-3 border text-[0.85rem] bg-white/5 border-white/10 text-white/80">
          📊 Lok Sabha Seats: <strong>{data.lokSabhaSeats}</strong> &nbsp;·&nbsp; 📞 Voter Helpline: <strong>{data.voterHelpline}</strong>
        </div>
      </div>
    </div>
  )
}

// ─── Full state card ───────────────────────────────────────────────────────
function StateCard({ data, dark }) {
  return (
    <div className={`rounded-2xl border overflow-hidden shadow-[0_4px_24px_rgba(11,30,60,0.18)] transition-all duration-300
      ${dark ? 'bg-[#0B1E3C]/80 border-white/10' : 'bg-[#0B1E3C] border-white/10'}`}>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#FF6A00,#FF4500,#3b82f6)' }} />
      <div className={`px-6 py-5 border-b border-white/10`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-[1.15rem] font-black tracking-[-0.03em] text-white">{data.fullName}</h3>
            <p className="text-[0.78rem] mt-0.5 text-white/60">Capital: {data.capital} · {data.seats} Assembly seats</p>
          </div>
          <PartyBadge party={data.rulingParty} />
        </div>
      </div>
      <div className="px-6 py-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <div>
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] mt-4 mb-1 text-[#FF9933]">🗓️ Election Info</p>
          <div className="divide-y divide-white/[0.05]">
            <InfoRow icon="📅" label="Next Election"  value={data.nextElection}  highlight dark={dark} tooltip="Expected year based on 5-year term from last election." />
            <InfoRow icon="🗳️" label="Last Election"  value={data.lastElection}  dark={dark} />
            <InfoRow icon="📊" label="Recent Result"  value={data.recentResult}  dark={dark} />
          </div>
        </div>
        <div>
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] mt-4 mb-1 text-blue-400">🏛️ Government</p>
          <div className="divide-y divide-white/[0.05]">
            <InfoRow icon="👤" label="Chief Minister"  value={data.cm}               highlight dark={dark} tooltip="Head of the state government." />
            <InfoRow icon="🏳️" label="Ruling Alliance" value={data.rulingAlliance}   dark={dark} tooltip="Party or coalition holding majority seats." />
            <InfoRow icon="⚔️" label="Opposition"      value={data.oppositionParty}  dark={dark} tooltip="Main party sitting in opposition." />
          </div>
        </div>
      </div>
      <div className="mx-6 my-4 rounded-xl px-4 py-3 flex flex-wrap gap-4 border bg-white/5 border-white/10">
        {[
          { label: 'Lok Sabha Seats', value: data.lokSabhaSeats },
          { label: 'Voter Helpline',  value: data.voterHelpline },
          { label: 'Postal Voting',   value: data.postalVoting ? '✅ Available' : '❌ Not available' },
        ].map(s => (
          <div key={s.label} className="flex-1 min-w-[100px]">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-widest text-white/50">{s.label}</p>
            <p className="text-[0.88rem] font-bold mt-0.5 text-white">{s.value}</p>
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
        <p className={`text-[0.78rem] font-extrabold uppercase tracking-[0.1em] mb-4 ${dark ? 'text-white' : 'text-slate-700'}`}>
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
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-xs">▾</span>
            </div>
          ))}
        </div>

        {dataA && dataB ? (
          <div className="overflow-x-auto">
            <table className="w-full text-[0.85rem]">
              <thead>
                <tr>
                  <th className={`text-left py-2 px-3 text-[0.68rem] font-extrabold uppercase tracking-widest ${dark ? 'text-white' : 'text-slate-700'}`}>Field</th>
                  <th className={`text-left py-2 px-3 text-[0.82rem] font-black ${dark ? 'text-indigo-400' : 'text-indigo-700'}`}>{stateA}</th>
                  <th className={`text-left py-2 px-3 text-[0.82rem] font-black ${dark ? 'text-violet-400' : 'text-violet-700'}`}>{stateB}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_FIELDS.map(f => (
                  <tr key={f.key} className={`border-t ${dark ? 'border-white/[0.05]' : 'border-slate-100'}`}>
                    <td className={`py-2.5 px-3 font-semibold whitespace-nowrap ${dark ? 'text-white' : 'text-slate-700'}`}>
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
          <p className={`text-center text-[0.85rem] py-6 ${dark ? 'text-white' : 'text-slate-700'}`}>
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

  const selectCls = `w-full sm:w-80 rounded-xl px-4 py-2.5 text-[0.9rem] border appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400/30 transition-all    ${dark ? 'bg-white/[0.07] border-white/10 text-white focus:border-indigo-400' : 'bg-slate-50 border-indigo-100 text-gray-900 focus:border-indigo-400 focus:bg-white'}`

  return (
    <section id="stateinfo" className="scroll-mt-20" aria-labelledby="stateinfo-h">
      <SectionHeader
        tag="State Election Info"
        title="Current leaders & upcoming elections"
        subtitle="Select any of India's 28 states or 8 Union Territories to see its Chief Minister, ruling party, and next election date."
        dark={dark}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-6">
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
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-xs">▾</span>
        </div>

        <button
          onClick={() => { setShowCompare(c => !c); setSelected('') }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.82rem] font-bold border transition-all duration-200 hover:-translate-y-0.5
            ${showCompare
              ? 'bg-gradient-to-r from-indigo-500 to-violet-600 border-transparent text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
              : dark
                ? 'border-white/10 text-slate-600 hover:border-indigo-600/50 hover:text-indigo-400'
                : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
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
        <div className={`rounded-2xl border p-10 text-center ${dark ? 'bg-[#0B1E3C]/80 border-white/10' : 'bg-[#0B1E3C] border-white/10'}`}>
          <div className="text-4xl mb-3">🗺️</div>
          <p className="font-bold text-[1rem] mb-1 text-white">Select a state or UT to get started</p>
          <p className="text-[0.88rem] text-white/65">All 28 states and 8 Union Territories covered — Chief Minister, ruling party, and upcoming election dates.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['Maharashtra', 'Delhi', 'Uttar Pradesh', 'Tamil Nadu', 'West Bengal', 'Karnataka'].map(s => (
              <button key={s} onClick={() => setSelected(s)}
                className="px-3 py-1.5 rounded-full text-[0.78rem] font-semibold border transition-all hover:-translate-y-0.5 border-white/10 text-white/60 hover:border-[#FF6A00]/50 hover:text-[#FF9933]">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compare view */}
      {showCompare && <CompareView dark={dark} />}

      {/* Disclaimer */}
      <div className={`flex gap-3 items-start mt-5 rounded-xl border-l-[3px] border-[#FF6A00] px-5 py-4 text-[0.88rem] leading-relaxed
        ${dark ? 'bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-white/70' : 'bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-white/80'}`}>
        <span className="text-lg mt-0.5">💡</span>
        <div>
          <span>Data reflects the most recent elections as of 2025. Always verify with </span>
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:opacity-80">eci.gov.in</a>
          <span> for the latest official information.</span>
          <p className={`text-[0.72rem] mt-1 ${dark ? 'text-white' : 'text-slate-700'}`}>
            🕐 Last updated: April 2026 · Data is indicative, not official.
          </p>
        </div>
      </div>
    </section>
  )
}
