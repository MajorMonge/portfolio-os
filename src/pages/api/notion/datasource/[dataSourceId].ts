import type { APIRoute } from "astro";
import { getDataSourceData } from "@/connections/notion"; 

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
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
    const data = await getDataSourceData(dataSourceId);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data source:", error);
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