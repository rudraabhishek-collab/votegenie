import { useState, useRef } from 'react'
import { INDIA_SVG_PATHS, INDIA_CENTROIDS, MAP_W, MAP_H } from '../data/indiaPaths'
import { stateData } from '../data/stateData'
import { useTranslation } from 'react-i18next'

// ─── GeoJSON name → stateData key ─────────────────────────────────────────
const NAME_MAP = {
  'Andaman and Nicobar':    'Andaman & Nicobar Islands',
  'Andhra Pradesh':         'Andhra Pradesh',
  'Arunachal Pradesh':      'Arunachal Pradesh',
  'Assam':                  'Assam',
  'Bihar':                  'Bihar',
  'Chandigarh':             'Chandigarh',
  'Chhattisgarh':           'Chhattisgarh',
  'Dadra and Nagar Haveli': 'Dadra & Nagar Haveli and Daman & Diu',
  'Daman and Diu':          'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi':                  'Delhi',
  'Goa':                    'Goa',
  'Gujarat':                'Gujarat',
  'Haryana':                'Haryana',
  'Himachal Pradesh':       'Himachal Pradesh',
  'Jammu and Kashmir':      'Jammu & Kashmir',
  'Jharkhand':              'Jharkhand',
  'Karnataka':              'Karnataka',
  'Kerala':                 'Kerala',
  'Lakshadweep':            'Lakshadweep',
  'Madhya Pradesh':         'Madhya Pradesh',
  'Maharashtra':            'Maharashtra',
  'Manipur':                'Manipur',
  'Meghalaya':              'Meghalaya',
  'Mizoram':                'Mizoram',
  'Nagaland':               'Nagaland',
  'Orissa':                 'Odisha',
  'Puducherry':             'Puducherry',
  'Punjab':                 'Punjab',
  'Rajasthan':              'Rajasthan',
  'Sikkim':                 'Sikkim',
  'Tamil Nadu':             'Tamil Nadu',
  'Tripura':                'Tripura',
  'Uttar Pradesh':          'Uttar Pradesh',
  'Uttaranchal':            'Uttarakhand',
  'West Bengal':            'West Bengal',
}

// ─── Party colors ──────────────────────────────────────────────────────────
const PARTY = {
  BJP:     { fill: '#fdba74', hover: '#fb923c', symbol: '🪷', name: 'BJP' },
  INC:     { fill: '#93c5fd', hover: '#60a5fa', symbol: '✋', name: 'INC' },
  TMC:     { fill: '#86efac', hover: '#4ade80', symbol: '🌾', name: 'TMC' },
  AAP:     { fill: '#7dd3fc', hover: '#38bdf8', symbol: '🧹', name: 'AAP' },
  DMK:     { fill: '#fca5a5', hover: '#f87171', symbol: '☀️', name: 'DMK' },
  JMM:     { fill: '#bef264', hover: '#a3e635', symbol: '🏹', name: 'JMM' },
  NC:      { fill: '#6ee7b7', hover: '#34d399', symbol: '🏔️', name: 'NC'  },
  NPP:     { fill: '#fde68a', hover: '#fbbf24', symbol: '🌄', name: 'NPP' },
  ZPM:     { fill: '#d8b4fe', hover: '#c084fc', symbol: '⭐', name: 'ZPM' },
  SKM:     { fill: '#fbcfe8', hover: '#f9a8d4', symbol: '☂️', name: 'SKM' },
  TDP:     { fill: '#fef08a', hover: '#fde047', symbol: '🚲', name: 'TDP' },
  NDPP:    { fill: '#a7f3d0', hover: '#6ee7b7', symbol: '🐓', name: 'NDPP'},
  AINRC:   { fill: '#fed7aa', hover: '#fdba74', symbol: '🌺', name: 'AINRC'},
  default: { fill: '#e0e7ff', hover: '#c7d2fe', symbol: '📍', name: '—'  },
}

// Large states that get a label
const LABEL_STATES = new Set([
  'Rajasthan','Madhya Pradesh','Maharashtra','Uttar Pradesh','Gujarat',
  'Karnataka','Andhra Pradesh','Tamil Nadu','Odisha','Chhattisgarh',
  'West Bengal','Bihar','Telangana','Assam','Jharkhand','Kerala',
  'Punjab','Haryana','Uttaranchal','Himachal Pradesh',
])

export default function IndiaMap({ dark, onStateSelect }) {
  const { i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'
  const svgRef = useRef(null)

  const [hovered,  setHovered]  = useState(null)   // geoName
  const [selected, setSelected] = useState(null)   // stateData key
  const [tipPos,   setTipPos]   = useState({ x: 0, y: 0 })

  const handleMouseMove = (e, geoName) => {
    const svg = svgRef.current
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    setTipPos({ x: svgP.x, y: svgP.y })
    setHovered(geoName)
  }

  const handleClick = (geoName) => {
    const key = NAME_MAP[geoName]
    if (!key) return
    setSelected(key)
    if (onStateSelect) onStateSelect(key)
  }

  const selectedData = selected ? stateData[selected] : null

  const uniqueParties = [...new Set(
    Object.values(stateData).map(d => d.rulingParty).filter(p => p && PARTY[p])
  )]

  // Get fill color for a geo state
  const getFill = (geoName) => {
    const key = NAME_MAP[geoName]
    if (!key) return dark ? '#1e3a8a' : '#e0e7ff'
    const d = stateData[key]
    if (!d) return dark ? '#1e3a8a' : '#e0e7ff'
    const p = PARTY[d.rulingParty] || PARTY.default
    if (selected === key) return '#FF9933'
    if (hovered === geoName) return p.hover
    return dark ? p.hover + '99' : p.fill
  }

  const getStroke = (geoName) => {
    const key = NAME_MAP[geoName]
    if (selected === key) return '#FF9933'
    if (hovered === geoName) return dark ? '#ffffff' : '#1a237e'
    return dark ? '#1e3a8a' : '#ffffff'
  }

  const getStrokeW = (geoName) => {
    const key = NAME_MAP[geoName]
    if (selected === key) return 2.5
    if (hovered === geoName) return 1.8
    return 0.7
  }

  // Tooltip data
  const hovKey = hovered ? NAME_MAP[hovered] : null
  const hovData = hovKey ? stateData[hovKey] : null

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
            ? 'प्रत्येक राज्य सत्तारूढ़ दल के रंग में — क्लिक करें विवरण देखें'
            : 'States colored by ruling party — hover to preview, click for full details'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── SVG Map ─────────────────────────────────────────────────────── */}
        <div className={`relative flex-1 rounded-2xl border overflow-hidden shadow-card
          ${dark ? 'bg-[#0a0e1f] border-[#283593]/50' : 'bg-[#dbeafe] border-[#1a237e]/20'}`}>

          {/* Legend */}
          <div className={`absolute top-3 left-3 z-20 rounded-xl px-3 py-2.5 border shadow-xl backdrop-blur-sm
            ${dark ? 'bg-[#0d1757]/98 border-white/15' : 'bg-white/98 border-[#1a237e]/20'}`}>
            <p className={`text-[0.58rem] font-extrabold uppercase tracking-widest mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              Ruling Party
            </p>
            <div className="flex flex-col gap-1.5">
              {uniqueParties.map(party => {
                const p = PARTY[party]
                return (
                  <div key={party} className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-sm flex-shrink-0 border border-black/10"
                      style={{ background: p.fill }} />
                    <span className="text-sm leading-none">{p.symbol}</span>
                    <span className={`text-[0.65rem] font-bold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{party}</span>
                  </div>
                )
              })}
              <div className="flex items-center gap-2 pt-1.5 mt-1 border-t border-slate-200 dark:border-white/15">
                <div className="w-3.5 h-3.5 rounded-sm flex-shrink-0 bg-[#FF9933] border border-black/10" />
                <span className={`text-[0.65rem] font-bold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Selected</span>
              </div>
            </div>
          </div>

          {/* The actual SVG map */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="w-full"
            style={{ display: 'block' }}
            onMouseLeave={() => setHovered(null)}>

            {/* Ocean background */}
            <rect width={MAP_W} height={MAP_H} fill={dark ? '#0f172a' : '#bfdbfe'} />

            {/* State paths */}
            {Object.entries(INDIA_SVG_PATHS).map(([geoName, d]) => {
              if (!d) return null
              return (
                <path
                  key={geoName}
                  d={d}
                  fill={getFill(geoName)}
                  stroke={getStroke(geoName)}
                  strokeWidth={getStrokeW(geoName)}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-150"
                  style={{
                    filter: selected === NAME_MAP[geoName]
                      ? 'drop-shadow(0 0 6px rgba(255,153,51,0.9))'
                      : hovered === geoName
                        ? 'brightness(1.08)'
                        : 'none',
                  }}
                  onMouseEnter={e => handleMouseMove(e, geoName)}
                  onMouseMove={e => handleMouseMove(e, geoName)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleClick(geoName)}
                />
              )
            })}

            {/* State abbreviation labels on larger states */}
            {Object.entries(INDIA_CENTROIDS).map(([geoName, [cx, cy]]) => {
              const key = NAME_MAP[geoName]
              if (!key || !LABEL_STATES.has(key) && !LABEL_STATES.has(geoName)) return null
              const d = stateData[key]
              if (!d) return null
              const p = PARTY[d.rulingParty] || PARTY.default
              return (
                <text
                  key={geoName}
                  x={cx} y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  className="pointer-events-none select-none"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
                  {p.symbol}
                </text>
              )
            })}

            {/* Sea labels */}
            <text x="55"  y="420" fontFamily="Georgia,serif" fontSize="10" fill={dark ? '#60a5fa' : '#1e40af'} fontStyle="italic" opacity="0.6" textAnchor="middle">ARABIAN</text>
            <text x="55"  y="434" fontFamily="Georgia,serif" fontSize="10" fill={dark ? '#60a5fa' : '#1e40af'} fontStyle="italic" opacity="0.6" textAnchor="middle">SEA</text>
            <text x="530" y="400" fontFamily="Georgia,serif" fontSize="10" fill={dark ? '#60a5fa' : '#1e40af'} fontStyle="italic" opacity="0.6" textAnchor="middle">BAY OF</text>
            <text x="530" y="416" fontFamily="Georgia,serif" fontSize="10" fill={dark ? '#60a5fa' : '#1e40af'} fontStyle="italic" opacity="0.6" textAnchor="middle">BENGAL</text>
            <text x="300" y="660" fontFamily="Georgia,serif" fontSize="10" fill={dark ? '#60a5fa' : '#1e40af'} fontStyle="italic" opacity="0.6" textAnchor="middle">INDIAN OCEAN</text>

            {/* Tooltip inside SVG */}
            {hovData && hovered && (
              <foreignObject
                x={Math.min(Math.max(tipPos.x - 90, 5), MAP_W - 185)}
                y={Math.max(tipPos.y - 115, 5)}
                width="180"
                height="110">
                <div
                  style={{ fontFamily: 'Poppins,sans-serif', animation: 'fadeUp 0.15s ease both' }}
                  className="bg-[#1a237e] text-white rounded-xl px-3 py-2.5 shadow-2xl border-2 border-white/30 pointer-events-none">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span style={{ fontSize: 16 }}>{PARTY[hovData.rulingParty]?.symbol || '📍'}</span>
                    <p style={{ fontWeight: 800, fontSize: 11, color: '#FF9933', lineHeight: 1.2 }}>{hovKey}</p>
                  </div>
                  <p style={{ fontSize: 9.5, lineHeight: 1.7, opacity: 0.92 }}>
                    🏛️ {hovData.rulingParty}<br />
                    👤 {hovData.cm}<br />
                    📅 {hovData.nextElection}
                  </p>
                  <p style={{ fontSize: 8, opacity: 0.4, marginTop: 4 }}>Click for full details</p>
                </div>
              </foreignObject>
            )}
          </svg>

          <p className={`text-center text-[0.62rem] py-2 px-4 ${dark ? 'text-slate-700' : 'text-slate-400'}`}>
            * Political map of India with accurate state boundaries. Hover to preview · Click for details.
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
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg border-2 border-white/40 flex-shrink-0"
                    style={{ background: PARTY[selectedData.rulingParty]?.fill || '#e0e7ff' }}>
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
                {isHindi
                  ? 'मानचित्र पर किसी भी राज्य पर क्लिक करें'
                  : 'Hover to preview, click to see CM, ruling party & next election'}
              </p>
              <div className={`mt-4 rounded-xl p-3 text-left ${dark ? 'bg-white/5' : 'bg-[#f0f4ff]'}`}>
                <p className={`text-[0.65rem] font-extrabold uppercase tracking-widest mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Party Colors</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {uniqueParties.slice(0, 8).map(party => {
                    const p = PARTY[party]
                    return (
                      <div key={party} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0 border border-black/10" style={{ background: p.fill }} />
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
          States colored by ruling party. Hover to preview, click for full details. Verify with{' '}
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:opacity-80">eci.gov.in</a>.
          <p className={`text-[0.72rem] mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            🕐 Last updated: April 2026 · Map boundaries are indicative (GeoJSON public domain data)
          </p>
        </div>
      </div>
    </section>
  )
}
