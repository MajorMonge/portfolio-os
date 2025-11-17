import type { RichTextItemResponse } from "@notionhq/client";
import { h } from "preact";
import MDRendererComponent from "../MDRenderer";

interface ContentRendererProps {
  content: string | RichTextItemResponse;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  if (
    typeof content !== "string" &&
    content.href !== null &&
    content.href !== undefined
  ) {
    return <iframe src={content.href} class="w-full h-full border-none" />;
  } else {
    return (
      <MDRendererComponent
        content={typeof content === "string" ? content : content.plain_text}
      />
    );
  }
}
