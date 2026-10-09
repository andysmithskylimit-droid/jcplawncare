import { scrollToTarget } from './motion';
import { navigate } from './router';
import { normalizePath } from '../data/routes';

export const QUOTE_PRESET_EVENT = 'jcp:quote-preset';
let pending = null;

/** Read (once) a preset left by a button on another page. */
export function takePendingPreset() {
  const p = pending;
  pending = null;
  return p;
}

/**
 * Opens the quote form pre-filled, from any page.
 * propertyType: 'Home' | 'Commercial property'; service: one of serviceOptions; note: text for the message box.
 */
export function requestQuote(preset = {}) {
  if (normalizePath(window.location.pathname) === '/contact') {
    window.dispatchEvent(new CustomEvent(QUOTE_PRESET_EVENT, { detail: preset }));
    scrollToTarget('#quote');
    return;
  }
  pending = preset;
  navigate('/contact#quote');
}
