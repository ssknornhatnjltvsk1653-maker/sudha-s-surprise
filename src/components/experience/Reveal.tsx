import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 26,
  blur = 12,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.35, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Particles({ count = 18, className = "" }: { count?: number; className?: string }) {
  const dots = Array.from({ length: count }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    return {
      left: `${(r * 100 + i * 7) % 100}%`,
      top: `${(r * 63 + i * 11) % 100}%`,
      size: 2 + ((i * 3) % 4),
      delay: (i % 7) * 0.6,
      dur: 4 + (i % 5),
    };
  });
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-blush"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            filter: "blur(0.5px)",
            boxShadow: "0 0 12px 3px color-mix(in oklab, var(--rose) 45%, transparent)",
            animation: `twinkle ${d.dur}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
