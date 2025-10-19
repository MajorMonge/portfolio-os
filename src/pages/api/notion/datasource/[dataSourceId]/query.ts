import type { APIRoute } from "astro";

import { queryDataSource } from "@/connections/notion";

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { dataSourceId } = params;
    if (!dataSourceId) {
      return new Response(JSON.stringify({ error: "dataSourceId is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const requestBody = await request.json();
    const queryParameters = requestBody.query || {};

    const filter = queryParameters.filter;
    const sorts = queryParameters.sorts;

    const data = await queryDataSource(dataSourceId, filter, sorts);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error querying data source:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch data",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
