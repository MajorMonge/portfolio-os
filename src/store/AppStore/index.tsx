import type { Application } from "@/types/app";
import { atom } from "nanostores";

export const $appStore = atom<Application[]>([]);
export const $taskbarOrder = atom<Application[]>([]);

const BASE_ZINDEX = 100;

function generateInstanceId(): string {
  return `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getAppZIndex(instanceId: string): number {
  const apps = $appStore.get();
  const index = apps.findIndex((a) => a.instanceId === instanceId);
  if (index === -1) return BASE_ZINDEX;
  return BASE_ZINDEX + index;
}

export function getAppsWithZIndex(): Array<Application & { zIndex: number }> {
  const apps = $appStore.get();
  return apps.map((app, index) => ({
    ...app,
    zIndex: BASE_ZINDEX + index,
  }));
}

export function bringAppToFront(instanceId: string) {
  const apps = $appStore.get();
  const appIndex = apps.findIndex((a) => a.instanceId === instanceId);

  if (appIndex === -1) {
    return;
  }

  if (appIndex === apps.length - 1) {
    return;
  }

  const app = apps[appIndex];
  const newApps = [
    ...apps.slice(0, appIndex),
    ...apps.slice(appIndex + 1),
    app,
  ];
  $appStore.set(newApps);
}

export function openApp(app: Application) {
  console.log("Opening app:", app);
  if (app.isExternalLink) {
    const content = app.component?.props?.content;
    let url: string | undefined;

    if (typeof content === 'string') {
      url = content;
    } else if (content?.href) {
      url = content.href;
    }

    if (url) {
      const target = app.externalTarget || '_blank';
      window.open(url, target, 'noopener,noreferrer');
    }
    return;
  }

  const apps = $appStore.get();
  const taskbarOrder = $taskbarOrder.get();
  const existingApp = apps.find((a) => a.id === app.id && app.singleInstance);

  if (app.singleInstance && existingApp) {
    if (existingApp.minimized) {
      restoreApp(existingApp.instanceId!);
    } else {
      bringAppToFront(existingApp.instanceId!);
    }
    return;
  }

  const newApp = {
    ...app,
    instanceId: generateInstanceId(),
  };

  $appStore.set([...apps, newApp]);

  $taskbarOrder.set([...taskbarOrder, newApp]);
}

export function closeApp(instanceId: string) {
  const apps = $appStore.get();
  const taskbarOrder = $taskbarOrder.get();

  $appStore.set(apps.filter((a) => a.instanceId !== instanceId));
  $taskbarOrder.set(taskbarOrder.filter((a) => a.instanceId !== instanceId));
}

export function minimizeApp(instanceId: string) {
  const apps = $appStore.get();
  const updatedApps = apps.map((app) =>
    app.instanceId === instanceId ? { ...app, minimized: true } : app
  );
  $appStore.set(updatedApps);
}

export function restoreApp(instanceId: string) {
  const apps = $appStore.get();
  const appIndex = apps.findIndex((a) => a.instanceId === instanceId);

  if (appIndex === -1) return;

  const app = apps[appIndex];
  const restoredApp = { ...app, minimized: false };

  const newApps = [
    ...apps.slice(0, appIndex),
    ...apps.slice(appIndex + 1),
    restoredApp,
  ];
  $appStore.set(newApps);
}

export function toggleMinimize(instanceId: string) {
  const apps = $appStore.get();
  const app = apps.find((a) => a.instanceId === instanceId);

  if (!app) return;

  if (app.minimized) {
    restoreApp(instanceId);
  } else {
    minimizeApp(instanceId);
  }
}

export function updateAppPosition(instanceId: string, x: number, y: number) {
  const apps = $appStore.get();
  const updatedApps = apps.map((app) =>
    app.instanceId === instanceId ? { ...app, x, y } : app
  );
  $appStore.set(updatedApps);
}

export function updateAppSize(
  instanceId: string,
  width: number,
  height: number
) {
  const apps = $appStore.get();
  const updatedApps = apps.map((app) =>
    app.instanceId === instanceId ? { ...app, width, height } : app
  );
  $appStore.set(updatedApps);
}
