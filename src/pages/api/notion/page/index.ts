import type { APIRoute } from "astro";
import { getMainPages, getPageContent } from "@/connections/notion";

export const GET: APIRoute = async ({ params }) => {
  try {
    const { pageId } = params;

    let data;
    if (pageId) {
      data = await getPageContent(pageId);
    } else {
      data = await getMainPages();
    }

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
