import { useTranslation } from 'react-i18next'

export default function JourneyTracker({ currentStep, onStepClick, dark }) {
  const { t } = useTranslation()
  const steps = t('journey.steps', { returnObjects: true })

  return (
    <div className={`border-b px-6 py-5 transition-colors duration-300
      ${dark ? 'bg-gray-950/80 border-violet-900/20' : 'bg-white/90 border-indigo-100/60'} backdrop-blur-sm`}
      aria-label={t('journey.label')}>
      <div className="max-w-5xl mx-auto">
        <p className={`text-[0.68rem] font-extrabold uppercase tracking-[0.12em] mb-4 ${dark ? 'text-slate-600' : 'text-slate-600'}`}>
          {t('journey.label')}
        </p>
        <div className="flex items-center overflow-x-auto pb-1 scrollbar-thin" role="list">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center flex-1 min-w-0">
              <button role="listitem" onClick={() => onStepClick(i)}
                aria-label={`Step ${i + 1}: ${label.replace('\n', ' ')}`}
                className="flex flex-col items-center gap-1.5 flex-1 min-w-[72px] group transition-all duration-200">
                <div className={`relative w-9 h-9 rounded-full flex items-center justify-center text-[0.72rem] font-extrabold
                  transition-all duration-300
                  ${i < currentStep
                    ? 'bg-gradient-to-br from-[#FF9933] to-[#f97316] text-white shadow-[0_4px_16px_rgba(255,153,51,0.5)]'
                    : i === currentStep
                      ? `border-2 border-[#FF9933] shadow-[0_0_0_5px_rgba(255,153,51,0.2)] ${dark ? 'bg-indigo-950 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`
                      : `border-2 ${dark ? 'border-slate-700 bg-gray-900 text-slate-600' : 'border-slate-200 bg-white text-slate-600'}`
                  } group-hover:scale-110 group-hover:shadow-glow`}>
                  {i < currentStep ? <span className="animate-[scaleIn_0.3s_ease_both]">✓</span> : i + 1}
                  {i === currentStep && (
                    <span className="absolute inset-0 rounded-full border-2 border-[#FF9933] animate-ping opacity-30" />
                  )}
                </div>
                <span className={`text-[0.67rem] font-semibold text-center leading-tight whitespace-pre-line transition-colors duration-200
                  ${i === currentStep ? 'text-[#FF9933] font-extrabold'
                    : i < currentStep ? dark ? 'text-indigo-400/70' : 'text-indigo-400'
                    : dark ? 'text-slate-600' : 'text-slate-600'}`}>
                  {label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 min-w-4 mx-1 rounded-full overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div className={`h-full rounded-full transition-all duration-700 ease-out
                    ${i < currentStep ? 'w-full bg-gradient-to-r from-[#FF9933] to-[#1a237e]' : 'w-0'}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
