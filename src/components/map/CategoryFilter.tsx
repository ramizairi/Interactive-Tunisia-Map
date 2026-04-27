"use client";

import {
  Coffee,
  Hammer,
  Hotel,
  Landmark,
  MapPin,
  ShoppingBag,
  Sparkles,
  Sprout,
  Store,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { mapConfig, type CategoryDefinition } from "@/config/map";

const icons: Record<CategoryDefinition["icon"], LucideIcon> = {
  Sparkles,
  Hotel,
  Utensils,
  Coffee,
  Landmark,
  ShoppingBag,
  Waves,
  MapPin,
  Store,
  Sprout,
  Hammer,
};

interface CategoryFilterProps {
  selected: string;
  counts: Record<string, number>;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, counts, onSelect }: CategoryFilterProps) {
  return (
    <div className="pointer-events-auto w-[72px] rounded-lg border border-black/10 bg-white/76 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/76 md:w-[190px]">
      <div className="flex flex-col gap-1.5">
        {mapConfig.categories.map((category) => {
          const Icon = icons[category.icon];
          const isSelected = selected === category.id;
          const count = category.id === "all" ? counts.all || 0 : counts[category.id] || 0;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={[
                "group grid h-12 grid-cols-[36px] items-center rounded-lg text-sm font-semibold transition md:grid-cols-[32px_1fr_auto] md:gap-2 md:px-2",
                isSelected
                  ? "bg-zinc-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] dark:bg-white dark:text-zinc-950"
                  : "text-zinc-700 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm dark:text-zinc-300 dark:hover:bg-white/10",
              ].join(" ")}
              aria-pressed={isSelected}
              title={category.label}
            >
              <span
                className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg transition md:mx-0"
                style={{ backgroundColor: isSelected ? "transparent" : `${category.color}18` }}
              >
                <Icon size={17} style={{ color: isSelected ? undefined : category.color }} />
              </span>
              <span className="hidden truncate text-left md:block">{category.label}</span>
              <span
                className={[
                  "hidden min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs md:block",
                  isSelected ? "text-white/70 dark:text-zinc-950/60" : "bg-zinc-100 text-zinc-500 dark:bg-white/10",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
