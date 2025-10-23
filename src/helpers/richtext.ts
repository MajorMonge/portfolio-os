export const parseRichTextJSON = <T>(property: any, defaultValue: T): T => {
  try {
    if (property?.type === "rich_text" && property.rich_text.length > 0) {
      const content = property.rich_text[0].plain_text || "";
      if (!content) return defaultValue;

      const jsonString = content
        .replace(/;/g, ",")
        .replace(/,\s*}/g, "}")
        .replace(/(\w+):/g, '"$1":');

      return JSON.parse(jsonString);
    }
    return defaultValue;
  } catch (error) {
    console.error("Error parsing JSON from rich_text:", error);
    return defaultValue;
  }
}
