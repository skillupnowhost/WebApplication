export function PillRow({ title, items, className = "mt-10" }: { title: string; items: string[]; className?: string }) {
  return (
    <div className={`animate-fade-up ${className}`}>
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((s) => (
          <span
            key={s}
            className="rounded-full border border-border-soft bg-surface px-3.5 py-1.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-[var(--shadow-soft)]"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
