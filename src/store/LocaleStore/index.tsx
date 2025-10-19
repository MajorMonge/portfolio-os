import { persistentAtom } from "@nanostores/persistent";

export const languages = {
  "en-US": "English (US)",
  "pt-BR": "Português (BR)",
} as const;

export const defaultLang: keyof typeof languages = "pt-BR";

export type LocaleType = keyof typeof languages;

export const $localeStore = persistentAtom<LocaleType>(
  "localeStore",
  defaultLang as LocaleType,
  {
    encode: (value: LocaleType) => value,
    decode: (value: string): LocaleType => {
      if (value in languages) {
        return value as LocaleType;
      }

      return defaultLang as LocaleType;
    },
  }
);

export function setLocale(locale: LocaleType) {
  $localeStore.set(locale);
}

export function getLocale(): LocaleType {
  return $localeStore.get();
}
