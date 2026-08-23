import { SupportedLanguageCode, TranslationDictionary } from "../types";
import { en } from "./en";
import { hi } from "./hi";
import { bn } from "./bn";
import { mr } from "./mr";
import { gu } from "./gu";
import { ta } from "./ta";
import { te } from "./te";
import { kn } from "./kn";
import { pa } from "./pa";

export const translations: Record<SupportedLanguageCode, TranslationDictionary> = {
  en,
  hi,
  bn,
  mr,
  gu,
  ta,
  te,
  kn,
  pa,
};

export { en, hi, bn, mr, gu, ta, te, kn, pa };
