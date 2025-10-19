import type { RichTextItemResponse } from "@notionhq/client";
import { h } from "preact";

interface ContentRendererProps {
  content: string | RichTextItemResponse;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const isUrl =
    typeof content === "string" &&
    (content.startsWith("http://") || content.startsWith("https://"));

  if (isUrl) {
    return <iframe src={content as string} class="w-full h-full border-none" />;
  }

  if (typeof content !== "string" && content.href) {
    return <iframe src={content.href} class="w-full h-full border-none" />;
  }

  return (
    <div>{typeof content === "string" ? content : content.plain_text}</div>
  );
}
