import { useStore } from "@nanostores/preact";
import { $localeStore, type LocaleType } from "@/store/LocaleStore";
import { createTranslator } from "./utils";

export function useTranslation() {
  const locale = useStore($localeStore);

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const translator = createTranslator(locale);
    return translator(key, variables);
  };

  const setLocale = (newLocale: LocaleType) => {
    $localeStore.set(newLocale);
  };

  return {
    t,
    locale,
    setLocale,
  };
}
