import { h } from "preact";
import TaskbarApp from "../TaskbarApp";
import {
  $appStore,
  $taskbarOrder,
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

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "top-0 left-1/2 transform -translate-x-1/2 h-15";
      case "left":
        return "left-0 top-1/2 transform -translate-y-1/2 flex-col h-auto w-15";
      case "right":
        return "right-0 top-1/2 transform -translate-y-1/2 flex-col h-auto w-15";
      case "bottom":
        return "bottom-0 left-1/2 transform -translate-x-1/2 h-15";
      default:
        return "bottom-0 left-1/2 transform -translate-x-1/2 h-15";
    }
  };

  return (
    <div
      class={`min-w-[80%] absolute ${getPositionClasses()} z-[999] flex gap-1 items-center justify-start bg-base-200 rounded-box mx-4 my-2 px-4 border-2 border-base-100 shadow-[1px_0px_30px_-15px_rgba(0,0,0,0.75)] w-auto panel taskbar`}
    >
      <div className={"basis-4/5 grow  flex gap-2"}>
        {taskbarApps.map((app) => (
          <TaskbarApp
            key={app.instanceId}
            icon={app.icon}
            onClick={() => {
              const currentApp = apps.find(
                (a) => a.instanceId === app.instanceId
              );
              if (!currentApp) return;

              if (currentApp.minimized) {
                toggleMinimize(app.instanceId!);
              } else if (app.instanceId === apps[apps.length - 1]?.instanceId) {
                toggleMinimize(app.instanceId!);
              } else {
                bringAppToFront(app.instanceId!);
              }
            }}
            isActive={
              app.instanceId === apps[apps.length - 1]?.instanceId &&
              !apps.find((a) => a.instanceId === app.instanceId)?.minimized
            }
          />
        ))}
      </div>
      <div
        className={
          "inset-shadow-xs h-full bg-base-100 px-4 flex gap-2 align-center rounded-box inverted-panel"
        }
      >
        <LocaleSelector />
        <ThemeSelector />
        <TaskbarClock />
      </div>
    </div>
  );
}
