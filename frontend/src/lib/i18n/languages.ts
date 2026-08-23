import { LanguageInfo, SupportedLanguageCode } from "./types";

export const DEFAULT_LANGUAGE: SupportedLanguageCode = "en";

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    script: "Latin",
    region: "Global",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    region: "India",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    script: "Bengali",
    region: "West Bengal / Bangladesh",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    script: "Devanagari",
    region: "Maharashtra",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    script: "Gujarati",
    region: "Gujarat",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    script: "Tamil",
    region: "Tamil Nadu",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    script: "Telugu",
    region: "Andhra Pradesh / Telangana",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    script: "Kannada",
    region: "Karnataka",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    script: "Gurmukhi",
    region: "Punjab",
  },
];

export const SUPPORTED_LANGUAGE_CODES: Set<string> = new Set(
  SUPPORTED_LANGUAGES.map((l) => l.code)
);

export function isSupportedLanguage(
  code: string
): code is SupportedLanguageCode {
  return SUPPORTED_LANGUAGE_CODES.has(code);
}

export function getLanguageInfo(code: string): LanguageInfo {
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return found || SUPPORTED_LANGUAGES[0]; // fallback to English
}
