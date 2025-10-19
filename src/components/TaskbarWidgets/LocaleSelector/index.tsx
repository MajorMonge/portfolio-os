import { h } from "preact";
import { $localeStore, setLocale, languages } from "@/i18n";
import { useEffect } from "preact/hooks";
import { useStore } from "@nanostores/preact";

export default function LocaleSelector() {
  const activeLocale = useStore($localeStore);
  const languageOptions = Object.keys(languages);

  useEffect(() => {
    document.documentElement.setAttribute("data-language", activeLocale);
  }, [activeLocale]);

  const setActiveLocale = (locale: string) => {
    setLocale(locale as keyof typeof languages);
  };

  return (
    <div className="dropdown dropdown-top flex align-center justify-center">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-square my-auto"
      >
        🔠
      </div>
      <ul
        tabIndex={0}
        class="dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-2xl mr-2 overflow-y-auto max-h-100"
      >
        {languageOptions.map((language) => (
          <li key={language}>
            <input
              type="radio"
              name="theme-dropdown"
              class={`theme-controller w-full btn btn-sm btn-block btn-ghost justify-start ${
                activeLocale === language ? "btn-active" : ""
              }`}
              aria-label={languages[language as keyof typeof languages]}
              value={language}
              onChange={() => setActiveLocale(language)}
              checked={activeLocale === language}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
