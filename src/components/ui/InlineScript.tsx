// Runs synchronously while the HTML is parsed, before first paint.
// `text/plain` on the client stops React from warning about script tags;
// suppressHydrationWarning covers the type mismatch (Next.js docs pattern).
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
