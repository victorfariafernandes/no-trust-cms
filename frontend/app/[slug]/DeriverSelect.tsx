"use client";

import { keyDerivers } from "@/app/_lib/crypto";
import type { DeriverId } from "@/app/_lib/crypto";

interface Props {
  value: DeriverId;
  onChange: (id: DeriverId) => void;
}

export function DeriverSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as DeriverId)}
      className="border border-black/20 dark:border-white/20 rounded px-2 py-1 text-xs bg-white dark:bg-black outline-none focus:border-black dark:focus:border-white"
    >
      {keyDerivers.map((d) => (
        <option key={d.id} value={d.id}>
          {d.label}
        </option>
      ))}
    </select>
  );
}
