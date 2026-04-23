import { journeySteps } from '../data'

export default function JourneyTracker({ currentStep, onStepClick, dark }) {
  return (
    <div
      className={`border-b px-6 py-5 transition-colors duration-300
        ${dark ? 'bg-gray-950/80 border-violet-900/20' : 'bg-white/90 border-indigo-100/60'}
        backdrop-blur-sm`}
      aria-label="Your voter journey">
      <div className="max-w-5xl mx-auto">
        <p className={`text-[0.68rem] font-extrabold uppercase tracking-[0.12em] mb-4
          ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
          Your Voter Journey
        </p>

        <div className="flex items-center overflow-x-auto pb-1 scrollbar-thin" role="list">
          {journeySteps.map((step, i) => (
            <div key={i} className="flex items-center flex-1 min-w-0">
              <button
                role="listitem"
                onClick={() => onStepClick(i)}
                aria-label={`Step ${i + 1}: ${step.label.replace('\n', ' ')}`}
                className="flex flex-col items-center gap-1.5 flex-1 min-w-[72px] group transition-all duration-200">

                {/* Dot */}
                <div className={`relative w-9 h-9 rounded-full flex items-center justify-center text-[0.72rem] font-extrabold
                  transition-all duration-300 ease-spring
                  ${i < currentStep
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow'
                    : i === currentStep
                      ? `border-2 border-indigo-500 shadow-[0_0_0_5px_rgba(99,102,241,0.15)]
                         ${dark ? 'bg-indigo-950 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`
                      : `border-2 ${dark ? 'border-slate-700 bg-gray-900 text-slate-600' : 'border-slate-200 bg-white text-slate-400'}`
                  }
                  group-hover:scale-110 group-hover:shadow-glow`}>

                  {i < currentStep
                    ? <span className="animate-[scaleIn_0.3s_ease_both]">✓</span>
                    : i + 1
                  }

                  {/* Pulse ring on active */}
                  {i === currentStep && (
                    <span className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-30" />
                  )}
                </div>

                <span className={`text-[0.67rem] font-semibold text-center leading-tight whitespace-pre-line transition-colors duration-200
                  ${i === currentStep
                    ? 'text-indigo-500 font-extrabold'
                    : i < currentStep
                      ? dark ? 'text-indigo-400/70' : 'text-indigo-400'
                      : dark ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                  {step.label}
                </span>
              </button>

              {/* Connector */}
              {i < journeySteps.length - 1 && (
                <div className={`flex-1 h-0.5 min-w-4 mx-1 rounded-full overflow-hidden
                  ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div className={`h-full rounded-full transition-all duration-700 ease-out
                    ${i < currentStep
                      ? 'w-full bg-gradient-to-r from-indigo-500 to-violet-500'
                      : 'w-0'
                    }`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
