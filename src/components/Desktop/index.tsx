import { h } from "preact";
import Taskbar from "../Taskbar";
import DesktopGrid from "../DesktopGrid";
import Window from "../Window";
import FullframeLoader from "../FullframeLoader";
import type { Application } from "@/types/app";
import { useEffect, useState } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import {
  $appStore,
  $focusOrder,
  bringAppToFront,
  closeApp,
  minimizeApp,
  updateAppPosition,
  updateAppSize,
  getAppZIndex,
} from "@/store/AppStore";
import { $localeStore } from "@/i18n";
import { $taskbarStore } from "@/store/TaskbarStore";
import { getLocalizedAppName } from "@/helpers/appLocalization";
import {
  fetchNotionPages,
  fetchNotionSpecificPage,
  getNotionApps,
  isNotionPages,
} from "@/services/notion";

const defaultApplications: Application[] = [];

export default function Desktop() {
  const [applications, setApplications] =
    useState<Application[]>(defaultApplications);
  const [isLoading, setIsLoading] = useState(true);

  const apps = useStore($appStore);
  const focusOrder = useStore($focusOrder);
  const locale = useStore($localeStore);
  const taskbarOptions = useStore($taskbarStore);
  const taskbarPosition = taskbarOptions.position;

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const notionApps = await getNotionApps();
        setApplications([...defaultApplications, ...notionApps]);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div class="w-full h-full absolute inset-0 overflow-hidden">
      <FullframeLoader isLoading={isLoading} />

      <DesktopGrid apps={applications} taskbarFit={taskbarPosition} />

      {apps.map((app) => {
        const isActive = focusOrder[focusOrder.length - 1] === app.instanceId;

        return (
          <Window
            key={app.instanceId}
            title={getLocalizedAppName(app)}
            initialX={app.x}
            initialY={app.y}
            width={app.width}
            height={app.height}
            resizable={app.resizable}
            minimized={app.minimized}
            isActive={isActive}
            stackPosition={getAppZIndex(app.instanceId!)}
            onClose={() => closeApp(app.instanceId!)}
            onMinimize={
              app.minimizable ? () => minimizeApp(app.instanceId!) : undefined
            }
            onMouseDown={() => bringAppToFront(app.instanceId!)}
            onPositionChange={(x, y) => updateAppPosition(app.instanceId!, x, y)}
            onSizeChange={(width, height) =>
              updateAppSize(app.instanceId!, width, height)
            }
          >
            {app.component}
          </Window>
        );
      })}

      <Taskbar />
    </div>
  );
}
