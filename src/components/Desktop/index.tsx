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
  bringAppToFront,
  closeApp,
  minimizeApp,
  updateAppPosition,
  updateAppSize,
} from "@/store/AppStore";
import { $localeStore } from "@/i18n";
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

  const [taskbarPosition, setTaskbarPosition] = useState<
    "left" | "right" | "bottom" | "top"
  >("bottom");

  const apps = useStore($appStore);
  const locale = useStore($localeStore);

  const BASE_ZINDEX = 100;

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

      {apps.map((app, index) => (
        <Window
          key={app.instanceId}
          title={getLocalizedAppName(app)}
          initialX={app.x}
          initialY={app.y}
          width={app.width}
          height={app.height}
          resizable={app.resizable}
          minimized={app.minimized}
          stackPosition={BASE_ZINDEX + index}
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
      ))}

      <Taskbar position={taskbarPosition} />
    </div>
  );
}
