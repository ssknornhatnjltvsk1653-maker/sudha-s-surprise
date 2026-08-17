import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 192;

function padFrame(index: number) {
  return index.toString().padStart(5, "0");
}
function getFrameUrl(index: number) {
  return `/frames/frame_${padFrame(index)}.webp`;
}

function spawnBurst(container: HTMLElement, x: number, y: number) {
  const count = 10;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "petal burst-petal";
    const size = Math.random() * 8 + 6;
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.opacity = "0.9";
    container.appendChild(el);
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const distance = Math.random() * 90 + 60;
    const duration = Math.random() * 600 + 700;
    const rotateAmt = Math.random() * 480 - 240;
    const anim = el.animate(
      [
        { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 0.9 },
        {
          transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${rotateAmt}deg) scale(1)`,
          opacity: 0,
        },
      ],
      { duration, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
    );
    anim.onfinish = () => el.remove();
  }
}

/**
 * The original scroll-scrubbed cherry blossom frame sequence, preserved.
 * It now lives as a fixed background layer behind the whole experience.
 */
export function BlossomBackground({ onReady }: { onReady?: (ready: boolean) => void }) {
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>(new Array(TOTAL_FRAMES));
  const progressRef = useRef(0);
  const smoothRef = useRef(0);

  useEffect(() => {
    onReady?.(isLoaded);
  }, [isLoaded, onReady]);

  // Smooth scrolling + scroll progress across the whole document
  useEffect(() => {
    let rafId = 0;
    let destroy = () => {};
    let mounted = true;

    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      progressRef.current = Math.min(1, Math.max(0, p));
      smoothRef.current += (progressRef.current - smoothRef.current) * 0.08;
    };

    import("lenis").then(({ default: Lenis }) => {
      if (!mounted) return;
      const lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });
      const raf = (time: number) => {
        lenis.raf(time);
        updateProgress();
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      destroy = () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    });

    return () => {
      mounted = false;
      destroy();
    };
  }, []);

  // Frame preloading
  useEffect(() => {
    let loaded = 0;
    const initialBatch = 30;
    const loadFrame = (i: number, isInitial: boolean) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          imagesRef.current[i] = img;
          loaded++;
          if (isInitial) setLoadedPercent(Math.min(100, Math.floor((loaded / initialBatch) * 100)));
          resolve();
        };
        img.onerror = () => resolve();
      });
    const preload = async () => {
      await Promise.all(Array.from({ length: initialBatch }, (_, i) => loadFrame(i, true)));
      setIsLoaded(true);
      for (let i = initialBatch; i < TOTAL_FRAMES; i++) loadFrame(i, false);
    };
    preload();
  }, []);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    let animationFrameId = 0;
    let currentDrawnIndex = -1;
    const render = () => {
      const p = smoothRef.current;
      const images = imagesRef.current;
      const targetIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(p * (TOTAL_FRAMES - 1))),
      );
      let drawIndex = targetIndex;
      if (!images[drawIndex]) {
        let found = -1;
        for (let d = 1; d < TOTAL_FRAMES; d++) {
          if (images[targetIndex - d]) {
            found = targetIndex - d;
            break;
          }
          if (images[targetIndex + d]) {
            found = targetIndex + d;
            break;
          }
        }
        drawIndex = found >= 0 ? found : drawIndex;
      }
      if (drawIndex !== currentDrawnIndex && images[drawIndex]) {
        const img = images[drawIndex]!;
        const canvasRatio = window.innerWidth / window.innerHeight;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;
        if (canvasRatio > imgRatio) {
          drawWidth = window.innerWidth;
          drawHeight = window.innerWidth / imgRatio;
          offsetX = 0;
          offsetY = (window.innerHeight - drawHeight) / 2;
        } else {
          drawHeight = window.innerHeight;
          drawWidth = window.innerHeight * imgRatio;
          offsetX = (window.innerWidth - drawWidth) / 2;
          offsetY = 0;
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "#0d0c0b";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        const zoom = 1 + p * 0.05;
        ctx.save();
        ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        ctx.fillStyle = `rgba(255, 230, 220, ${0.05 + p * 0.1})`;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.restore();
        currentDrawnIndex = drawIndex;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded]);

  // Ambient petals + tap burst
  useEffect(() => {
    if (!isLoaded) return;
    const container = petalRef.current;
    if (!container) return;
    const petalCount = window.innerWidth < 768 ? 15 : 40;
    const petals: HTMLDivElement[] = [];
    const petalRafIds: number[] = [];
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("div");
      petal.className = "petal";
      petal.style.width = Math.random() * 8 + 6 + "px";
      petal.style.height = Math.random() * 8 + 6 + "px";
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.top = Math.random() * 100 + "vh";
      petal.style.opacity = (Math.random() * 0.5 + 0.3).toString();
      container.appendChild(petal);
      petals.push(petal);
      const speed = Math.random() * 1 + 0.5;
      const sway = Math.random() * 2 + 1;
      let angle = Math.random() * Math.PI * 2;
      let y = parseFloat(petal.style.top);
      let x = parseFloat(petal.style.left);
      const idx = i;
      const animatePetal = () => {
        angle += 0.02;
        y += speed;
        x += Math.sin(angle) * sway * 0.5;
        if (y > window.innerHeight + 20) {
          y = -20;
          x = Math.random() * window.innerWidth;
        }
        if (x > window.innerWidth + 20) x = -20;
        if (x < -20) x = window.innerWidth + 20;
        petal.style.top = y + "px";
        petal.style.left = x + "px";
        petal.style.transform = `rotate(${angle * 20}deg)`;
        petalRafIds[idx] = requestAnimationFrame(animatePetal);
      };
      petalRafIds[idx] = requestAnimationFrame(animatePetal);
    }
    const handlePointer = (e: PointerEvent) => spawnBurst(container, e.clientX, e.clientY);
    window.addEventListener("pointerdown", handlePointer);
    return () => {
      window.removeEventListener("pointerdown", handlePointer);
      petalRafIds.forEach((id) => cancelAnimationFrame(id));
      petals.forEach((p) => p.remove());
    };
  }, [isLoaded]);

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-background">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--veil-dream)" }}
        />
        <div className="grain pointer-events-none absolute inset-0" />
      </div>
      <div ref={petalRef} className="pointer-events-none fixed inset-0 z-30 overflow-hidden" />
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
          <p className="font-display text-3xl tracking-[0.2em] text-foreground/80">for you</p>
          <div className="mt-8 h-px w-56 overflow-hidden rounded-full bg-foreground/15">
            <div
              className="h-full bg-[var(--gradient-glow)] transition-all duration-300 ease-out"
              style={{ width: `${loadedPercent}%` }}
            />
          </div>
          <p className="mt-4 text-xs tracking-[0.35em] text-muted-foreground uppercase">
            gathering petals
          </p>
        </div>
      )}
    </>
  );
}
