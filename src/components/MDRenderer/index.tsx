import { h, type JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface MDRendererProps {
  content: string;
}

export default function MDRendererComponent({
  content,
}: MDRendererProps): JSX.Element | null {
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parseMarkdown = async () => {
      const renderer = new marked.Renderer();

      renderer.heading = function (token) {
        const classes =
          {
            1: "text-5xl font-bold mb-4 mt-6",
            2: "text-2xl font-bold mb-4 mt-6",
            3: "text-xl font-semibold mb-3 mt-4",
            4: "text-lg font-semibold mb-2 mt-3",
            5: "text-base font-semibold mb-2 mt-2",
            6: "text-sm font-semibold mb-1 mt-2",
          }[token.depth] || "";
        const text = this.parser.parseInline(token.tokens);
        return `<h${token.depth} class="${classes}">${text}</h${token.depth}>`;
      };

      renderer.paragraph = function (token) {
        const text = this.parser.parseInline(token.tokens);
        return `<p class="mb-4">${text}</p>`;
      };

      renderer.list = function (token) {
        const tag = token.ordered ? "ol" : "ul";
        const classes = token.ordered
          ? "list-decimal list-inside mb-4 space-y-1"
          : "list-disc list-inside mb-4 space-y-1";
        const body = token.items.map((item) => this.listitem(item)).join("");
        return `<${tag} class="${classes}">${body}</${tag}>`;
      };

      renderer.listitem = function (token) {
        const text = this.parser.parseInline(token.tokens);
        return `<li>${text}</li>`;
      };

      renderer.blockquote = function (token) {
        const text = this.parser.parse(token.tokens);
        return `<blockquote class="border-l-4 border-base-300 pl-4 py-2 my-4 italic opacity-75">${text}</blockquote>`;
      };

      renderer.code = (token) => {
        return `<div class="mockup-code w-full"><pre><code class="language-${
          token.lang || ""
        }">${token.text}</code></pre></div>`;
      };

      renderer.codespan = (token) => {
        return `<code class="bg-base-200 text-base-content px-1.5 py-0.5 rounded text-sm font-mono">${token.text}</code>`;
      };

      renderer.link = function (token) {
        const titleAttr = token.title ? ` title="${token.title}"` : "";
        const text = this.parser.parseInline(token.tokens);
        return `<a href="${token.href}" class="link link-primary" ${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
      };

      renderer.image = (token) => {
        const titleAttr = token.title ? ` title="${token.title}"` : "";
        return `<img src="${token.href}" alt="${token.text}" class="max-w-full h-auto rounded-lg shadow-lg mb-4"${titleAttr} />`;
      };

      renderer.table = (token) => {
        return `<div class="overflow-x-auto mb-4"><table class="table table-zebra w-full">${token.header}${token.rows}</table></div>`;
      };

      renderer.tablecell = function (token) {
        const tag = token.header ? "th" : "td";
        const align = token.align ? ` style="text-align: ${token.align}"` : "";
        const text = this.parser.parseInline(token.tokens);
        return `<${tag}${align}>${text}</${tag}>`;
      };

      renderer.tablerow = (token) => {
        return `<tr>${token.text}</tr>`;
      };

      renderer.hr = () => {
        return `<div class="divider my-4"></div>`;
      };

      renderer.strong = function (token) {
        const text = this.parser.parseInline(token.tokens);
        return `<strong class="font-bold">${text}</strong>`;
      };

      renderer.em = function (token) {
        const text = this.parser.parseInline(token.tokens);
        return `<em class="italic">${text}</em>`;
      };

      renderer.del = function (token) {
        const text = this.parser.parseInline(token.tokens);
        return `<del class="line-through opacity-75">${text}</del>`;
      };

      renderer.text = (token) => {
        let text = token.text;
        text = text.replace(
          /\*\*(.+?)\*\*/g,
          '<strong class="font-bold">$1</strong>'
        );
        text = text.replace(
          /__(.+?)__/g,
          '<strong class="font-bold">$1</strong>'
        );
        text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
        text = text.replace(/_(.+?)_/g, '<em class="italic">$1</em>');
        return text;
      };

      marked.use({ renderer });

      const parsed = await marked.parse(content);
      if (contentWrapperRef.current) {
        contentWrapperRef.current.innerHTML = DOMPurify.sanitize(parsed);
      }
    };
    parseMarkdown();
  }, [content]);

  return <div ref={contentWrapperRef} class={`h-full w-full px-3 pb-3`}></div>;
}
