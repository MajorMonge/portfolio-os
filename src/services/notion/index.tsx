import ContentRenderer from "@/components/ContentRenderer";
import type { Application } from "@/types/app";
import { getLocale } from "@/i18n";
import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  DataSourceObjectResponse,
  GetPageResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
  QueryDataSourceParameters,
  QueryDataSourceResponse,
  RichTextItemResponse,
} from "@notionhq/client";

interface NotionPages {
  content: ListBlockChildrenResponse;
  metadata: GetPageResponse;
}

function isNotionPages(obj: any): obj is NotionPages {
  return (
    obj && typeof obj === "object" && "content" in obj && "metadata" in obj
  );
}

async function fetchNotionPages(): Promise<NotionPages | null> {
  try {
    const response = await fetch("/api/notion/page");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Notion pages:", error);
  }
  return null;
}

async function fetchNotionSpecificPage(
  pageId: string
): Promise<GetPageResponse | null> {
  const response = await fetch(`/api/notion/page/${pageId}`);
  const data = await response.json();
  return data;
}

async function fetchNotionPageMetadata(
  pageId: string
): Promise<PageObjectResponse | void> {
  const response = await fetch(`/api/notion/page/${pageId}/metadata`);
  const data = await response.json();
  return data;
}

async function fetchNotionDatabase(
  databaseId: string
): Promise<DatabaseObjectResponse | void> {
  const response = await fetch(`/api/notion/database/${databaseId}`);
  const data = await response.json();
  return data;
}

async function fetchNotionDataSource(
  dataSourceId: string
): Promise<DataSourceObjectResponse | void> {
  const response = await fetch(`/api/notion/datasource/${dataSourceId}`);
  const data = await response.json();
  return data;
}

async function fetchNotionBlock(
  blockId: string
): Promise<BlockObjectResponse | void> {
  const response = await fetch(`/api/notion/block/${blockId}`);
  const data = await response.json();
  return data;
}

async function fetchNotionBlockChildren(
  blockId: string
): Promise<ListBlockChildrenResponse | void> {
  const response = await fetch(`/api/notion/block/${blockId}/children`);
  const data = await response.json();
  return data;
}

async function queryNotionDataSource(
  dataSourceId: string,
  queryParameters?: QueryDataSourceParameters
): Promise<QueryDataSourceResponse | void> {
  const response = await fetch(`/api/notion/datasource/${dataSourceId}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: queryParameters }),
  });
  const data = await response.json();
  return data;
}

async function getNotionApps(
  queryParameters?: QueryDataSourceParameters
): Promise<Application[]> {
  const notionApps = await fetch("/api/notion/apps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: queryParameters }),
  });
  const data = await notionApps.json();
  const apps: Application[] = data.results.map((page: PageObjectResponse) =>
    pageToApplication(page)
  );
  return apps;
}

function extractRichTextContent(property: any): string {
  if (property?.type === "rich_text" && property.rich_text.length > 0) {
    return property.rich_text[0].plain_text || "";
  }
  return "";
}

function parseRichTextJSON<T>(property: any, defaultValue: T): T {
  try {
    const content = extractRichTextContent(property);
    if (!content) return defaultValue;
    const jsonString = content
      .replace(/;/g, ",")
      .replace(/,\s*}/g, "}")
      .replace(/(\w+):/g, '"$1":');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON from rich_text:", error);
    return defaultValue;
  }
}

function pageToApplication(page: PageObjectResponse): Application {
  const titleProperty = page.properties["Title"];
  let title = "Untitled";
  if (
    titleProperty &&
    titleProperty.type === "title" &&
    titleProperty.title.length > 0
  ) {
    title = titleProperty.title[0].plain_text;
  }

  // Get i18n data and store it for later use
  const i18nProperty = page.properties["i8n"];
  const i18nData = parseRichTextJSON<Record<string, any>>(i18nProperty, {});

  const appContentProperty = page.properties["AppContent"];
  let content: string | RichTextItemResponse = "";

  if (appContentProperty) {
    if (
      appContentProperty.type === "rich_text" &&
      appContentProperty.rich_text.length > 0
    ) {
      const richTextItem = appContentProperty.rich_text[0];
      if (richTextItem.href !== null && richTextItem.href !== undefined) {
        content = richTextItem.href;
      } else {
        content = richTextItem.plain_text || "";
      }
    } else if (appContentProperty.type === "url" && appContentProperty.url) {
      content = appContentProperty.url;
    }
  }

  const appConfigProperty = page.properties["AppConfig"];
  const appConfig = parseRichTextJSON(appConfigProperty, {
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    singleInstance: false,
    startMenuApp: false,
    desktopApp: true,
    isExternalLink: false,
    externalTarget: "_blank",
    width: undefined,
    height: undefined,
    x: undefined,
    y: undefined,
  });

  let icon: string = "📄";
  if (page.icon) {
    if (page.icon.type === "emoji") {
      icon = page.icon.emoji as string;
    } else if (page.icon.type === "file" && page.icon.file?.url) {
      icon = page.icon.file.url;
    } else if (
      page.icon.type === "external" &&
      "external" in page.icon &&
      page.icon.external?.url
    ) {
      icon = page.icon.external.url;
    }
  }

  return {
    id: page.id,
    name: title.toLowerCase().replace(/\s+/g, "-"),
    title: title,
    i18n: Object.keys(i18nData).length > 0 ? i18nData : undefined,
    icon: icon,
    component: <ContentRenderer content={content} />,
    resizable: appConfig.resizable,
    maximizable: appConfig.maximizable,
    minimizable: appConfig.minimizable,
    closable: appConfig.closable,
    singleInstance: appConfig.singleInstance,
    startMenuApp: appConfig.startMenuApp,
    desktopApp: appConfig.desktopApp,
    isExternalLink: appConfig.isExternalLink,
    externalTarget: appConfig.externalTarget,
    width: appConfig.width,
    height: appConfig.height,
    x: appConfig.x,
    y: appConfig.y,
  };
}

export {
  fetchNotionPages,
  fetchNotionSpecificPage,
  fetchNotionPageMetadata,
  fetchNotionDatabase,
  fetchNotionDataSource,
  fetchNotionBlock,
  fetchNotionBlockChildren,
  queryNotionDataSource,
  isNotionPages,
  getNotionApps,
  pageToApplication,
};
