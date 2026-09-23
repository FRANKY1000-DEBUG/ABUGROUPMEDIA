import Link from "next/link";

// Rangée horizontale titrée (utilisée sur /profil et /bibliotheque).
export default function Shelf({
  title,
  href,
  hrefLabel = "Voir tout",
  emptyText,
  children
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
  emptyText: string;
  children: React.ReactNode[] | React.ReactNode;
}) {
  const isEmpty = Array.isArray(children) ? children.length === 0 : !children;

  return (
    <section className="mb-9">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[17px] font-bold">{title}</h2>
        {href && !isEmpty && (
          <Link href={href} className="text-[13px] text-muted hover:text-ink">
            {hrefLabel}
          </Link>
        )}
      </div>
      {isEmpty ? (
        <p className="text-sm text-muted">{emptyText}</p>
      ) : (
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">{children}</div>
      )}
    </section>
  );
}
