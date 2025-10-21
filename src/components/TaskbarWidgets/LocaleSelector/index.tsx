import { h } from "preact";
import { $localeStore, setLocale, languages, useTranslation } from "@/i18n";
import { useEffect } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { $taskbarStore } from "@/store/TaskbarStore";
import { getTooltipClassName } from "@/helpers/tooltipPosition";
import { getDropdownClassName } from "@/helpers/dropdownPosition";

export default function LocaleSelector() {
  const { t } = useTranslation();
  const activeLocale = useStore($localeStore);
  const taskbarOptions = useStore($taskbarStore);
  const languageOptions = Object.keys(languages);

  const setActiveLocale = (locale: string) => {
    setLocale(locale as keyof typeof languages);
  };

  return (
    <div
      className={getDropdownClassName(
        taskbarOptions.position,
        "flex align-center justify-center"
      )}
    >
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-ghost btn-square my-auto ${getTooltipClassName(taskbarOptions.position)}`}
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
