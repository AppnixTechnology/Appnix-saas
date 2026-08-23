"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  SupportedLanguageCode,
  LanguageInfo,
  TranslationDictionary,
} from "./types";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getLanguageInfo,
  isSupportedLanguage,
} from "./languages";
import {
  shouldShowLanguageSuggestion,
  savePreferredLanguage,
  dismissLanguageSuggestion,
  getSavedPreferredLanguage,
} from "./detector";
import { translations } from "./locales";

interface LanguageContextType {
  currentLanguage: SupportedLanguageCode;
  languageInfo: LanguageInfo;
  translations: TranslationDictionary;
  supportedLanguages: LanguageInfo[];
  suggestedLanguage: SupportedLanguageCode | null;
  suggestedLanguageInfo: LanguageInfo | null;
  isSuggestionVisible: boolean;
  setLanguage: (code: SupportedLanguageCode) => void;
  acceptSuggestion: () => void;
  dismissSuggestion: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always default to English initially
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguageCode>(DEFAULT_LANGUAGE);
  const [suggestedLanguage, setSuggestedLanguage] =
    useState<SupportedLanguageCode | null>(null);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize client-side language state respecting the strict priority:
  // Priority 1 & 2: Explicitly saved user language preference
  // Priority 3: Browser language (triggers suggestion ONLY, never auto-changes)
  // Priority 4: English fallback
  useEffect(() => {
    try {
      const saved = getSavedPreferredLanguage();

      if (saved && isSupportedLanguage(saved)) {
        // Returning user with explicit saved preference
        setCurrentLanguage(saved);
        setIsSuggestionVisible(false);
        setSuggestedLanguage(null);
      } else {
        // First-time visit: check for regional browser language suggestion
        const { shouldShow, suggestedLanguage: detected } =
          shouldShowLanguageSuggestion();

        if (shouldShow && detected && detected !== DEFAULT_LANGUAGE) {
          setSuggestedLanguage(detected);
          setIsSuggestionVisible(true);
        }
      }
    } catch (e) {
      console.warn("Language preference initialization warning:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Set language manually
  const setLanguage = useCallback((code: SupportedLanguageCode) => {
    if (!isSupportedLanguage(code)) return;
    setCurrentLanguage(code);
    savePreferredLanguage(code);
    setIsSuggestionVisible(false);
    setSuggestedLanguage(null);

    // Update html lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = code;
    }
  }, []);

  // Accept the suggested regional language
  const acceptSuggestion = useCallback(() => {
    if (suggestedLanguage && isSupportedLanguage(suggestedLanguage)) {
      setLanguage(suggestedLanguage);
    }
  }, [suggestedLanguage, setLanguage]);

  // Dismiss the suggestion and keep English
  const dismissSuggestion = useCallback(() => {
    dismissLanguageSuggestion();
    setIsSuggestionVisible(false);
    setSuggestedLanguage(null);
  }, []);

  const languageInfo = useMemo(
    () => getLanguageInfo(currentLanguage),
    [currentLanguage]
  );

  const suggestedLanguageInfo = useMemo(
    () => (suggestedLanguage ? getLanguageInfo(suggestedLanguage) : null),
    [suggestedLanguage]
  );

  // Get translation dictionary with fallback to English for any missing keys
  const currentTranslations = useMemo(() => {
    return translations[currentLanguage] || translations[DEFAULT_LANGUAGE];
  }, [currentLanguage]);

  const value = useMemo(
    () => ({
      currentLanguage,
      languageInfo,
      translations: currentTranslations,
      supportedLanguages: SUPPORTED_LANGUAGES,
      suggestedLanguage,
      suggestedLanguageInfo,
      isSuggestionVisible,
      setLanguage,
      acceptSuggestion,
      dismissSuggestion,
    }),
    [
      currentLanguage,
      languageInfo,
      currentTranslations,
      suggestedLanguage,
      suggestedLanguageInfo,
      isSuggestionVisible,
      setLanguage,
      acceptSuggestion,
      dismissSuggestion,
    ]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { translations, currentLanguage, languageInfo } = useLanguage();
  return {
    t: translations,
    currentLanguage,
    languageInfo,
  };
}
