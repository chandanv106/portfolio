import type { CSSProperties } from "react";

type Props = {
  text: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  // "chars" rises letter by letter; "words" rises word by word.
  by?: "chars" | "words";
  // Delay before the first letter, in seconds.
  delay?: number;
  // Set false when a parent already carries data-split / data-words.
  standalone?: boolean;
};

// Server-rendered split so there is no layout shift on hydration. The
// animation itself is CSS, triggered when RevealObserver adds `.is-in`.
export function SplitText({ text, as: Tag = "span", className, by = "chars", delay = 0, standalone = true }: Props) {
  const words = text.split(" ");
  let i = 0;
  const marker = standalone ? (by === "chars" ? { "data-split": "" } : { "data-words": "" }) : {};

  return (
    <Tag
      className={className}
      style={delay ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
      {...marker}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, w) => (
        <span key={w} aria-hidden="true">
          <span className="split-word">
            {by === "chars" ? (
              Array.from(word).map((ch, c) => (
                <span key={c} className="split-char" style={{ "--i": i++ } as CSSProperties}>
                  {ch}
                </span>
              ))
            ) : (
              <span className="split-char" style={{ "--i": i++ } as CSSProperties}>
                {word}
              </span>
            )}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
