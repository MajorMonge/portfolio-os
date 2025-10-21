import { h } from "preact";
import { $themeStore, setTheme, themes } from "@/store/ThemeStore";
import { useEffect } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { useTranslation } from "@/i18n";
import { $taskbarStore } from "@/store/TaskbarStore";
import { getTooltipClassName } from "@/helpers/tooltipPosition";

export default function ThemeSelector() {
  const { t } = useTranslation();

  const activeTheme = useStore($themeStore);
  const taskbarOptions = useStore($taskbarStore);

  return (
    <div className="dropdown dropdown-top flex align-center justify-center">
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-ghost btn-square my-auto ${getTooltipClassName(taskbarOptions.position)}`}
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
