export default function SectionHeader({ tag, title, subtitle, dark }) {
  return (
    <div className="mb-10">
      <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]
        px-3 py-1.5 rounded-full mb-3 border transition-colors duration-200
        ${dark
          ? 'bg-[#FF9933]/20 text-[#FF9933] border-[#FF9933]/30'
          : 'bg-gradient-to-r from-[#FF9933] to-[#f97316] text-white border-transparent shadow-sm'
        }`}>
        {tag}
      </span>
      <h2 className={`text-[clamp(1.65rem,3vw,2.1rem)] font-black leading-tight tracking-[-0.04em]
        ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2.5 text-[0.97rem] leading-relaxed max-w-2xl
          ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
