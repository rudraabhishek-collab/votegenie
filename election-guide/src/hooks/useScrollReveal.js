import { useEffect, useRef } from 'react'

/**
 * Attach to a container ref. All children with class `sr` will
 * animate in when they enter the viewport.
 * Optional staggerDelay (ms) staggers each child.
 */
export function useScrollReveal(staggerDelay = 80) {
  const ref = useRef(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.sr')
    if (!els?.length) return

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * staggerDelay}ms`
      obs.observe(el)
    })

    return () => obs.disconnect()
  }, [staggerDelay])

  return ref
}
