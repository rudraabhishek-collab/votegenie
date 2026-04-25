/**
 * PollingBoothFinder.jsx
 * Uses the browser Geolocation API + Google Maps Embed API to show
 * polling booths near the user's location.
 *
 * Requires: VITE_GOOGLE_MAPS_API_KEY in .env.local
 * Falls back gracefully when key is missing or location is denied.
 */
import { useState, useCallback } from 'react'

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

/** Build a Google Maps Embed URL for "polling booth" search near coords. */
function buildMapUrl(lat, lng) {
  const q = encodeURIComponent(`polling booth near ${lat},${lng}`)
  return `https://www.google.com/maps/embed/v1/search?key=${MAPS_KEY}&q=${q}&zoom=13`
}

/** Build a Google Maps Embed URL for a text query (fallback). */
function buildCityMapUrl(city) {
  const q = encodeURIComponent(`polling booth ${city} India`)
  return `https://www.google.com/maps/embed/v1/search?key=${MAPS_KEY}&q=${q}&zoom=12`
}

const LOCATION_STATES = {
  IDLE:     'idle',
  LOADING:  'loading',
  SUCCESS:  'success',
  ERROR:    'error',
  MANUAL:   'manual',
}

export default function PollingBoothFinder({ dark }) {
  const [status,   setStatus]   = useState(LOCATION_STATES.IDLE)
  const [mapUrl,   setMapUrl]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [city,     setCity]     = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)

  const hasMapsKey = Boolean(MAPS_KEY)

  /** Request browser geolocation and build map URL. */
  const findNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus(LOCATION_STATES.ERROR)
      setErrorMsg('Geolocation is not supported by your browser.')
      return
    }
    setStatus(LOCATION_STATES.LOADING)
    setMapLoaded(false)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setMapUrl(buildMapUrl(latitude, longitude))
        setStatus(LOCATION_STATES.SUCCESS)
      },
      (err) => {
        const messages = {
          1: 'Location access denied. Please allow location or search by city below.',
          2: 'Location unavailable. Try searching by city.',
          3: 'Location request timed out. Try searching by city.',
        }
        setErrorMsg(messages[err.code] || 'Could not get your location.')
        setStatus(LOCATION_STATES.ERROR)
      },
      { timeout: 10_000, maximumAge: 60_000 }
    )
  }, [])

  /** Search by city name. */
  const searchByCity = useCallback(() => {
    const trimmed = city.trim()
    if (!trimmed) return
    setMapUrl(buildCityMapUrl(trimmed))
    setStatus(LOCATION_STATES.MANUAL)
    setMapLoaded(false)
  }, [city])

  return (
    <section
      id="polling-booth-finder"
      className="scroll-mt-20"
      aria-labelledby="booth-finder-heading"
    >
      {/* Section header */}
      <div className="mb-6">
        <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]
          px-3 py-1.5 rounded-full mb-3 border
          ${dark ? 'bg-[#FF6A00]/20 text-[#FF9933] border-[#FF6A00]/30' : 'bg-[#0B1E3C] text-white border-transparent shadow-sm'}`}>
          📍 Find Polling Booth
        </span>
        <h2
          id="booth-finder-heading"
          className={`text-[clamp(1.4rem,4vw,2.1rem)] font-black leading-tight tracking-[-0.04em]
            ${dark ? 'text-white' : 'text-[#0B1E3C]'}`}
        >
          Find Your Nearest Polling Booth
        </h2>
        <p className={`mt-2 text-[0.95rem] leading-relaxed max-w-2xl
          ${dark ? 'text-slate-300' : 'text-[#0B1E3C]/65'}`}>
          Use your location or search by city to find polling booths near you — powered by Google Maps.
        </p>
      </div>

      <div className={`rounded-2xl border overflow-hidden shadow-[0_4px_24px_rgba(11,30,60,0.18)]
        ${dark ? 'bg-[#0B1E3C]/80 border-white/10' : 'bg-[#0B1E3C] border-white/10'}`}>

        {/* Controls */}
        <div className="p-5 sm:p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Use my location */}
            <button
              onClick={findNearMe}
              disabled={status === LOCATION_STATES.LOADING}
              aria-label="Find polling booths near my current location"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-[0.88rem] text-white
                shadow-[0_4px_12px_rgba(255,106,0,0.4)] hover:-translate-y-0.5 disabled:opacity-50
                disabled:cursor-not-allowed transition-all duration-200"
              style={{ background: 'linear-gradient(135deg,#FF6A00,#FF4500)' }}
            >
              {status === LOCATION_STATES.LOADING ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Locating…
                </>
              ) : (
                <>📍 Use My Location</>
              )}
            </button>

            {/* City search */}
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchByCity()}
                placeholder="Or search by city (e.g. Mumbai)"
                aria-label="Search polling booths by city name"
                className="flex-1 rounded-xl px-4 py-3 text-[0.88rem] border bg-white/10 border-white/20
                  text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF9933]
                  focus:ring-2 focus:ring-[#FF9933]/20 transition-all"
              />
              <button
                onClick={searchByCity}
                disabled={!city.trim()}
                aria-label="Search for polling booths in entered city"
                className="px-4 py-3 rounded-xl font-bold text-[0.88rem] text-white border border-white/20
                  bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200"
              >
                Search
              </button>
            </div>
          </div>

          {/* Error message */}
          {status === LOCATION_STATES.ERROR && (
            <p role="alert" className="mt-3 text-amber-400 text-[0.82rem] font-semibold flex items-center gap-2">
              <span aria-hidden>⚠️</span> {errorMsg}
            </p>
          )}

          {/* No API key fallback */}
          {!hasMapsKey && (
            <p className="mt-3 text-white/40 text-[0.78rem]">
              ℹ️ Add <code className="bg-white/10 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to{' '}
              <code className="bg-white/10 px-1 rounded">.env.local</code> to enable the map.
            </p>
          )}
        </div>

        {/* Map iframe */}
        {mapUrl && hasMapsKey && (
          <div className="relative">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0B1E3C]/80 z-10"
                aria-live="polite" aria-label="Map loading">
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-8 h-8 animate-spin text-[#FF9933]" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <p className="text-white/60 text-[0.82rem]">Loading map…</p>
                </div>
              </div>
            )}
            <iframe
              src={mapUrl}
              title="Polling booths near you — Google Maps"
              width="100%"
              height="420"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
              aria-label="Google Maps showing polling booths near your location"
            />
          </div>
        )}

        {/* Idle state */}
        {status === LOCATION_STATES.IDLE && (
          <div className="px-6 py-10 text-center">
            <div className="text-5xl mb-3" aria-hidden>🗺️</div>
            <p className="text-white/60 text-[0.9rem]">
              Click <strong className="text-white">"Use My Location"</strong> or enter a city to find polling booths near you.
            </p>
          </div>
        )}

        {/* Footer note */}
        <div className="px-5 py-3 border-t border-white/10">
          <p className="text-white/30 text-[0.65rem]">
            🗺️ Powered by Google Maps · Booth locations are indicative — verify at{' '}
            <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noopener noreferrer"
              className="underline hover:text-white/60 transition-colors">
              electoralsearch.eci.gov.in
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
