import locales from "./locales";
import type { LocaleType } from "@/store/LocaleStore";

/**
 * Gets a nested value from an object using a dot-notation path
 * @param obj - The object to search
 * @param path - The path to the value (e.g., "home.message")
 * @returns The value at the path or the path itself if not found
 */
function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return path; // Return the key itself if not found
    }
  }

  return typeof current === "string" ? current : path;
}

/**
 * Translates a key to the appropriate locale string
 * @param key - The translation key in dot notation (e.g., "home.message")
 * @param locale - The locale to use (e.g., "pt-BR", "en-US")
 * @param variables - Optional object with variables to replace in the translation
 * @returns The translated string
 */
export function translate(
  key: string,
  locale: LocaleType,
  variables?: Record<string, string | number>
): string {
  const translations = locales[locale]?.translations || {};
  let translation = getNestedValue(translations, key);

  // Replace variables if provided
  if (variables) {
    Object.entries(variables).forEach(([varKey, value]) => {
      translation = translation.replace(
        new RegExp(`{{${varKey}}}`, "g"),
        String(value)
      );
    });
  }

  return translation;
}

/**
 * Creates a translation function bound to a specific locale
 * @param locale - The locale to bind to
 * @returns A function that translates keys to the bound locale
 */
export function createTranslator(locale: LocaleType) {
  return (key: string, variables?: Record<string, string | number>): string => {
    return translate(key, locale, variables);
  };
}
