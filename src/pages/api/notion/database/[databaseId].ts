import type { APIRoute } from "astro";
import { getDatabaseData } from "@/connections/notion";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const { databaseId } = params;

    if (!databaseId) {
      return new Response(JSON.stringify({ error: "Database ID is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const data = await getDatabaseData(databaseId);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
