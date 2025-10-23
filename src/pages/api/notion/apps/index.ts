import type { APIRoute } from "astro";

import { queryApps } from "@/connections/notion";
import { getSubdomainFromHost, isAppAllowedInSubdomain  } from "@/helpers/subdomainHelper";
import { parseRichTextJSON } from "@/helpers/richtext";

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const requestBody = await request.json();
    const queryParameters = requestBody.query || {};

    const filter = queryParameters.filter;
    const sorts = queryParameters.sorts;

    const data = await queryApps(filter, sorts);

    const host = request.headers.get('host') || '';
    const currentSubdomain = getSubdomainFromHost(host);

    const filteredResults = data.results.filter((page: any) => {
      if (page.object !== 'page') return true;

      const allowedSubdomainsProperty = page.properties?.["AllowedSubdomains"];
      const allowedSubdomains = parseRichTextJSON<{
        excluded: string[];
        exclusive: string[];
      } | undefined>(allowedSubdomainsProperty, undefined);

      return isAppAllowedInSubdomain(allowedSubdomains, currentSubdomain);
    });

    return new Response(JSON.stringify({ ...data, results: filteredResults }), {
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
