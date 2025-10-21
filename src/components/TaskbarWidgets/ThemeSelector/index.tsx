import { h } from "preact";
import { $themeStore, setTheme, themes } from "@/store/ThemeStore";
import { useStore } from "@nanostores/preact";
import { useTranslation } from "@/i18n";
import { $taskbarStore } from "@/store/TaskbarStore";
import { getTooltipClasses } from "@/helpers/getPosition";
import { useDropdownPosition } from "@/helpers/hooks/useDropdownPosition";

export default function ThemeSelector() {
  const { t } = useTranslation();

  const activeTheme = useStore($themeStore);
  const taskbarOptions = useStore($taskbarStore);
  const currentPosition = taskbarOptions.position;
  const { buttonRef, dropdownClasses } = useDropdownPosition(currentPosition);

  return (
    <div
      className={`${dropdownClasses} flex align-center justify-center`}
    >
      <div
        ref={buttonRef}
        tabIndex={0}
        role="button"
        className={`btn btn-ghost btn-square my-auto ${getTooltipClasses(currentPosition)}`}
        data-tip={t("ui.taskbar.themeSelector.tooltip")}
      >
        🎨
      </div>
      <ul
        tabIndex={0}
        class="dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-2xl mr-2 overflow-y-auto max-h-100"
      >
        {themes.map((theme) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              class={`theme-controller w-full btn btn-sm btn-block btn-ghost justify-start ${
                activeTheme === theme ? "btn-active" : ""
              }`}
              aria-label={theme}
              value={theme}
              onChange={() => setTheme(theme)}
              checked={activeTheme === theme}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
