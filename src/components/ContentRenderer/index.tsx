import type { RichTextItemResponse } from "@notionhq/client";
import { h } from "preact";
import MDRendererComponent from "../MDRenderer";
import { useStore } from "@nanostores/preact";
import { $localeStore } from "@/store/LocaleStore";

interface ContentRendererProps {
  content: string | RichTextItemResponse | Record<string, string>;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const currentLocale = useStore($localeStore);

  if (
    typeof content !== "string" &&
    !Array.isArray(content) &&
    "href" in content &&
    content.href !== null &&
    content.href !== undefined
  ) {
    return <iframe src={content.href} class="w-full h-full border-none" />;
  }

  if (typeof content === "object" && !Array.isArray(content) && !("href" in content)) {
    const localizedContent = content as Record<string, string>;
    const localeKey = currentLocale.toLowerCase();
    const contentToRender = localizedContent[localeKey] || localizedContent[Object.keys(localizedContent)[0]] || "";
    return <MDRendererComponent content={contentToRender} />;
  }

  return (
    <MDRendererComponent
      content={typeof content === "string" ? content : content.plain_text}
    />
  );
}
