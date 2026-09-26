// "(02) Selected work" style marker that opens each section.
export function SectionLabel({ index, children, className = "" }: { index: string; children: string; className?: string }) {
  return (
    <p data-reveal className={`label flex items-center gap-3 text-mute ${className}`}>
      <span className="text-accent">({index})</span>
      <span className="h-px w-8 bg-line" />
      {children}
    </p>
  );
}
