import { motion } from "framer-motion";
import { Delete, Check, Heart, Lock } from "lucide-react";
import { useCallback, useState } from "react";
import { FloatingHearts, burstHearts } from "./Hearts";

const CODE = "0706";
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function tap(ms = 12) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      /* ignore */
    }
  }
}

export function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [digits, setDigits] = useState("");
  const [error, setError] = useState(false);
  const [opened, setOpened] = useState(false);

  const succeed = useCallback(() => {
    setOpened(true);
    tap(40);
    if (typeof window !== "undefined") {
      burstHearts(window.innerWidth / 2, window.innerHeight * 0.42, 26);
      setTimeout(() => burstHearts(window.innerWidth / 2, window.innerHeight * 0.5, 18), 320);
    }
    setTimeout(onUnlock, 1500);
  }, [onUnlock]);

  const validate = useCallback(
    (value: string) => {
      if (value === CODE) {
        succeed();
      } else {
        tap(60);
        setError(true);
        setTimeout(() => {
          setDigits("");
          setError(false);
        }, 900);
      }
    },
    [succeed],
  );

  const press = (key: string) => {
    if (opened || error) return;
    tap();
    const next = (digits + key).slice(0, 4);
    setDigits(next);
    if (next.length === 4) setTimeout(() => validate(next), 260);
  };

  const back = () => {
    if (opened) return;
    tap();
    setError(false);
    setDigits((d) => d.slice(0, -1));
  };

  const confirm = () => {
    if (opened) return;
    if (digits.length === 4) validate(digits);
    else {
      tap(60);
      setError(true);
      setTimeout(() => setError(false), 900);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "var(--gate-bg)" }}
      animate={opened ? { opacity: 0, scale: 1.08, filter: "blur(18px)" } : {}}
      transition={{ duration: 1.3, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <FloatingHearts count={14} opacity={0.4} />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--rose) 32%, transparent), transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[19rem] text-center select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={
            opened
              ? { opacity: 1, scale: 1.25, rotate: [0, -8, 6, 0] }
              : { opacity: 1, scale: 1, y: [0, -5, 0] }
          }
          transition={
            opened
              ? { duration: 1 }
              : { opacity: { duration: 1 }, scale: { duration: 1 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
          }
          className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--shadow-dream)",
          }}
        >
          {opened ? (
            <Heart className="h-6 w-6 text-blush" fill="currentColor" />
          ) : (
            <Lock className="h-5 w-5 text-blush" />
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-3xl leading-snug sm:text-4xl"
        >
          A little surprise
          <br />
          <span className="text-blush italic">for Doroty ❤️</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1 }}
          className="mt-4 text-xs tracking-[0.28em] text-muted-foreground uppercase"
        >
          only someone special can unlock this
        </motion.p>

        {/* dots */}
        <motion.div
          animate={error ? { x: [0, -11, 10, -7, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex items-center justify-center gap-4 rounded-full px-6 py-4"
          style={{
            background: "var(--glass-bg)",
            border: `1px solid ${error ? "color-mix(in oklab, var(--destructive) 55%, transparent)" : "var(--glass-border)"}`,
            backdropFilter: "blur(20px)",
          }}
        >
          {[0, 1, 2, 3].map((i) => {
            const filled = i < digits.length;
            return (
              <motion.span
                key={i}
                animate={
                  opened
                    ? { scale: [1, 1.6, 0.9], opacity: [1, 1, 0.4] }
                    : { scale: filled ? 1.15 : 1 }
                }
                transition={{ duration: opened ? 0.7 : 0.3, delay: opened ? i * 0.09 : 0 }}
                className="h-3 w-3 rounded-full"
                style={{
                  background: filled ? "var(--gradient-glow)" : "color-mix(in oklab, white 18%, transparent)",
                  boxShadow: filled
                    ? "0 0 16px 3px color-mix(in oklab, var(--rose) 55%, transparent)"
                    : "none",
                }}
              />
            );
          })}
        </motion.div>

        <div className="mt-3 h-5">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-wide text-blush"
            >
              hmm, that's not it — try again, my love ❤️
            </motion.p>
          )}
        </div>

        {/* keypad */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {KEYS.map((k) => (
            <KeyButton key={k} onPress={() => press(k)} label={k} />
          ))}
          <KeyButton onPress={back} label={<Delete className="mx-auto h-5 w-5" />} muted />
          <KeyButton onPress={() => press("0")} label="0" />
          <KeyButton onPress={confirm} label={<Check className="mx-auto h-5 w-5" />} accent />
        </div>
      </div>
    </motion.div>
  );
}

function KeyButton({
  label,
  onPress,
  muted,
  accent,
}: {
  label: React.ReactNode;
  onPress: () => void;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className="font-display flex h-16 items-center justify-center rounded-2xl text-2xl transition-colors duration-300 active:brightness-125"
      style={{
        background: accent ? "var(--gradient-glow)" : "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        color: accent ? "oklch(0.2 0.03 20)" : muted ? "var(--color-muted-foreground)" : "var(--color-foreground)",
        backdropFilter: "blur(18px)",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      {label}
    </motion.button>
  );
}
