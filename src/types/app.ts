export interface Application {
  id: string;
  name: string;
  icon: string | preact.JSX.Element;
  component: preact.JSX.Element;
  title: string;
  i18n?: Record<string, { appName?: string }>;
  resizable?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
  closable?: boolean;
  singleInstance?: boolean;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  startMenuApp?: boolean;
  desktopApp?: boolean;
  instanceId?: string;
  minimized?: boolean;
  isExternalLink?: boolean;
  externalTarget?: string;
}
