import type { Application } from "@/types/app";
import DesktopApp from "../DesktopApp";
import { h } from "preact";

interface DesktopGridProps {
  apps?: Application[];
  taskbarFit?: "left" | "right" | "bottom" | "top";
}

export default function DesktopGrid({ apps, taskbarFit }: DesktopGridProps) {
  const getPositionClasses = () => {
    switch (taskbarFit) {
      case "top":
        return "top-0 left-0 w-full h-[calc(100%-4.75rem)]";
      case "left":
        return "left-0 top-0 h-full w-[calc(100%-4.75rem)]";
      case "right":
        return "right-0 top-0 h-full w-[calc(100%-4.75rem)]";
      case "bottom":
        return "bottom-0 left-0 w-full h-[calc(100%-4.75rem)]";
      default:
        return "bottom-0 left-0 w-full h-[calc(100%-4.75rem)]";
    }
  };

  return (
    <div className={`w-full h-full ${getPositionClasses()} flex  flex-row`}>
      <div
        className={`w-full h-full p-4 grid grid-rows-[repeat(auto-fill,minmax(7rem,1fr))] auto-cols-max gap-2 grid-flow-col content-start justify-items-start`}
      >
        {apps && apps.map((app) => <DesktopApp key={app.id} app={app} />)}
      </div>
    </div>
  );
}
