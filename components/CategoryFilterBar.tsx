"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { Category } from "@/lib/types";

export default function CategoryFilterBar({
  categories,
  activeSlug
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  const router = useRouter();

  const options: { label: string; slug?: string }[] = [
    { label: "Tout", slug: undefined },
    ...categories.map((c) => ({ label: c.name, slug: c.slug }))
  ];

  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 pt-6 md:px-10">
      {options.map((option) => {
        const isActive = activeSlug ? option.slug === activeSlug : !option.slug;
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => router.push(option.slug ? `/?categorie=${option.slug}` : "/")}
            className={clsx(
              "flex-shrink-0 snap-start whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors sm:px-[18px] sm:py-2 sm:text-[13.5px]",
              isActive ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
