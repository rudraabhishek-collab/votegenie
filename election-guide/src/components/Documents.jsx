import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'

export default function Documents({ dark }) {
  const { t } = useTranslation()
  const items = t('documents.items', { returnObjects: true })

  return (
    <section id="documents" className="scroll-mt-20" aria-labelledby="docs-h">
      <SectionHeader tag={t('documents.tag')} title={t('documents.title')} subtitle={t('documents.subtitle')} dark={dark} />
      <div className={`overflow-x-auto rounded-2xl border shadow-card ${dark ? 'border-violet-900/20' : 'border-indigo-100'}`}>
        <table className="w-full text-[0.88rem]" aria-label="Required documents">
          <thead>
            <tr className={dark ? 'bg-white/5' : 'bg-slate-50'}>
              {[t('documents.colDocument'), t('documents.colPurpose'), t('documents.colStatus')].map(h => (
                <th key={h} className={`text-left px-5 py-3.5 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] border-b
                  ${dark ? 'text-slate-500 border-white/5' : 'text-slate-400 border-indigo-50'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((doc, i) => (
              <tr key={i} className={`border-b last:border-0 transition-colors
                ${dark ? 'border-white/5 hover:bg-white/5' : 'border-indigo-50 hover:bg-slate-50'}`}>
                <td className={`px-5 py-4 font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{doc.name}</td>
                <td className={`px-5 py-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{doc.purpose}</td>
                <td className="px-5 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[0.7rem] font-extrabold tracking-wide border
                    ${doc.status === 'required'
                      ? dark ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200'
                      : dark ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
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
