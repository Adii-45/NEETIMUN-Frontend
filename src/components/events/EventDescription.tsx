import ReactMarkdown, { type Components } from "react-markdown";

/**
 * Renders an event description (admin-authored Markdown stored as a plain
 * string). Output is React elements, never injected HTML: raw HTML in the
 * source is dropped (`skipHtml`), images are disallowed, and react-markdown's
 * default URL transform strips unsafe schemes such as `javascript:`. Plain-text
 * descriptions are valid Markdown, so existing events render as paragraphs.
 */
const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-8 font-display text-2xl text-navy-900 first:mt-0 sm:text-3xl">{children}</h2>
  ),
  h2: ({ children }) => (
    <h3 className="mt-8 font-display text-xl text-navy-900 first:mt-0 sm:text-2xl">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-6 font-display text-lg text-navy-900 first:mt-0">{children}</h4>
  ),
  h4: ({ children }) => (
    <h5 className="mt-6 text-sm font-semibold uppercase tracking-wide-label text-gold-600 first:mt-0">
      {children}
    </h5>
  ),
  // pre-line keeps single newlines (e.g. a date on its own line under a label).
  p: ({ children }) => <p className="mt-4 whitespace-pre-line first:mt-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-navy-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-1.5 pl-6 marker:text-gold-500">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-1.5 pl-6 marker:font-medium marker:text-gold-600">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  a: ({ href, children }) => {
    const external = !!href && /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="break-words font-medium text-gold-600 underline underline-offset-2 hover:text-navy-900"
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="mt-4 border-l-2 border-gold-400 pl-4 italic">{children}</blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-cream-200 px-1.5 py-0.5 text-[0.9em] text-navy-900">{children}</code>
  ),
};

export function EventDescription({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`max-w-2xl break-words text-base leading-relaxed text-muted ${className}`}>
      <ReactMarkdown components={components} skipHtml disallowedElements={["img"]} unwrapDisallowed>
        {children}
      </ReactMarkdown>
    </div>
  );
}

/** Markdown-free text for compact previews (e.g. event cards). */
export function markdownToPlainText(source: string): string {
  return source
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
