import type { APIRoute } from "astro";
import { getPageContent } from "@/connections/notion";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const { pageId } = params;

    if (!pageId) {
      return new Response(JSON.stringify({ error: "Page ID is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data = await getPageContent(pageId);

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
