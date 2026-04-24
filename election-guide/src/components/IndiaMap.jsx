import { useState } from 'react'
import { stateData } from '../data/stateData'
import { useTranslation } from 'react-i18next'

// Simplified India map with major state paths (approximate SVG paths)
// Each state has an id matching stateData keys
const STATE_PATHS = [
  { id: 'Jammu & Kashmir',   d: 'M 155 28 L 175 22 L 195 30 L 200 50 L 185 58 L 170 55 L 158 45 Z', cx: 178, cy: 42 },
  { id: 'Himachal Pradesh',  d: 'M 175 58 L 195 52 L 205 65 L 195 75 L 178 72 Z', cx: 191, cy: 65 },
  { id: 'Punjab',            d: 'M 155 60 L 175 58 L 178 72 L 165 78 L 150 72 Z', cx: 164, cy: 68 },
  { id: 'Uttarakhand',       d: 'M 195 75 L 215 68 L 225 80 L 215 90 L 198 88 Z', cx: 210, cy: 80 },
  { id: 'Haryana',           d: 'M 165 78 L 178 72 L 195 75 L 198 88 L 185 95 L 168 90 Z', cx: 182, cy: 85 },
  { id: 'Delhi',             d: 'M 183 90 L 190 88 L 192 95 L 185 97 Z', cx: 187, cy: 93 },
  { id: 'Rajasthan',         d: 'M 130 80 L 165 78 L 168 90 L 185 95 L 188 120 L 175 145 L 148 148 L 125 130 L 118 105 Z', cx: 155, cy: 115 },
  { id: 'Uttar Pradesh',     d: 'M 185 95 L 225 80 L 255 88 L 268 105 L 260 125 L 240 135 L 215 138 L 195 130 L 188 120 Z', cx: 228, cy: 112 },
  { id: 'Bihar',             d: 'M 260 125 L 285 118 L 298 130 L 292 148 L 270 152 L 255 142 Z', cx: 277, cy: 136 },
  { id: 'Jharkhand',         d: 'M 270 152 L 292 148 L 300 162 L 290 178 L 268 175 L 260 162 Z', cx: 280, cy: 163 },
  { id: 'West Bengal',       d: 'M 298 130 L 318 125 L 325 145 L 318 168 L 305 178 L 290 178 L 300 162 L 292 148 Z', cx: 308, cy: 152 },
  { id: 'Sikkim',            d: 'M 318 118 L 328 115 L 330 125 L 320 128 Z', cx: 324, cy: 121 },
  { id: 'Assam',             d: 'M 325 130 L 355 125 L 365 138 L 355 150 L 330 148 L 322 140 Z', cx: 344, cy: 138 },
  { id: 'Arunachal Pradesh', d: 'M 340 108 L 375 105 L 380 122 L 355 125 L 330 118 Z', cx: 358, cy: 115 },
  { id: 'Nagaland',          d: 'M 355 150 L 370 145 L 375 158 L 362 162 L 352 158 Z', cx: 363, cy: 154 },
  { id: 'Manipur',           d: 'M 362 162 L 375 158 L 378 172 L 365 178 L 358 172 Z', cx: 368, cy: 168 },
  { id: 'Mizoram',           d: 'M 355 175 L 368 172 L 370 185 L 358 188 L 350 182 Z', cx: 360, cy: 180 },
  { id: 'Tripura',           d: 'M 340 168 L 352 165 L 355 175 L 345 180 L 336 175 Z', cx: 346, cy: 173 },
  { id: 'Meghalaya',         d: 'M 325 148 L 345 145 L 348 158 L 335 162 L 322 158 Z', cx: 335, cy: 153 },
  { id: 'Odisha',            d: 'M 260 162 L 290 178 L 295 200 L 280 218 L 258 215 L 245 195 L 248 175 Z', cx: 270, cy: 193 },
  { id: 'Chhattisgarh',      d: 'M 215 138 L 255 142 L 260 162 L 248 175 L 230 178 L 210 165 L 205 148 Z', cx: 233, cy: 158 },
  { id: 'Madhya Pradesh',    d: 'M 175 145 L 215 138 L 205 148 L 210 165 L 195 172 L 170 168 L 155 155 L 148 148 Z', cx: 183, cy: 155 },
  { id: 'Gujarat',           d: 'M 118 105 L 148 148 L 140 168 L 118 175 L 100 165 L 88 148 L 92 125 L 108 112 Z', cx: 118, cy: 145 },
  { id: 'Maharashtra',       d: 'M 148 148 L 175 145 L 170 168 L 155 155 L 155 178 L 140 195 L 118 195 L 108 178 L 118 175 L 140 168 Z', cx: 148, cy: 175 },
  { id: 'Telangana',         d: 'M 195 172 L 210 165 L 225 175 L 228 195 L 215 205 L 198 200 L 190 188 Z', cx: 210, cy: 188 },
  { id: 'Andhra Pradesh',    d: 'M 198 200 L 215 205 L 228 195 L 238 210 L 230 228 L 210 235 L 192 228 L 185 215 Z', cx: 212, cy: 215 },
  { id: 'Karnataka',         d: 'M 140 195 L 155 178 L 190 188 L 198 200 L 185 215 L 175 228 L 155 232 L 135 220 L 128 205 Z', cx: 162, cy: 210 },
  { id: 'Goa',               d: 'M 128 205 L 138 202 L 140 212 L 130 215 Z', cx: 134, cy: 209 },
  { id: 'Kerala',            d: 'M 155 232 L 165 228 L 168 248 L 158 262 L 148 258 L 145 242 Z', cx: 157, cy: 247 },
  { id: 'Tamil Nadu',        d: 'M 175 228 L 192 228 L 200 248 L 195 268 L 178 275 L 162 268 L 158 248 L 165 228 Z', cx: 180, cy: 250 },
  { id: 'Puducherry',        d: 'M 192 248 L 198 246 L 200 254 L 194 256 Z', cx: 196, cy: 251 },
]

function Tooltip({ state, data, x, y }) {
  if (!state || !data) return null
  return (
    <div className="absolute z-30 pointer-events-none"
      style={{ left: x, top: y, transform: 'translate(-50%, -110%)' }}>
      <div className="bg-[#1a237e] text-white rounded-xl px-3 py-2.5 shadow-xl border border-white/20 min-w-[160px]"
        style={{ animation: 'fadeUp 0.2s ease both' }}>
        <p className="font-black text-[0.82rem] mb-1.5 text-[#FF9933]">{state}</p>
        <p className="text-[0.72rem] leading-relaxed opacity-90">
          📅 {data.nextElection}<br/>
          👤 {data.cm}<br/>
          🏛️ {data.rulingParty}
        </p>
        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1a237e] rotate-45 border-r border-b border-white/20" />
      </div>
    </div>
  )
}

export default function IndiaMap({ dark, onStateSelect }) {
  const { i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e, stateId) => {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect()
    const svgEl = e.currentTarget.closest('svg')
    const pt = svgEl.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const svgP = pt.matrixTransform(svgEl.getScreenCTM().inverse())
    setTooltipPos({ x: svgP.x, y: svgP.y })
    setHovered(stateId)
  }

  const handleClick = (stateId) => {
    setSelected(stateId)
    if (onStateSelect) onStateSelect(stateId)
  }

  const getStateFill = (stateId) => {
    const isHov = hovered === stateId
    const isSel = selected === stateId
    const d = stateData[stateId]
    if (!d) return dark ? '#1e2a5e' : '#c5cae9'
    const partyColors = {
      BJP: isHov || isSel ? '#ff6d00' : dark ? '#b45309' : '#fed7aa',
      INC: isHov || isSel ? '#1565c0' : dark ? '#1e40af' : '#bfdbfe',
      TMC: isHov || isSel ? '#15803d' : dark ? '#166534' : '#bbf7d0',
      AAP: isHov || isSel ? '#0284c7' : dark ? '#075985' : '#bae6fd',
      DMK: isHov || isSel ? '#b91c1c' : dark ? '#991b1b' : '#fecaca',
      default: isHov || isSel ? '#7c3aed' : dark ? '#3730a3' : '#ddd6fe',
    }
    return partyColors[d.rulingParty] || partyColors.default
  }

  const selectedData = selected ? stateData[selected] : null

  return (
    <section id="indiamap" className="scroll-mt-20">
      {/* Header */}
      <div className="mb-8">
        <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]
          px-3 py-1.5 rounded-full mb-3 border ${dark ? 'bg-[#1a237e]/80 text-[#FF9933] border-[#283593]' : 'bg-[#1a237e] text-white border-[#283593]'}`}>
          🗺️ {isHindi ? 'राज्य अन्वेषण' : 'Explore by State'}
        </span>
        <h2 className={`text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
          {isHindi ? 'भारत के चुनाव — राज्यवार' : 'Elections Across India'}
        </h2>
        <p className={`mt-1.5 text-[0.9rem] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {isHindi ? 'किसी भी राज्य पर क्लिक करें — CM, पार्टी और अगला चुनाव देखें' : 'Click any state to see CM, ruling party & next election date'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Map */}
        <div className={`relative flex-1 rounded-2xl border overflow-hidden ${dark ? 'bg-[#0d1757] border-[#283593]/40' : 'bg-[#e8eaf6] border-[#1a237e]/15'}`}>
          {/* Party legend */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            {[
              { party: 'BJP', color: dark ? '#b45309' : '#fed7aa', label: 'BJP' },
              { party: 'INC', color: dark ? '#1e40af' : '#bfdbfe', label: 'INC' },
              { party: 'TMC', color: dark ? '#166534' : '#bbf7d0', label: 'TMC' },
              { party: 'AAP', color: dark ? '#075985' : '#bae6fd', label: 'AAP' },
              { party: 'DMK', color: dark ? '#991b1b' : '#fecaca', label: 'DMK' },
            ].map(l => (
              <div key={l.party} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                <span className={`text-[0.6rem] font-bold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{l.label}</span>
              </div>
            ))}
          </div>

          <svg viewBox="80 20 310 270" className="w-full" style={{ minHeight: 320 }}
            onMouseLeave={() => setHovered(null)}>
            {STATE_PATHS.map(s => (
              <g key={s.id}>
                <path
                  d={s.d}
                  fill={getStateFill(s.id)}
                  stroke={dark ? '#1a237e' : '#ffffff'}
                  strokeWidth={selected === s.id ? 2 : 0.8}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={e => handleMouseMove(e, s.id)}
                  onMouseMove={e => handleMouseMove(e, s.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleClick(s.id)}
                  style={{ filter: selected === s.id ? 'drop-shadow(0 0 4px rgba(255,153,51,0.8))' : 'none' }}
                />
                {/* State abbreviation label for larger states */}
                {['Rajasthan','Madhya Pradesh','Maharashtra','Uttar Pradesh','Karnataka','Andhra Pradesh','Tamil Nadu','Gujarat','Odisha','West Bengal'].includes(s.id) && (
                  <text x={s.cx} y={s.cy} textAnchor="middle" dominantBaseline="middle"
                    fontSize="5.5" fontWeight="700" fill={dark ? 'rgba(255,255,255,0.7)' : 'rgba(26,35,126,0.8)'}
                    className="pointer-events-none select-none">
                    {s.id.split(' ').map(w => w[0]).join('').slice(0,2)}
                  </text>
                )}
              </g>
            ))}

            {/* Tooltip rendered inside SVG as foreignObject */}
            {hovered && stateData[hovered] && (
              <foreignObject x={tooltipPos.x - 80} y={tooltipPos.y - 90} width="160" height="90">
                <div className="bg-[#1a237e] text-white rounded-xl px-3 py-2 shadow-xl border border-white/20 text-left"
                  style={{ fontSize: 10 }}>
                  <p style={{ fontWeight: 800, color: '#FF9933', marginBottom: 4 }}>{hovered}</p>
                  <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
                    📅 {stateData[hovered].nextElection}<br/>
                    👤 {stateData[hovered].cm}<br/>
                    🏛️ {stateData[hovered].rulingParty}
                  </p>
                </div>
              </foreignObject>
            )}
          </svg>

          <p className={`text-center text-[0.65rem] pb-2 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
            * Approximate map for illustration. Not to scale.
          </p>
        </div>

        {/* State detail panel */}
        <div className="lg:w-72 w-full">
          {selectedData ? (
            <div className={`rounded-2xl border overflow-hidden shadow-card-hover ${dark ? 'bg-gray-900 border-[#283593]/40' : 'bg-white border-[#1a237e]/15'}`}
              style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <div className="h-[3px] bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#FF9933]" />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a237e] to-[#7c3aed] flex items-center justify-center text-xl">🗺️</div>
                  <div>
                    <h3 className={`font-black text-[1rem] ${dark ? 'text-white' : 'text-[#1a237e]'}`}>{selected}</h3>
                    <p className={`text-[0.72rem] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{selectedData.capital}</p>
                  </div>
                </div>
                {[
                  { icon: '📅', label: 'Next Election', value: selectedData.nextElection, highlight: true },
                  { icon: '🗳️', label: 'Last Election', value: selectedData.lastElection },
                  { icon: '👤', label: 'Chief Minister', value: selectedData.cm, highlight: true },
                  { icon: '🏛️', label: 'Ruling Party', value: selectedData.rulingAlliance },
                  { icon: '⚔️', label: 'Opposition', value: selectedData.oppositionParty },
                  { icon: '📊', label: 'Recent Result', value: selectedData.recentResult },
                ].map(row => (
                  <div key={row.label} className={`flex items-start gap-2.5 py-2 border-b last:border-0 ${dark ? 'border-white/[0.05]' : 'border-slate-100'}`}>
                    <span className="text-base flex-shrink-0 mt-0.5">{row.icon}</span>
                    <div>
                      <p className={`text-[0.65rem] font-extrabold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{row.label}</p>
                      <p className={`text-[0.85rem] font-semibold ${row.highlight ? (dark ? 'text-[#FF9933]' : 'text-[#1a237e]') : (dark ? 'text-slate-200' : 'text-gray-700')}`}>{row.value}</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => { document.getElementById('stateinfo')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="mt-4 w-full py-2.5 rounded-xl font-bold text-[0.82rem] text-white bg-gradient-to-r from-[#1a237e] to-[#7c3aed] hover:-translate-y-0.5 transition-all">
                  View Full Details →
                </button>
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl border p-6 text-center ${dark ? 'bg-gray-900 border-[#283593]/40' : 'bg-white border-[#1a237e]/15'}`}>
              <div className="text-4xl mb-3">🗺️</div>
              <p className={`font-bold text-[0.9rem] mb-1 ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
                {isHindi ? 'राज्य चुनें' : 'Click a state'}
              </p>
              <p className={`text-[0.8rem] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {isHindi ? 'मानचित्र पर किसी भी राज्य पर क्लिक करें' : 'Click any state on the map to see election details'}
              </p>
              {/* Party color guide */}
              <div className={`mt-4 rounded-xl p-3 text-left ${dark ? 'bg-white/5' : 'bg-[#f0f4ff]'}`}>
                <p className={`text-[0.65rem] font-extrabold uppercase tracking-widest mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Color = Ruling Party</p>
                <div className="grid grid-cols-2 gap-1">
                  {[['🟠','BJP'],['🔵','INC'],['🟢','TMC'],['🩵','AAP'],['🔴','DMK'],['🟣','Others']].map(([c,p]) => (
                    <span key={p} className={`text-[0.72rem] font-semibold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{c} {p}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Last updated */}
          <p className={`mt-3 text-[0.68rem] text-center ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
            🕐 Last updated: April 2026 · Data is indicative
          </p>
        </div>
      </div>
    </section>
  )
}
