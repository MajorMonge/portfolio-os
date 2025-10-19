import { Client } from "@notionhq/client"; import {
  getSecret,
} from 'astro:env/server';

const notionClient = new Client({
  auth: getSecret('NOTION_TOKEN'),
})

const notionDatabaseID = getSecret('NOTION_DATA_SOURCE_ID');
const notionEntryPageID = getSecret('NOTION_ENTRY_PAGE_ID');

const getMainPages = async () => {
  if (!notionEntryPageID) {
    throw new Error('Entry Page ID not configured');
  }

  const pageContent = await getPageContent(notionEntryPageID);
  const metadata = await getPageMetadata(notionEntryPageID);

  return { content: pageContent, metadata };
}

const getPageContent = async (pageId: string) => {
  const response = await notionClient.blocks.children.list({
    block_id: pageId,
  });

  return response;
}

const getPageMetadata = async (pageId: string) => {
  const response = await notionClient.pages.retrieve({
    page_id: pageId,
  });
  return response;
}

const getDatabaseData = async (databaseId: string) => {
  const response = await notionClient.databases.retrieve({
    database_id: databaseId,
  });
  return response
}

const getDataSourceData = async (dataSourceId: string) => {
  const response = await notionClient.dataSources.retrieve({
    data_source_id: dataSourceId,
  });

  return response;
}

const getBlockData = async (blockId: string) => {
  const response = await notionClient.blocks.retrieve({
    block_id: blockId,
  });
  return response;
}

const getBlockChildren = async (blockId: string) => {
  const response = await notionClient.blocks.children.list({
    block_id: blockId,
  });
  return response;
}

const queryDataSource = async (dataSourceId: string, filter?: any, sorts?: any) => {
  const queryParams: any = {
    data_source_id: dataSourceId,
  };

  if (filter && Object.keys(filter).length > 0) {
    queryParams.filter = filter;
  }

  if (sorts && Object.keys(sorts).length > 0) {
    queryParams.sorts = sorts;
  }

  const response = await notionClient.dataSources.query(queryParams);
  return response;
}

const queryApps = async (filter?: any, sorts?: any) => {
  const apps = await queryDataSource(notionDatabaseID!, filter, sorts);
  return apps;
}

export { notionClient, notionDatabaseID, notionEntryPageID, queryApps, getMainPages, getPageContent, getDatabaseData, getDataSourceData, getPageMetadata, getBlockData, getBlockChildren, queryDataSource };
