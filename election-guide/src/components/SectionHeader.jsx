export default function SectionHeader({ tag, title, subtitle, dark }) {
  return (
    <div className="mb-10">
      <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]
        px-3 py-1.5 rounded-full mb-3 border transition-colors duration-200
        ${dark
          ? 'bg-[#1a237e]/80 text-[#FF9933] border-[#283593]'
          : 'bg-[#1a237e] text-white border-[#283593]'
        }`}>
        {tag}
      </span>
      <h2 className={`text-[clamp(1.65rem,3vw,2.1rem)] font-black leading-tight tracking-[-0.04em]
        ${dark ? 'text-white' : 'text-[#1a237e]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2.5 text-[0.97rem] leading-relaxed max-w-2xl
          ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
