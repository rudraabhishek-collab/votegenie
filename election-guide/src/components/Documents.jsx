import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'

export default function Documents({ dark }) {
  const { t } = useTranslation()
  const items = t('documents.items', { returnObjects: true })

  return (
    <section id="documents" className="scroll-mt-20" aria-labelledby="docs-h">
      <SectionHeader tag={t('documents.tag')} title={t('documents.title')} subtitle={t('documents.subtitle')} dark={dark} />
      <div className={`overflow-x-auto rounded-2xl border shadow-[0_4px_24px_rgba(11,30,60,0.18)]
        ${dark ? 'border-white/10' : 'border-[#0B1E3C]/10'}`}>
        <table className="w-full text-[0.88rem]" aria-label="Required documents">
          <thead>
            <tr className={dark ? 'bg-white/5' : 'bg-[#0B1E3C]'}>
              {[t('documents.colDocument'), t('documents.colPurpose'), t('documents.colStatus')].map(h => (
                <th key={h} className={`text-left px-5 py-3.5 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] border-b
                  ${dark ? 'text-slate-400 border-white/5' : 'text-white/70 border-white/10'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((doc, i) => (
              <tr key={i} className={`border-b last:border-0 transition-colors
                ${dark ? 'border-white/5 hover:bg-white/5 bg-[#0B1E3C]/60' : 'border-white/10 hover:bg-white/5 bg-[#0B1E3C]'}`}>
                <td className="px-5 py-4 font-bold text-white">{doc.name}</td>
                <td className="px-5 py-4 text-white/70">{doc.purpose}</td>
                <td className="px-5 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[0.7rem] font-extrabold tracking-wide border
                    ${doc.status === 'required'
                      ? 'bg-[#FF6A00]/20 text-[#FF9933] border-[#FF6A00]/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                    {doc.status === 'required' ? t('documents.required') : t('documents.optional')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
