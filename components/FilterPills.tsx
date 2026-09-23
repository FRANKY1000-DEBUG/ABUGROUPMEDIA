"use client";

import { useState } from "react";
import clsx from "clsx";

export default function FilterPills({
  options,
  value,
  onChange
}: {
  options: string[];
  /** Fournir value + onChange pour un composant contrôlé (ex: filtre relié à des données). Sinon le composant gère son propre état visuel. */
  value?: string;
  onChange?: (option: string) => void;
}) {
  const [internalActive, setInternalActive] = useState(options[0]);
  const active = value ?? internalActive;

  function handleSelect(option: string) {
    if (onChange) onChange(option);
    else setInternalActive(option);
  }

  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 pt-6 md:px-10">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleSelect(option)}
          className={clsx(
            "flex-shrink-0 snap-start whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors sm:px-[18px] sm:py-2 sm:text-[13.5px]",
            active === option
              ? "border-ink bg-ink text-bg"
              : "border-line bg-surface text-muted hover:text-ink"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
