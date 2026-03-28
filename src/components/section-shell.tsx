import { cn } from "@/components/utils";

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("section", className)}>
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="mb-10">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/50">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="h2 font-[var(--font-playfair)]">{title}</h2>
          {description ? <p className="p mt-3 max-w-2xl">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
