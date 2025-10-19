import type { Application } from "@/types/app";
import { getLocale } from "@/i18n";

export function getLocalizedAppName(app: Application): string {
  if (!app.i18n) {
    return app.title;
  }

  const currentLocale = getLocale();

  if (app.i18n[currentLocale]?.appName) {
    return app.i18n[currentLocale].appName;
  }

  return app.title;
}
