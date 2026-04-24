import { useState, useRef } from 'react'
import { stateData } from '../data/stateData'
import { STATE_PATHS } from '../data/indiaPaths'
import { useTranslation } from 'react-i18next'

// ─── Party color map ───────────────────────────────────────────────────────
const PARTY_COLORS = {
  BJP:     { fill: '#fb923c', fillDark: '#c2410c', hover: '#f97316', label: 'BJP',  dot: '#fb923c' },
  INC:     { fill: '#60a5fa', fillDark: '#1d4ed8', hover: '#3b82f6', label: 'INC',  dot: '#60a5fa' },
  TMC:     { fill: '#4ade80', fillDark: '#15803d', hover: '#22c55e', label: 'TMC',  dot: '#4ade80' },
  AAP:     { fill: '#38bdf8', fillDark: '#0369a1', hover: '#0ea5e9', label: 'AAP',  dot: '#38bdf8' },
  DMK:     { fill: '#f87171', fillDark: '#b91c1c', hover: '#ef4444', label: 'DMK',  dot: '#f87171' },
  JMM:     { fill: '#a3e635', fillDark: '#4d7c0f', hover: '#84cc16', label: 'JMM',  dot: '#a3e635' },
  NC:      { fill: '#34d399', fillDark: '#065f46', hover: '#10b981', label: 'NC',   dot: '#34d399' },
  NPP:     { fill: '#fbbf24', fillDark: '#92400e', hover: '#f59e0b', label: 'NPP',  dot: '#fbbf24' },
  ZPM:     { fill: '#c084fc', fillDark: '#6b21a8', hover: '#a855f7', label: 'ZPM',  dot: '#c084fc' },
  SKM:     { fill: '#f9a8d4', fillDark: '#9d174d', hover: '#ec4899', label: 'SKM',  dot: '#f9a8d4' },
  TDP:     { fill: '#fde68a', fillDark: '#92400e', hover: '#fbbf24', label: 'TDP',  dot: '#fde68a' },
  NDPP:    { fill: '#6ee7b7', fillDark: '#065f46', hover: '#34d399', label: 'NDPP', dot: '#6ee7b7' },
  AINRC:   { fill: '#fdba74', fillDark: '#9a3412', hover: '#fb923c', label: 'AINRC',dot: '#fdba74' },
  default: { fill: '#a5b4fc', fillDark: '#3730a3', hover: '#818cf8', label: '—',    dot: '#a5b4fc' },
}

function getColor(partyCode, dark, isHovered, isSelected) {
  const c = PARTY_COLORS[partyCode] || PARTY_COLORS.default
  if (isSelected) return '#FF9933'
  if (isHovered)  return c.hover
  return dark ? c.fillDark : c.fill
}

// ─── Tooltip ───────────────────────────────────────────────────────────────
function MapTooltip({ stateId, x, y, dark }) {
  const d = stateData[stateId]
  if (!d) return null
  return (
    <g>
      <foreignObject x={Math.min(x - 85, 330)} y={Math.max(y - 105, 5)} width="170" height="100">
        <div
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="bg-[#1a237e] text-white rounded-xl px-3 py-2.5 shadow-2xl border border-white/25 pointer-events-none">
          <p style={{ fontWeight: 800, fontSize: 11, color: '#FF9933', marginBottom: 5 }}>{stateId}</p>
          <p style={{ fontSize: 9.5, lineHeight: 1.7, opacity: 0.9 }}>
            📅 {d.nextElection}<br />
            👤 {d.cm}<br />
            🏛️ {d.rulingParty}
          </p>
        </div>
      </foreignObject>
    </g>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
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

  const selectedData = selected ? stateData[selected] : null

  // Unique parties present in data
  const partiesPresent = [...new Set(
    Object.values(stateData).map(d => d.rulingParty).filter(Boolean)
  )].slice(0, 8)

  return (
    <section id="indiamap" className="scroll-mt-20">
      {/* Header */}
      <div className="mb-8">
        <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]
          px-3 py-1.5 rounded-full mb-3 border
          ${dark ? 'bg-[#1a237e]/80 text-[#FF9933] border-[#283593]' : 'bg-[#1a237e] text-white border-[#283593]'}`}>
          🗺️ {isHindi ? 'राज्यवार चुनाव' : 'Explore by State'}
        </span>
        <h2 className={`text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
          {isHindi ? 'भारत का चुनाव मानचित्र' : 'India Election Map'}
        </h2>
        <p className={`mt-1.5 text-[0.9rem] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {isHindi
            ? 'किसी भी राज्य पर क्लिक करें — CM, पार्टी और अगला चुनाव देखें'
            : 'Click any state to see Chief Minister, ruling party & next election date'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── SVG Map ─────────────────────────────────────────────────────── */}
        <div className={`relative flex-1 rounded-2xl border overflow-hidden
          ${dark ? 'bg-[#0a0e1f] border-[#283593]/50' : 'bg-[#e8eaf6] border-[#1a237e]/20'}`}>

          {/* Party legend — top-left */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 bg-white/80 dark:bg-[#0d1757]/90 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-[#1a237e]/15 dark:border-white/10 shadow-sm">
            <p className={`text-[0.58rem] font-extrabold uppercase tracking-widest mb-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              Ruling Party
            </p>
            {partiesPresent.map(party => {
              const c = PARTY_COLORS[party] || PARTY_COLORS.default
              return (
                <div key={party} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: dark ? c.fillDark : c.fill }} />
                  <span className={`text-[0.62rem] font-bold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{party}</span>
                </div>
              )
            })}
            <div className="flex items-center gap-1.5 mt-0.5 pt-1.5 border-t border-slate-200 dark:border-white/10">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0 bg-[#FF9933]" />
              <span className={`text-[0.62rem] font-bold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Selected</span>
            </div>
          </div>

          <svg
            ref={svgRef}
            viewBox="60 15 380 310"
            className="w-full"
            style={{ minHeight: 340 }}
            onMouseLeave={() => setHovered(null)}>

            {/* Ocean background */}
            <rect x="60" y="15" width="380" height="310" fill={dark ? '#0a0e1f' : '#dbeafe'} />

            {/* State paths */}
            {STATE_PATHS.map(s => {
              const d = stateData[s.id]
              const party = d?.rulingParty
              const isHov = hovered === s.id
              const isSel = selected === s.id
              const fill = getColor(party, dark, isHov, isSel)
              const stroke = dark ? '#1e3a8a' : '#ffffff'
              const strokeW = isSel ? 2.5 : isHov ? 1.8 : 1

              return (
                <g key={s.id}>
                  {/* Drop shadow for selected */}
                  {isSel && (
                    <path d={s.d} fill="rgba(255,153,51,0.3)" transform="translate(2,2)" />
                  )}
                  <path
                    d={s.d}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeW}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-150"
                    style={{
                      filter: isSel
                        ? 'drop-shadow(0 0 6px rgba(255,153,51,0.9))'
                        : isHov
                          ? 'drop-shadow(0 0 3px rgba(255,255,255,0.4)) brightness(1.15)'
                          : 'none',
                    }}
                    onMouseEnter={e => handleMouseMove(e, s.id)}
                    onMouseMove={e => handleMouseMove(e, s.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleClick(s.id)}
                  />
                  {/* State label for larger states */}
                  {s.showLabel && (
                    <text
                      x={s.cx} y={s.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="5"
                      fontWeight="700"
                      fontFamily="Poppins, sans-serif"
                      fill={dark ? 'rgba(255,255,255,0.75)' : 'rgba(26,35,126,0.85)'}
                      className="pointer-events-none select-none">
                      {s.abbr || s.id.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Tooltip */}
            {hovered && stateData[hovered] && (
              <MapTooltip stateId={hovered} x={tipPos.x} y={tipPos.y} dark={dark} />
            )}
          </svg>

          {/* Disclaimer */}
          <p className={`text-center text-[0.62rem] pb-2 px-4 ${dark ? 'text-slate-700' : 'text-slate-400'}`}>
            * Simplified map for illustration. Boundaries are approximate and not to scale.
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
                {/* State header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a237e] to-[#7c3aed] flex items-center justify-center text-xl shadow-glow flex-shrink-0">
                    🗺️
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-black text-[1rem] leading-tight ${dark ? 'text-white' : 'text-[#1a237e]'}`}>{selected}</h3>
                    <p className={`text-[0.72rem] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Capital: {selectedData.capital} · {selectedData.seats > 0 ? `${selectedData.seats} seats` : 'UT'}
                    </p>
                  </div>
                  {/* Party badge */}
                  <span className="ml-auto flex-shrink-0 px-2 py-1 rounded-lg text-[0.65rem] font-extrabold"
                    style={{
                      background: dark
                        ? (PARTY_COLORS[selectedData.rulingParty]?.fillDark || '#3730a3')
                        : (PARTY_COLORS[selectedData.rulingParty]?.fill || '#a5b4fc'),
                      color: dark ? '#fff' : '#1a237e'
                    }}>
                    {selectedData.rulingParty}
                  </span>
                </div>

                {/* Data rows */}
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
                      <p className={`text-[0.62rem] font-extrabold uppercase tracking-widest ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
                        {row.label}
                      </p>
                      <p className={`text-[0.83rem] font-semibold leading-snug break-words
                        ${row.hi
                          ? dark ? 'text-[#FF9933]' : 'text-[#1a237e]'
                          : dark ? 'text-slate-200' : 'text-gray-700'
                        }`}>
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
                  : 'Tap a state on the map to see its election details, CM, and ruling party'}
              </p>
            </div>
          )}

          {/* Quick stats */}
          <div className={`rounded-2xl border p-4 ${dark ? 'bg-[#0d1757]/60 border-[#283593]/40' : 'bg-[#e8eaf6] border-[#1a237e]/15'}`}>
            <p className={`text-[0.65rem] font-extrabold uppercase tracking-widest mb-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              India at a Glance
            </p>
            {[
              { label: 'Total States', value: '28' },
              { label: 'Union Territories', value: '8' },
              { label: 'Lok Sabha Seats', value: '543' },
              { label: 'Registered Voters', value: '96.8 Cr' },
            ].map(s => (
              <div key={s.label} className={`flex justify-between items-center py-1.5 border-b last:border-0 ${dark ? 'border-white/[0.05]' : 'border-[#1a237e]/10'}`}>
                <span className={`text-[0.78rem] ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{s.label}</span>
                <span className={`text-[0.82rem] font-black ${dark ? 'text-[#FF9933]' : 'text-[#1a237e]'}`}>{s.value}</span>
              </div>
            ))}
          </div>

          <p className={`text-[0.65rem] text-center ${dark ? 'text-slate-700' : 'text-slate-400'}`}>
            🕐 Last updated: April 2026 · Data is indicative
          </p>
        </div>
      </div>
    </section>
  )
}
