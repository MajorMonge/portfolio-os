import type { TaskbarPosition } from "@/store/TaskbarStore";

const dropdownPositionMap: Record<TaskbarPosition, string> = {
  top: "dropdown-bottom",
  bottom: "dropdown-top",
  left: "dropdown-right",
  right: "dropdown-left",
};

const dropdownAlignmentMap: Record<TaskbarPosition, string> = {
  top: "",
  bottom: "",
  left: "dropdown-end",
  right: "dropdown-end",
};

export function getDropdownPosition(taskbarPosition: TaskbarPosition): string {
  return dropdownPositionMap[taskbarPosition];
}

export function getDropdownAlignment(taskbarPosition: TaskbarPosition): string {
  return dropdownAlignmentMap[taskbarPosition];
}

export function getDropdownClassName(
  taskbarPosition: TaskbarPosition,
  additionalClasses?: string
): string {
  const classes = [
    "dropdown",
    getDropdownPosition(taskbarPosition),
    getDropdownAlignment(taskbarPosition),
  ].filter(Boolean);

  if (additionalClasses) {
    classes.push(additionalClasses);
  }
  return classes.join(" ");
}
