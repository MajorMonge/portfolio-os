import type { Application } from "@/types/app";
import DesktopApp from "../DesktopApp";
import { h } from "preact";

interface DesktopGridProps {
  apps?: Application[];
  taskbarFit?: "left" | "right" | "bottom" | "top";
}

export default function DesktopGrid({ apps, taskbarFit = "bottom" }: DesktopGridProps) {
  const getPositionClasses = () => {
    switch (taskbarFit) {
      case "top":
        return "pt-[4.75rem] pb-0 pl-0 pr-0 top-0 left-0 w-full h-full";
      case "left":
        return "pt-0 pb-0 pl-[4.75rem] pr-0 left-0 top-0 h-full w-full";
      case "right":
        return "pt-0 pb-0 pl-0 pr-[4.75rem] right-0 top-0 h-full w-full";
      case "bottom":
      default:
        return "pt-0 pb-[4.75rem] pl-0 pr-0 bottom-0 left-0 w-full h-full";
    }
  };

  return (
    <div className={`absolute ${getPositionClasses()} flex flex-row`}>
      <div
        className={`w-full h-full p-4 grid grid-rows-[repeat(auto-fill,minmax(7rem,1fr))] auto-cols-max gap-2 grid-flow-col content-start justify-items-start`}
      >
        {apps && apps.map((app) => <DesktopApp key={app.id} app={app} />)}
      </div>
    </div>
  );
}
