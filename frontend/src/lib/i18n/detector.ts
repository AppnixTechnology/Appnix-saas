import { SupportedLanguageCode } from "./types";
import { isSupportedLanguage } from "./languages";

export const STORAGE_KEYS = {
  LANGUAGE: "appnix_preferred_language",
  DISMISSED_SUGGESTION: "appnix_language_suggestion_dismissed",
} as const;

/**
 * Normalizes browser locale string e.g. "hi-IN", "hi_IN", "HI", "en-US" to primary subtag "hi", "en"
 */
export function normalizeLocale(locale: string | undefined | null): string | null {
  if (!locale || typeof locale !== "string") return null;
  const cleaned = locale.trim().toLowerCase().replace("_", "-");
  const primaryTag = cleaned.split("-")[0];
  return primaryTag || null;
}

/**
 * Inspects navigator.language and navigator.languages to find if the user's browser
 * uses a supported non-English regional language.
 *
 * Returns the SupportedLanguageCode if a supported regional language is detected,
 * or null if English / unsupported language is detected.
 */
export function detectBrowserRegionalLanguage(): SupportedLanguageCode | null {
  if (typeof window === "undefined" || !window.navigator) {
    return null;
  }

  const rawLanguages: string[] = [];

  if (window.navigator.language) {
    rawLanguages.push(window.navigator.language);
  }

  if (Array.isArray(window.navigator.languages)) {
    rawLanguages.push(...window.navigator.languages);
  }

  for (const raw of rawLanguages) {
    const normalized = normalizeLocale(raw);
    if (!normalized) continue;

    // English variants should not trigger a suggestion
    if (normalized === "en") {
      return null;
    }

    if (isSupportedLanguage(normalized)) {
      return normalized;
    }
  }

  return null;
}

/**
 * Checks whether the language suggestion popup should be displayed:
 * 1. A supported regional language is detected in browser (e.g. 'hi')
 * 2. User has not already explicitly chosen/saved a preferred language
 * 3. User has not previously dismissed the suggestion for this or any language
 */
export function shouldShowLanguageSuggestion(): {
  shouldShow: boolean;
  suggestedLanguage: SupportedLanguageCode | null;
} {
  if (typeof window === "undefined") {
    return { shouldShow: false, suggestedLanguage: null };
  }

  try {
    // Check if user has an explicit saved preference
    const savedPref = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (savedPref) {
      return { shouldShow: false, suggestedLanguage: null };
    }

    // Check if suggestion was previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEYS.DISMISSED_SUGGESTION);
    if (dismissed === "true" || dismissed === "1") {
      return { shouldShow: false, suggestedLanguage: null };
    }

    const detected = detectBrowserRegionalLanguage();
    if (detected && detected !== "en") {
      return { shouldShow: true, suggestedLanguage: detected };
    }
  } catch {
    // Handle localStorage security restrictions gracefully
  }

  return { shouldShow: false, suggestedLanguage: null };
}

/**
 * Saves the user's explicit language preference to localStorage
 */
export function savePreferredLanguage(code: SupportedLanguageCode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, code);
    // Once explicitly selected, clear/set dismissed so suggestion never prompts again
    localStorage.setItem(STORAGE_KEYS.DISMISSED_SUGGESTION, "true");
  } catch {
    // ignore storage exceptions
  }
}

/**
 * Marks the language suggestion as dismissed so it won't be shown again on future visits
 */
export function dismissLanguageSuggestion(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.DISMISSED_SUGGESTION, "true");
  } catch {
    // ignore storage exceptions
  }
}

/**
 * Retrieves the explicitly saved language preference from localStorage, if any
 */
export function getSavedPreferredLanguage(): SupportedLanguageCode | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved && isSupportedLanguage(saved)) {
      return saved;
    }
  } catch {
    // ignore storage exceptions
  }
  return null;
}
