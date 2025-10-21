import { h } from "preact";
import { useTranslation } from "@/i18n";
import { useStore } from "@nanostores/preact";
import {
  $taskbarStore,
  setTaskbarPosition,
  taskbarPositions,
  type TaskbarPosition,
} from "@/store/TaskbarStore";
import { getTooltipClassName } from "@/helpers/tooltipPosition";
import { getDropdownClassName } from "@/helpers/dropdownPosition";

const positionIcons: Record<TaskbarPosition, string> = {
  top: "⬆️",
  bottom: "⬇️",
  left: "⬅️",
  right: "➡️",
};

export default function BarPositionSelector() {
  const { t } = useTranslation();
  const taskbarOptions = useStore($taskbarStore);
  const currentPosition = taskbarOptions.position;

  const getPositionLabel = (position: TaskbarPosition): string => {
    return t(`ui.taskbar.positionSelector.positions.${position}`);
  };

  const handlePositionChange = (position: TaskbarPosition) => {
    setTaskbarPosition(position);
  };

  return (
    <div
      className={getDropdownClassName(
        currentPosition,
        "flex align-center justify-center"
      )}
    >
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-ghost btn-square my-auto ${getTooltipClassName(currentPosition)}`}
        data-tip={t("ui.taskbar.positionSelector.tooltip")}
      >
        {positionIcons[currentPosition]}
      </div>
      <ul
        tabIndex={0}
        class="dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-2xl mr-2 overflow-y-auto max-h-100"
      >
        {taskbarPositions.map((position) => (
          <li key={position}>
            <input
              type="radio"
              name="position-dropdown"
              class={`theme-controller w-full btn btn-sm btn-block btn-ghost justify-start ${
                currentPosition === position ? "btn-active" : ""
              }`}
              aria-label={getPositionLabel(position)}
              value={position}
              onChange={() => handlePositionChange(position)}
              checked={currentPosition === position}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
