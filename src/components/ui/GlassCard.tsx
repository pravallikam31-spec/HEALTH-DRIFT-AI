import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "violet" | "none";
  strong?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, Props>(
  ({ className, glow = "none", strong, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border-glow overflow-hidden",
          strong ? "glass-strong" : "glass",
          glow === "cyan" && "glow-cyan",
          glow === "violet" && "glow-violet",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
GlassCard.displayName = "GlassCard";
