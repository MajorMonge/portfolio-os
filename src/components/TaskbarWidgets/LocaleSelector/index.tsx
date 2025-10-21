import { h } from "preact";
import { $localeStore, setLocale, languages, useTranslation } from "@/i18n";
import { useStore } from "@nanostores/preact";
import { $taskbarStore } from "@/store/TaskbarStore";
import { getTooltipClasses } from "@/helpers/getPosition";
import { useDropdownPosition } from "@/helpers/hooks/useDropdownPosition";

export default function LocaleSelector() {
  const { t } = useTranslation();
  const activeLocale = useStore($localeStore);
  const languageOptions = Object.keys(languages);
  const taskbarOptions = useStore($taskbarStore);
  const currentPosition = taskbarOptions.position;
  const { buttonRef, dropdownClasses } = useDropdownPosition(currentPosition);

  const setActiveLocale = (locale: string) => {
    setLocale(locale as keyof typeof languages);
  };

  return (
    <div
      className={`${dropdownClasses} flex align-center justify-center`}
    >
      <div
        ref={buttonRef}
        tabIndex={0}
        role="button"
        className={`btn btn-ghost btn-square my-auto ${getTooltipClasses(currentPosition)}`}
        data-tip={t("ui.taskbar.localeSelector.tooltip")}
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
