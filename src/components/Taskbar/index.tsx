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
        return {
          classes: "top-0 h-15 flex-row",
          style: {
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: "min(95vw, 50vw)",
            maxWidth: "calc(100vw - 2rem)",
          },
        };
      case "left":
        return {
          classes: "left-0 w-15 flex-col",
          style: {
            top: "50%",
            transform: "translateY(-50%)",
            minHeight: "min(95vh, 50vh)",
            maxHeight: "calc(100vh - 2rem)",
          },
        };
      case "right":
        return {
          classes: "right-0 w-15 flex-col",
          style: {
            top: "50%",
            transform: "translateY(-50%)",
            minHeight: "min(95vh, 50vh)",
            maxHeight: "calc(100vh - 2rem)",
          },
        };
      case "bottom":
      default:
        return {
          classes: "bottom-0 h-15 flex-row",
          style: {
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: "min(95vw, 50vw)",
            maxWidth: "calc(100vw - 2rem)",
          },
        };
    }
  };

  const config = getPositionConfig();
  const isHorizontal = position === "top" || position === "bottom";

  return (
    <div
      class={`absolute ${config.classes} z-[999] flex items-center justify-between bg-base-200 rounded-box my-2 shadow-[1px_0px_30px_-15px_rgba(0,0,0,0.75)] panel taskbar`}
      style={config.style}
    >
      <div
        className={`flex-1 ${isHorizontal ? 'min-w-0 overflow-x-auto' : 'min-h-0 overflow-y-auto'} flex gap-2 px-4 ${isHorizontal ? 'flex-row' : 'flex-col'}`}
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
      <div className="flex-shrink-0 shadow-sm h-full px-4 flex flex-wrap gap-2 items-center align-center justify-center rounded-box inverted-panel">
        <LocaleSelector />
        <ThemeSelector />
        <TaskbarClock />
      </div>
    </div>
  );
}
