import { AudioPlayer } from './player.js'
import { initGallery } from './gallery.js'

// ─── Sticky nav shadow on scroll ──────────────────────────
const nav = document.getElementById('nav')
window.addEventListener(
  'scroll',
  () => {
    nav.style.boxShadow =
      window.scrollY > 10 ? '0 2px 24px rgba(0,0,0,0.5)' : ''
  },
  { passive: true }
)

// ─── Mobile burger menu ────────────────────────────────────
const burger = document.getElementById('navBurger')
const navLinks = document.querySelector('.nav__links')
burger?.addEventListener('click', () => {
  navLinks.classList.toggle('is-open')
})
// Close menu on link click
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('is-open'))
})

// ─── Footer year ───────────────────────────────────────────
const yearEl = document.getElementById('footerYear')
if (yearEl) yearEl.textContent = new Date().getFullYear()

// ─── Audio Player ──────────────────────────────────────────
const player = new AudioPlayer()
player.init()

// ─── Gallery ───────────────────────────────────────────────
initGallery()

// ─── Social links ──────────────────────────────────────────
fetch('/api/config')
  .then(r => r.json())
  .then(({ social }) => {
    const map = {
      instagram: document.querySelector('.social-link[aria-label="Instagram"]'),
      spotify: document.querySelector('.social-link[aria-label="Spotify"]'),
      youtube: document.querySelector('.social-link[aria-label="YouTube"]'),
      email: document.querySelector('.social-link[aria-label="Email"]')
    }
    if (social.instagram) map.instagram?.setAttribute('href', social.instagram)
    if (social.spotify) map.spotify?.setAttribute('href', social.spotify)
    if (social.youtube) map.youtube?.setAttribute('href', social.youtube)
    if (social.email) map.email?.setAttribute('href', `mailto:${social.email}`)

    // Gray out and disable links with no configured URL
    Object.entries(map).forEach(([key, el]) => {
      if (!el) return
      const hasUrl = Boolean(social[key])
      if (!hasUrl) {
        // Preserve existing mailto in markup — only disable placeholder/hash links
        const currentHref = el.getAttribute('href')
        const isMailto =
          typeof currentHref === 'string' && currentHref.startsWith('mailto:')
        el.classList.add('social-link--disabled')
        el.setAttribute('aria-disabled', 'true')
        el.setAttribute('tabindex', '-1')
        if (!isMailto && (!currentHref || currentHref === '#')) {
          // Remove href so it's not navigable and prevent any clicks
          el.removeAttribute('href')
          el.addEventListener('click', e => e.preventDefault())
        }
      }
    })
  })
  .catch(() => {}) // social links degrade gracefully

// Open non-hash links in a new window/tab for better UX
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href')
    if (!href) return
    // skip internal hash anchors and mailto links
    if (href.startsWith('#') || href.startsWith('mailto:')) return
    // already intentionally left without href (disabled)
    if (!a.hasAttribute('href')) return
    a.setAttribute('target', '_blank')
    const existingRel = a.getAttribute('rel') || ''
    const relParts = new Set(existingRel.split(/\s+/).filter(Boolean))
    relParts.add('noopener')
    relParts.add('noreferrer')
    a.setAttribute('rel', Array.from(relParts).join(' '))
  })
})
