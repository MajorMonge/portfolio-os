import type { RichTextItemResponse } from "@notionhq/client";
import { h } from "preact";

interface ContentRendererProps {
  content: string | RichTextItemResponse;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  if (typeof content !== "string" && content.href !== null && content.href !== undefined) {
    return <iframe src={content.href} class="w-full h-full border-none" />;
  }

  return (
    <div>{typeof content === "string" ? content : content.plain_text}</div>
  );
}
