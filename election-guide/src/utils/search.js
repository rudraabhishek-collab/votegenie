/**
 * search.js — Reusable search utilities for the guide.
 */
import { searchIndex } from '../data'

/**
 * Find the best matching section ID for a free-text query.
 * Returns a section id string (e.g. 'eligibility') or null.
 *
 * @param {string} query
 * @returns {string|null}
 */
export function handleSearch(query) {
  if (!query || !query.trim()) return null
  const q = query.toLowerCase().trim()

  // Fast keyword shortcuts
  if (/eligib|citizen|age|qualify/.test(q))  return 'eligibility'
  if (/date|deadline|register|when/.test(q)) return 'timeline'
  if (/vote|ballot|booth|poll|how/.test(q))  return 'guide'
  if (/document|id|passport|proof/.test(q))  return 'documents'
  if (/faq|question|help/.test(q))           return 'faq'

  // Fall back to searchIndex keyword matching
  const match = searchIndex.find(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
  )
  return match ? match.section.replace('#', '') : null
}

/**
 * Filter searchIndex items by query string.
 * Returns up to `limit` results.
 *
 * @param {string} query
 * @param {number} limit
 * @returns {Array}
 */
export function searchItems(query, limit = 6) {
  if (!query || query.trim().length < 2) return []
  const q = query.toLowerCase().trim()
  return searchIndex
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    )
    .slice(0, limit)
}
