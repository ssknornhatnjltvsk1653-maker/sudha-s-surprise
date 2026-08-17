import { useMemo } from "react";

/** Slow, GPU-friendly floating hearts. Purely decorative. */
export function FloatingHearts({
  count = 12,
  className = "",
  opacity = 0.5,
}: {
  count?: number;
  className?: string;
  opacity?: number;
}) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = ((i * 9301 + 49297) % 233280) / 233280;
        return {
          left: `${(r * 92 + i * 6.5) % 96}%`,
          size: 10 + ((i * 5) % 16),
          delay: -(i % 9) * 1.7,
          dur: 13 + ((i * 3) % 9),
          drift: (i % 2 === 0 ? 1 : -1) * (12 + (i % 4) * 9),
        };
      }),
    [count],
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {hearts.map((h, i) => (
        <span
          key={i}
          className="heart-float absolute"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            opacity,
            animationDuration: `${h.dur}s`,
            animationDelay: `${h.delay}s`,
            ["--drift" as string]: `${h.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/** Burst of hearts + sparkles from a point, used on unlock. */
export function burstHearts(x: number, y: number, count = 22) {
  const layer = document.createElement("div");
  layer.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden;contain:strict";
  document.body.appendChild(layer);

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    const isHeart = i % 3 !== 0;
    el.className = isHeart ? "heart-shape" : "sparkle-shape";
    const size = isHeart ? Math.random() * 12 + 10 : Math.random() * 5 + 3;
    el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;`;
    layer.appendChild(el);
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = Math.random() * 170 + 90;
    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.4) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist - 40}px)) scale(1) rotate(${Math.random() * 260 - 130}deg)`,
          opacity: 0,
        },
      ],
      { duration: Math.random() * 700 + 900, easing: "cubic-bezier(0.16,0.84,0.34,1)" },
    );
  }
  setTimeout(() => layer.remove(), 2000);
}
