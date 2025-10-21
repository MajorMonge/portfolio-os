import type { TaskbarPosition } from "@/store/TaskbarStore";

const tooltipPositionMap: Record<TaskbarPosition, string> = {
  top: "tooltip-bottom",
  bottom: "tooltip-top",
  left: "tooltip-right",
  right: "tooltip-left",
};

export function getTooltipPosition(taskbarPosition: TaskbarPosition): string {
  return tooltipPositionMap[taskbarPosition];
}

export function getTooltipClassName(
  taskbarPosition: TaskbarPosition,
  additionalClasses?: string
): string {
  const classes = ["tooltip", getTooltipPosition(taskbarPosition)];
  if (additionalClasses) {
    classes.push(additionalClasses);
  }
  return classes.join(" ");
}
