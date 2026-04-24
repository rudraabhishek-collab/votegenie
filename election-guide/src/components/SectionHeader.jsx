export default function SectionHeader({ tag, title, subtitle, dark }) {
  return (
    <div className="mb-10 relative">
      {/* Ashoka Chakra watermark */}
      <div aria-hidden className="absolute -top-4 -right-4 pointer-events-none opacity-[0.04]">
        <svg viewBox="0 0 200 200" className="w-32 h-32">
          <circle cx="100" cy="100" r="92" fill="none" stroke="#0B1E3C" strokeWidth="3"/>
          <circle cx="100" cy="100" r="12" fill="#0B1E3C"/>
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * 15 - 90) * Math.PI / 180
            const x1 = 100 + 20 * Math.cos(a), y1 = 100 + 20 * Math.sin(a)
            const x2 = 100 + 90 * Math.cos(a), y2 = 100 + 90 * Math.sin(a)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0B1E3C" strokeWidth="2.5"/>
          })}
        </svg>
      </div>

      <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]
        px-3 py-1.5 rounded-full mb-3 border transition-colors duration-200
        ${dark
          ? 'bg-[#FF6A00]/20 text-[#FF9933] border-[#FF6A00]/30'
          : 'bg-[#0B1E3C] text-white border-transparent shadow-sm'
        }`}>
        {tag}
      </span>
      <h2 className={`text-[clamp(1.4rem,4vw,2.1rem)] font-black leading-tight tracking-[-0.04em]
        ${dark ? 'text-white' : 'text-[#0B1E3C]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2.5 text-[0.97rem] leading-relaxed max-w-2xl
          ${dark ? 'text-slate-300' : 'text-[#0B1E3C]/65'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
