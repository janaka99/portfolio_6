import React from "react";
import { twMerge } from "tailwind-merge";

export default function Logo({ className }: { className?: string }) {
  return (
    <h1
      className={twMerge(
        "text-3xl tracking-tighter font-bold capitalize",
        className,
      )}
    >
      Janaka Chamith.
    </h1>
  );
}
