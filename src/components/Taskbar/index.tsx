import { h } from "preact";
import TaskbarApp from "../TaskbarApp";
import {
  $appStore,
  $taskbarOrder,
  $focusOrder,
  bringAppToFront,
  closeApp,
  toggleMinimize,
} from "@/store/AppStore";
import TaskbarClock from "../TaskbarWidgets/TaskbarClock";
import ThemeSelector from "../TaskbarWidgets/ThemeSelector";
import LocaleSelector from "../TaskbarWidgets/LocaleSelector";
import { useStore } from "@nanostores/preact";

interface TaskbarProps {
  position?: "left" | "right" | "bottom" | "top";
}

export default function Taskbar({ position = "bottom" }: TaskbarProps) {
  const apps = useStore($appStore);
  const taskbarApps = useStore($taskbarOrder);
  const focusOrder = useStore($focusOrder);

  const getPositionConfig = () => {
    switch (position) {
      case "top":
        return "top-0 left-1/2 -translate-x-1/2 h-15 flex-row my-2 min-w-[min(95vw,50vw)] max-w-[calc(100vw-2rem)]";
      case "left":
        return "left-0 top-1/2 -translate-y-1/2 w-15 flex-col mx-2 min-h-[min(95vh,50vh)] max-h-[calc(100vh-2rem)]";
      case "right":
        return "right-0 top-1/2 -translate-y-1/2 w-15 flex-col mx-2 min-h-[min(95vh,50vh)] max-h-[calc(100vh-2rem)]";
      case "bottom":
      default:
        return "bottom-0 left-1/2 -translate-x-1/2 h-15 flex-row my-2 min-w-[min(95vw,50vw)] max-w-[calc(100vw-2rem)]";
    }
  };

  const config = getPositionConfig();
  const isHorizontal = position === "top" || position === "bottom";

  return (
    <div
      class={`absolute ${config} z-[999] flex items-center justify-between bg-base-200 rounded-box shadow-[1px_0px_30px_-15px_rgba(0,0,0,0.75)] panel taskbar ${
        isHorizontal ? "taskbar-horizontal" : "taskbar-vertical"
      }`}
    >
      <div
        className={`w-full flex-1 ${
          isHorizontal
            ? "min-w-0 overflow-x-auto justify-start"
            : "min-h-0 overflow-y-auto items-center pt-2"
        } flex gap-2 ${isHorizontal ? "flex-row" : "flex-col"}`}
        style={{ scrollbarWidth: "thin" }}
      >
        {taskbarApps.map((app) => {
          const currentApp = apps.find((a) => a.instanceId === app.instanceId);
          const isTopMostApp =
            focusOrder[focusOrder.length - 1] === app.instanceId;
          const isActive = isTopMostApp && !currentApp?.minimized;

          return (
            <TaskbarApp
              key={app.instanceId}
              icon={app.icon}
              onClick={() => {
                if (!currentApp) return;

                if (currentApp.minimized) {
                  toggleMinimize(app.instanceId!);
                } else if (isTopMostApp) {
                  toggleMinimize(app.instanceId!);
                } else {
                  bringAppToFront(app.instanceId!);
                }
              }}
              isActive={isActive}
            />
          );
        })}
      </div>
      <div class={` taskbar-widgets  ${
            isHorizontal
              ? "h-full mr-2 py-2"
              : "w-full "
          }`}>
        <div
          className={`shadow-sm flex gap-2 bg-primary/25 glass items-center justify-center rounded-box inverted-panel ${
            isHorizontal
              ? "h-full px-4 flex-row flex-wrap"
              : "py-4 flex-col flex-shrink-0"
          }`}
        >
          <LocaleSelector />
          <ThemeSelector />
          <TaskbarClock position={position} />
        </div>
      </div>
    </div>
  );
}
