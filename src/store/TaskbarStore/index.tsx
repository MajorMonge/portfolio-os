import { persistentAtom } from "@nanostores/persistent";

export const taskbarPositions = ["top", "bottom", "left", "right"] as const;

export type TaskbarPosition = (typeof taskbarPositions)[number];

export interface TaskbarOptions {
  position: TaskbarPosition;
}

const defaultOptions: TaskbarOptions = {
  position: "bottom",
};

export const $taskbarStore = persistentAtom<TaskbarOptions>(
  "taskbarStore",
  defaultOptions,
  {
    encode: (value: TaskbarOptions) => JSON.stringify(value),
    decode: (value: string): TaskbarOptions => {
      try {
        const parsed = JSON.parse(value);
        if (
          parsed &&
          typeof parsed.position === "string" &&
          taskbarPositions.includes(parsed.position as TaskbarPosition)
        ) {
          return parsed as TaskbarOptions;
        }
      } catch (e) {
        console.error("Failed to parse taskbar store:", e);
      }
      return defaultOptions;
    },
  }
);

export function setTaskbarPosition(position: TaskbarPosition) {
  const current = $taskbarStore.get();
  $taskbarStore.set({ ...current, position });
}

export function getTaskbarPosition(): TaskbarPosition {
  return $taskbarStore.get().position;
}

export function getTaskbarOptions(): TaskbarOptions {
  return $taskbarStore.get();
}

export function setTaskbarOptions(options: Partial<TaskbarOptions>) {
  const current = $taskbarStore.get();
  $taskbarStore.set({ ...current, ...options });
}
