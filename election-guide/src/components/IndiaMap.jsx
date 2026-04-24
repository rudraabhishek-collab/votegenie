import { useState, useRef } from 'react'
import { stateData } from '../data/stateData'
import { INDIA_STATE_PATHS, MAP_VIEWBOX } from '../data/indiaPaths'
import { useTranslation } from 'react-i18next'

// ─── Party config ──────────────────────────────────────────────────────────
const PARTY = {
  BJP:     { color: '#fb923c', dark: '#c2410c', symbol: '🪷', name: 'BJP' },
  INC:     { color: '#60a5fa', dark: '#1d4ed8', symbol: '✋', name: 'INC' },
  TMC:     { color: '#4ade80', dark: '#15803d', symbol: '🌾', name: 'TMC' },
  AAP:     { color: '#38bdf8', dark: '#0369a1', symbol: '🧹', name: 'AAP' },
  DMK:     { color: '#f87171', dark: '#b91c1c', symbol: '☀️', name: 'DMK' },
  JMM:     { color: '#a3e635', dark: '#4d7c0f', symbol: '🏹', name: 'JMM' },
  NC:      { color: '#34d399', dark: '#065f46', symbol: '🏔️', name: 'NC'  },
  NPP:     { color: '#fbbf24', dark: '#92400e', symbol: '🌄', name: 'NPP' },
  ZPM:     { color: '#c084fc', dark: '#6b21a8', symbol: '⭐', name: 'ZPM' },
  SKM:     { color: '#f9a8d4', dark: '#9d174d', symbol: '☂️', name: 'SKM' },
  TDP:     { color: '#fde68a', dark: '#92400e', symbol: '🚲', name: 'TDP' },
  NDPP:    { color: '#6ee7b7', dark: '#065f46', symbol: '🐓', name: 'NDPP'},
  AINRC:   { color: '#fdba74', dark: '#9a3412', symbol: '🌺', name: 'AINRC'},
  default: { color: '#a5b4fc', dark: '#3730a3', symbol: '📍', name: '—'   },
}

// State label positions (cx, cy for text inside state)
const LABEL_POS = {
  'Rajasthan':         { x: 162, y: 158 },
  'Madhya Pradesh':    { x: 240, y: 192 },
  'Maharashtra':       { x: 195, y: 232 },
  'Uttar Pradesh':     { x: 285, y: 152 },
  'Gujarat':           { x: 95,  y: 185 },
  'Karnataka':         { x: 188, y: 285 },
  'Andhra Pradesh':    { x: 272, y: 278 },
  'Tamil Nadu':        { x: 245, y: 332 },
  'Odisha':            { x: 335, y: 232 },
  'Chhattisgarh':      { x: 298, y: 195 },
  'West Bengal':       { x: 408, y: 172 },
  'Bihar':             { x: 365, y: 155 },
  'Telangana':         { x: 278, y: 235 },
  'Assam':             { x: 452, y: 162 },
  'Jharkhand':         { x: 368, y: 195 },
  'Kerala':            { x: 192, y: 338 },
  'Punjab':            { x: 198, y: 85  },
  'Haryana':           { x: 208, y: 112 },
  'Uttarakhand':       { x: 268, y: 112 },
  'Himachal Pradesh':  { x: 238, y: 85  },
  'Jammu & Kashmir':   { x: 222, y: 55  },
  'Ladakh':            { x: 282, y: 48  },
  'Arunachal Pradesh': { x: 482, y: 130 },
}

export default function IndiaMap({ dark, onStateSelect }) {
  const { i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'
  const [hovered,  setHovered]  = useState(null)
  const [selected, setSelected] = useState(null)
  const [tipPos,   setTipPos]   = useState({ x: 0, y: 0 })
  const svgRef = useRef(null)

  const handleMouseMove = (e, id) => {
    const svg = svgRef.current
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    setTipPos({ x: svgP.x, y: svgP.y })
    setHovered(id)
  }

  const handleClick = (id) => {
    setSelected(id)
    if (onStateSelect) onStateSelect(id)
  }

  const getFill = (id, isDark) => {
    const d = stateData[id]
    if (!d) return isDark ? '#1e3a8a' : '#e8eaf6'
    const p = PARTY[d.rulingParty] || PARTY.default
    if (selected === id) return '#FF9933'
    if (hovered === id) return isDark ? p.color : p.color
    return isDark ? p.dark : p.color + 'cc' // slight transparency in light mode
  }

  const selectedData = selected ? stateData[selected] : null
  const hoveredData  = hovered  ? stateData[hovered]  : null

  const uniqueParties = [...new Set(
    Object.values(stateData).map(d => d.rulingParty).filter(p => p && PARTY[p])
  )]

  return (
    <section id="indiamap" className="scroll-mt-20">

      {/* Header */}
      <div className="mb-8">
        <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]
          px-3 py-1.5 rounded-full mb-3 border
          ${dark ? 'bg-[#1a237e]/80 text-[#FF9933] border-[#283593]' : 'bg-[#1a237e] text-white border-[#283593]'}`}>
          🗺️ {isHindi ? 'राजनीतिक मानचित्र' : 'Political Map'}
        </span>
        <h2 className={`text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
          {isHindi ? 'भारत का राजनीतिक मानचित्र' : 'India Political Map'}
        </h2>
        <p className={`mt-1.5 text-[0.9rem] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {isHindi
            ? 'प्रत्येक राज्य सत्तारूढ़ दल के रंग में रंगा है — क्लिक करें विवरण देखें'
            : 'States colored by ruling party — click any state for full election details'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── SVG Map ─────────────────────────────────────────────────────── */}
        <div className={`relative flex-1 rounded-2xl border overflow-hidden shadow-card
          ${dark ? 'bg-[#0a0e1f] border-[#283593]/50' : 'bg-white border-[#1a237e]/20'}`}>

          {/* Legend */}
          <div className={`absolute top-3 left-3 z-20 rounded-xl px-3 py-2.5 border shadow-lg
            ${dark ? 'bg-[#0d1757]/95 border-white/10' : 'bg-white/95 border-[#1a237e]/15'}`}>
            <p className={`text-[0.58rem] font-extrabold uppercase tracking-widest mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              Ruling Party
            </p>
            <div className="flex flex-col gap-1.5">
              {uniqueParties.map(party => {
                const p = PARTY[party]
                return (
                  <div key={party} className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-sm flex-shrink-0 border border-white/30"
                      style={{ background: dark ? p.dark : p.color }} />
                    <span className="text-sm leading-none">{p.symbol}</span>
                    <span className={`text-[0.65rem] font-bold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{party}</span>
                  </div>
                )
              })}
              <div className="flex items-center gap-2 pt-1.5 mt-0.5 border-t border-slate-200 dark:border-white/10">
                <div className="w-3.5 h-3.5 rounded-sm flex-shrink-0 bg-[#FF9933] border border-white/30" />
                <span className={`text-[0.65rem] font-bold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Selected</span>
              </div>
            </div>
          </div>

          {/* SVG Map */}
          <svg
            ref={svgRef}
            viewBox={MAP_VIEWBOX}
            className="w-full"
            style={{ minHeight: 380 }}
            onMouseLeave={() => setHovered(null)}>

            {/* Ocean */}
            <rect x="60" y="25" width="510" height="360" fill={dark ? '#0f172a' : '#bfdbfe'} />

            {/* Sea labels */}
            <text x="88" y="278" fontFamily="Georgia,serif" fontSize="7" fill={dark ? '#3b82f6' : '#1e40af'} fontStyle="italic" opacity="0.7">ARABIAN</text>
            <text x="90" y="288" fontFamily="Georgia,serif" fontSize="7" fill={dark ? '#3b82f6' : '#1e40af'} fontStyle="italic" opacity="0.7">SEA</text>
            <text x="438" y="258" fontFamily="Georgia,serif" fontSize="7" fill={dark ? '#3b82f6' : '#1e40af'} fontStyle="italic" opacity="0.7">BAY OF</text>
            <text x="436" y="268" fontFamily="Georgia,serif" fontSize="7" fill={dark ? '#3b82f6' : '#1e40af'} fontStyle="italic" opacity="0.7">BENGAL</text>
            <text x="195" y="378" fontFamily="Georgia,serif" fontSize="7" fill={dark ? '#3b82f6' : '#1e40af'} fontStyle="italic" opacity="0.7">INDIAN OCEAN</text>

            {/* State paths */}
            {Object.entries(INDIA_STATE_PATHS).filter(([, d]) => d).map(([id, d]) => {
              const isHov = hovered === id
              const isSel = selected === id
              const fill  = getFill(id, dark)
              const strokeColor = dark ? '#1e3a8a' : '#ffffff'
              const strokeW = isSel ? 2.5 : isHov ? 2 : 1.2

              return (
                <g key={id}>
                  {/* Glow for selected */}
                  {isSel && (
                    <path d={d} fill="rgba(255,153,51,0.25)" transform="translate(1.5,1.5)" />
                  )}
                  <path
                    d={d}
                    fill={fill}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-150"
                    style={{
                      filter: isSel
                        ? 'drop-shadow(0 0 5px rgba(255,153,51,0.8))'
                        : isHov
                          ? 'brightness(1.2) drop-shadow(0 0 3px rgba(255,255,255,0.5))'
                          : 'none',
                    }}
                    onMouseEnter={e => handleMouseMove(e, id)}
                    onMouseMove={e => handleMouseMove(e, id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleClick(id)}
                  />
                  {/* Party symbol on larger states */}
                  {LABEL_POS[id] && stateData[id] && (
                    <text
                      x={LABEL_POS[id].x}
                      y={LABEL_POS[id].y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="9"
                      className="pointer-events-none select-none"
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
                      {PARTY[stateData[id].rulingParty]?.symbol || ''}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Tooltip */}
            {hovered && hoveredData && (
              <foreignObject
                x={Math.min(Math.max(tipPos.x - 80, 62), 430)}
                y={Math.max(tipPos.y - 108, 27)}
                width="160"
                height="100">
                <div
                  style={{ fontFamily: 'Poppins,sans-serif', animation: 'fadeUp 0.15s ease both' }}
                  className="bg-[#1a237e] text-white rounded-xl px-3 py-2.5 shadow-2xl border border-white/25 pointer-events-none">
                  <p style={{ fontWeight: 800, fontSize: 11, color: '#FF9933', marginBottom: 4 }}>{hovered}</p>
                  <p style={{ fontSize: 9.5, lineHeight: 1.7, opacity: 0.9 }}>
                    {PARTY[hoveredData.rulingParty]?.symbol} {hoveredData.rulingParty}<br />
                    👤 {hoveredData.cm}<br />
                    📅 {hoveredData.nextElection}
                  </p>
                </div>
              </foreignObject>
            )}
          </svg>

          <p className={`text-center text-[0.62rem] pb-2 px-4 ${dark ? 'text-slate-700' : 'text-slate-400'}`}>
            * Simplified political map. Boundaries are indicative and not to official scale.
          </p>
        </div>

        {/* ── Detail panel ────────────────────────────────────────────────── */}
        <div className="lg:w-72 w-full flex flex-col gap-3">

          {selectedData ? (
            <div
              className={`rounded-2xl border overflow-hidden shadow-card-hover
                ${dark ? 'bg-gray-900 border-[#283593]/40' : 'bg-white border-[#1a237e]/15'}`}
              style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <div className="h-[3px] bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#FF9933]" />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg border-2 border-white/30 flex-shrink-0"
                    style={{ background: PARTY[selectedData.rulingParty]?.color || '#9333ea' }}>
                    {PARTY[selectedData.rulingParty]?.symbol || '📍'}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-black text-[1rem] leading-tight ${dark ? 'text-white' : 'text-[#1a237e]'}`}>{selected}</h3>
                    <p className={`text-[0.72rem] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {selectedData.capital} · {selectedData.seats > 0 ? `${selectedData.seats} seats` : 'UT'}
                    </p>
                  </div>
                </div>

                {[
                  { icon: '📅', label: 'Next Election',   value: selectedData.nextElection,   hi: true  },
                  { icon: '🗳️', label: 'Last Election',   value: selectedData.lastElection,   hi: false },
                  { icon: '👤', label: 'Chief Minister',  value: selectedData.cm,             hi: true  },
                  { icon: '🏛️', label: 'Ruling Alliance', value: selectedData.rulingAlliance, hi: false },
                  { icon: '⚔️', label: 'Opposition',      value: selectedData.oppositionParty,hi: false },
                  { icon: '📊', label: 'Recent Result',   value: selectedData.recentResult,   hi: false },
                ].map(row => (
                  <div key={row.label}
                    className={`flex items-start gap-2.5 py-2 border-b last:border-0
                      ${dark ? 'border-white/[0.05]' : 'border-slate-100'}`}>
                    <span className="text-sm flex-shrink-0 mt-0.5">{row.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-[0.62rem] font-extrabold uppercase tracking-widest ${dark ? 'text-slate-600' : 'text-slate-400'}`}>{row.label}</p>
                      <p className={`text-[0.83rem] font-semibold leading-snug break-words
                        ${row.hi ? (dark ? 'text-[#FF9933]' : 'text-[#1a237e]') : (dark ? 'text-slate-200' : 'text-gray-700')}`}>
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => document.getElementById('stateinfo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-4 w-full py-2.5 rounded-xl font-bold text-[0.82rem] text-white
                    bg-gradient-to-r from-[#1a237e] to-[#7c3aed]
                    hover:-translate-y-0.5 hover:shadow-glow transition-all duration-200">
                  View Full Details →
                </button>
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl border p-6 text-center ${dark ? 'bg-gray-900 border-[#283593]/40' : 'bg-white border-[#1a237e]/15'}`}>
              <div className="text-5xl mb-3">🗺️</div>
              <p className={`font-black text-[0.95rem] mb-1.5 ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
                {isHindi ? 'राज्य चुनें' : 'Click any state'}
              </p>
              <p className={`text-[0.82rem] leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {isHindi ? 'मानचित्र पर किसी भी राज्य पर क्लिक करें' : 'Click a state on the map to see CM, ruling party & next election'}
              </p>
              <div className={`mt-4 rounded-xl p-3 text-left ${dark ? 'bg-white/5' : 'bg-[#f0f4ff]'}`}>
                <p className={`text-[0.65rem] font-extrabold uppercase tracking-widest mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Party Colors</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {uniqueParties.slice(0, 8).map(party => {
                    const p = PARTY[party]
                    return (
                      <div key={party} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: p.color }} />
                        <span className="text-sm">{p.symbol}</span>
                        <span className={`text-[0.68rem] font-semibold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{party}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* India stats */}
          <div className={`rounded-2xl border p-4 ${dark ? 'bg-[#0d1757]/60 border-[#283593]/40' : 'bg-[#e8eaf6] border-[#1a237e]/15'}`}>
            <p className={`text-[0.65rem] font-extrabold uppercase tracking-widest mb-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>India at a Glance</p>
            {[
              { label: 'Total States',       value: '28',      icon: '🗺️' },
              { label: 'Union Territories',  value: '8',       icon: '🏛️' },
              { label: 'Lok Sabha Seats',    value: '543',     icon: '🏛️' },
              { label: 'Registered Voters',  value: '96.8 Cr', icon: '🗳️' },
            ].map(s => (
              <div key={s.label} className={`flex justify-between items-center py-1.5 border-b last:border-0 ${dark ? 'border-white/[0.05]' : 'border-[#1a237e]/10'}`}>
                <span className={`text-[0.78rem] flex items-center gap-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="text-xs">{s.icon}</span>{s.label}
                </span>
                <span className={`text-[0.82rem] font-black ${dark ? 'text-[#FF9933]' : 'text-[#1a237e]'}`}>{s.value}</span>
              </div>
            ))}
          </div>

          <p className={`text-[0.65rem] text-center ${dark ? 'text-slate-700' : 'text-slate-400'}`}>
            🕐 Last updated: April 2026 · Data is indicative
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className={`flex gap-3 items-start mt-5 rounded-xl border-l-[3px] border-[#1a237e] px-5 py-4 text-[0.88rem] leading-relaxed
        ${dark ? 'bg-[#1a237e]/20 border border-[#283593]/40 text-indigo-300' : 'bg-[#e8eaf6] border border-[#1a237e]/15 text-[#1a237e]'}`}>
        <span className="text-lg mt-0.5">💡</span>
        <div>
          States are colored by ruling party. Click any state for full details. Always verify with{' '}
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:opacity-80">eci.gov.in</a>.
          <p className={`text-[0.72rem] mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            🕐 Last updated: April 2026 · Boundaries are indicative, not to official scale.
          </p>
        </div>
      </div>
    </section>
  )
}
