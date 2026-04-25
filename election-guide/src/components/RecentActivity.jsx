/**
 * RecentActivity.jsx
 * Shows the last N eligibility checks fetched from Firestore.
 * Demonstrates real Google Firebase read usage in the UI.
 */
import { useState, useEffect, useCallback } from 'react'
import { getRecentChecks, isFirebaseConfigured } from '../services/firebase'

const RESULT_META = {
  eligible:   { label: 'Eligible',       color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30', dot: 'bg-emerald-400' },
  ineligible: { label: 'Not Eligible',   color: 'text-red-400',     bg: 'bg-red-500/20 border-red-500/30',         dot: 'bg-red-400'     },
  maybe:      { label: 'Check Required', color: 'text-amber-400',   bg: 'bg-amber-500/20 border-amber-500/30',     dot: 'bg-amber-400'   },
  error:      { label: 'Error',          color: 'text-slate-400',   bg: 'bg-slate-500/20 border-slate-500/30',     dot: 'bg-slate-400'   },
}

const CITIZENSHIP_LABEL = {
  citizen: '🇮🇳 Citizen',
  nri:     '🌍 NRI',
  foreign: '✈️ Foreign',
}

/** Format an ISO timestamp to a relative "X min ago" string. */
function timeAgo(iso) {
  if (!iso) return 'just now'
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function RecentActivity({ dark }) {
  const [records,  setRecords]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [lastFetch, setLastFetch] = useState(null)

  const configured = isFirebaseConfigured()

  const fetchRecords = useCallback(async () => {
    if (!configured) return
    setLoading(true)
    setError(null)
    try {
      const data = await getRecentChecks(5)
      setRecords(data)
      setLastFetch(new Date().toISOString())
    } catch {
      setError('Could not load recent activity.')
    } finally {
      setLoading(false)
    }
  }, [configured])

  // Fetch on mount and every 30 seconds
  useEffect(() => {
    fetchRecords()
    const interval = setInterval(fetchRecords, 30_000)
    return () => clearInterval(interval)
  }, [fetchRecords])

  // Don't render if Firebase is not configured
  if (!configured) return null

  return (
    <aside
      aria-label="Recent eligibility activity"
      className={`rounded-2xl border overflow-hidden shadow-[0_4px_24px_rgba(11,30,60,0.18)]
        ${dark ? 'bg-[#0B1E3C]/80 border-white/10' : 'bg-[#0B1E3C] border-white/10'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
          <h3 className="text-[0.82rem] font-extrabold uppercase tracking-[0.1em] text-white">
            Live Activity
          </h3>
          <span className="text-[0.65rem] text-white/40 font-medium">· Firebase Firestore</span>
        </div>
        <button
          onClick={fetchRecords}
          disabled={loading}
          aria-label="Refresh recent activity"
          className="text-[0.72rem] font-bold text-white/50 hover:text-[#FF9933] transition-colors disabled:opacity-40"
        >
          {loading ? '⟳ Loading…' : '↻ Refresh'}
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {error && (
          <p role="alert" className="text-red-400 text-[0.78rem] font-semibold py-2">
            ⚠️ {error}
          </p>
        )}

        {!loading && !error && records.length === 0 && (
          <p className="text-white/40 text-[0.8rem] py-2 text-center">
            No activity yet — be the first to check eligibility!
          </p>
        )}

        {records.length > 0 && (
          <ul className="space-y-2.5" aria-label="Recent eligibility checks">
            {records.map((rec) => {
              const meta = RESULT_META[rec.resultType] || RESULT_META.error
              return (
                <li
                  key={rec.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-[0.78rem] ${meta.bg}`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} aria-hidden />
                  <div className="flex-1 min-w-0">
                    <span className={`font-bold ${meta.color}`}>{meta.label}</span>
                    <span className="text-white/50 mx-1.5">·</span>
                    <span className="text-white/70">{rec.stateLabel}</span>
                    <span className="text-white/50 mx-1.5">·</span>
                    <span className="text-white/50">{CITIZENSHIP_LABEL[rec.citizenship] || rec.citizenship}</span>
                    <span className="text-white/50 mx-1.5">·</span>
                    <span className="text-white/40">{rec.ageGroup}</span>
                  </div>
                  <time
                    dateTime={rec.timestamp || ''}
                    className="text-white/30 flex-shrink-0 text-[0.7rem]"
                  >
                    {timeAgo(rec.timestamp)}
                  </time>
                </li>
              )
            })}
          </ul>
        )}

        {lastFetch && (
          <p className="text-white/25 text-[0.65rem] mt-3 text-right">
            Last synced {timeAgo(lastFetch)} · Data anonymised
          </p>
        )}
      </div>
    </aside>
  )
}
