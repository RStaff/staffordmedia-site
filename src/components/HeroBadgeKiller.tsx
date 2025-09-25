'use client';
import { useEffect } from 'react';

const SELECTORS = [
  'img[src*="abando-icon"]',
  'img[src*="hero-graphic"]',
  'img[src*="/_next/image"][src*="url=%2Fabando-icon"]',
  'img[src*="/_next/image"][src*="url=%2Fhero-graphic"]',
  '[data-hero-badge]',
  '.hero-badge,.floating-badge,.badge-floating,.hero-floating',
  '.hero-overlay,.overlay,.overlay-card,.overlay-badge'
];

function nukeAll() {
  document.querySelectorAll(SELECTORS.join(',')).forEach((el) => {
    const wrap = (el as HTMLElement).closest('span,div,section,figure') || (el as HTMLElement);
    const w = wrap as HTMLElement;
    w.style.display = 'none';
    w.style.visibility = 'hidden';
    w.style.opacity = '0';
    w.style.pointerEvents = 'none';
    w.setAttribute('data-killed','hero-badge');
  });
}

export default function HeroBadgeKiller() {
  useEffect(() => {
    nukeAll();
    const mo = new MutationObserver(() => nukeAll());
    mo.observe(document.documentElement, { childList:true, subtree:true });
    const id = window.setInterval(nukeAll, 1000); // belt & suspenders
    return () => { mo.disconnect(); clearInterval(id); };
  }, []);
  return null;
}
