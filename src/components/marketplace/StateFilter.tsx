"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function StateFilter({ selectedState, states }: { selectedState: string; states: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      value={selectedState}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("state", e.target.value);
        router.push(`/marketplace?${params.toString()}`);
      }}
      className="bg-white border border-[#E5DCCD] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#243B53] focus:outline-none"
    >
      {states.map((s) => (
        <option key={s} value={s}>
          State: {s}
        </option>
      ))}
    </select>
  );
}
