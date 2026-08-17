import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkles, Gift, Play, Music } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlossomBackground } from "@/components/experience/BlossomBackground";
import { Particles, Reveal } from "@/components/experience/Reveal";
import { FloatingHearts, burstHearts } from "@/components/experience/Hearts";
import { PasswordGate } from "@/components/experience/PasswordGate";

const TITLE = "Happy National Couple Day, Sudha ❤️";
const DESC =
  "A little interactive surprise Shourya made for Sudha — for National Couple Day, and for every ordinary day in between.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});

const section = "relative mx-auto w-full max-w-3xl px-6 py-24 sm:px-8 sm:py-32";
const eyebrow = "text-[0.65rem] tracking-[0.42em] text-muted-foreground uppercase";

function tap(ms = 14) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      /* ignore */
    }
  }
}

function Experience() {
  const [unlocked, setUnlocked] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback((v: boolean) => setReady(v), []);

  const locked = !unlocked || !introDone;

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);

  return (
    <main className="relative min-h-screen overflow-x-hidden text-foreground">
      <AnimatePresence>
        {!unlocked && <PasswordGate key="gate" onUnlock={() => setUnlocked(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {unlocked && !introDone && <Intro key="intro" onDone={() => setIntroDone(true)} />}
      </AnimatePresence>

      {unlocked && (
        <>
          <BlossomBackground onReady={onReady} />
          <FloatingHearts count={10} opacity={0.32} className="fixed inset-0 z-[5]" />
          {ready && (
            <motion.div
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: introDone ? 1 : 0, scale: introDone ? 1 : 1.03 }}
              transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
              className="relative z-10"
            >
              <Hero />
              <OpeningMessage />
              <TheDayItStarted />
              <ThankYou />
              <NotAlwaysPerfect />
              <ThingsILove />
              <Letter />
              <HiddenMessage />
              <Finale />
            </motion.div>
          )}
        </>
      )}
    </main>
  );
}

/* ── Cinematic intro ────────────────────────────────────────── */
const introLines = ["For Sudha ❤️", "Happy National Couple Day", "From Shourya"];

function Intro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 2600),
      setTimeout(() => setStep(2), 5200),
      setTimeout(onDone, 8200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: "var(--gate-bg)" }}
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.06 }}
      transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <FloatingHearts count={12} opacity={0.35} />
      <Particles count={18} />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[85vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--rose) 30%, transparent), transparent 70%)",
        }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 22, filter: "blur(16px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(14px)" }}
          transition={{ duration: 1.3, ease: [0.22, 0.61, 0.36, 1] }}
          className={
            step === 1
              ? "font-display relative text-3xl leading-snug sm:text-5xl"
              : "font-script relative text-4xl text-blush sm:text-6xl"
          }
        >
          {introLines[step]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <Particles count={20} />
      <div className={section}>
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.9em", filter: "blur(14px)" }}
          animate={{ opacity: 0.75, letterSpacing: "0.42em", filter: "blur(0px)" }}
          transition={{ duration: 2.2, ease: [0.22, 0.61, 0.36, 1] }}
          className={eyebrow}
        >
          national couple day
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 34, filter: "blur(18px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2, delay: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-8 text-4xl leading-[1.15] sm:text-6xl"
        >
          Happy National
          <br />
          Couple Day <span className="text-blush">❤️</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 22, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.8, delay: 1.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-script mt-6 text-4xl text-blush sm:text-5xl"
        >
          Shourya <span className="font-display not-italic">×</span> Sudha
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 2.3 }}
          className="mt-9 h-px w-40 origin-left bg-[var(--gradient-glow)] opacity-70"
        />

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.8, delay: 2.9, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-9 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          One little website for one very special person.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.2, duration: 1.4 }}
          className="mt-16 flex items-center gap-3 text-xs tracking-[0.3em] text-muted-foreground uppercase"
        >
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          scroll slowly
        </motion.div>
      </div>
    </section>
  );
}

/* ── The first, most personal message ───────────────────────── */
const opening = [
  "Sach bolun toh, mujhe kabhi kabhi samajh hi nahi aata ki tumhe exactly kaise explain karun ki tum mere liye kya ho. I start typing something, delete it, and start again — kyunki har baar lagta hai kuch reh gaya.",
  "So instead of trying to say it in one message, I made this. Ek chhoti si cheez, but I sat and thought about you the whole time I was making it.",
  "Bas itna pata hai ki tum mere liye bohot special ho. 7 December is the day you became my girlfriend, and that date stayed with me in a way I can't really put into normal words.",
  "I know sab din same nahi hote. Kabhi baat zyada hoti hai, kabhi kam. But my feelings didn't just disappear somewhere in between. I still care, a lot, and I still value what we have.",
  "This isn't me asking you for anything. No pressure, no expectations. I just wanted you to feel loved today — that's genuinely the only reason this exists.",
];

function OpeningMessage() {
  return (
    <section className={section}>
      <Reveal>
        <p className={eyebrow}>something i wanted to say</p>
        <h2 className="mt-5 text-3xl leading-tight sm:text-5xl">
          Sudha, <span className="text-blush italic">read this slowly</span>
        </h2>
      </Reveal>

      <div className="card-premium sheen relative mt-12 space-y-6 p-7 sm:p-11">
        <Particles count={12} />
        {opening.map((line, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <p className="relative text-lg leading-relaxed text-foreground/90 sm:text-xl">{line}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── The day it started ─────────────────────────────────────── */
function TheDayItStarted() {
  return (
    <section className={`${section} text-center`}>
      <Reveal>
        <p className={eyebrow}>the day it started</p>
        <h2 className="mt-5 text-3xl leading-tight sm:text-5xl">
          A date that quietly became <span className="text-blush italic">ours</span>
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="glass sheen animate-drift relative mx-auto mt-14 max-w-md overflow-hidden px-8 py-14">
          <Particles count={12} />
          <div className="relative flex items-center justify-center gap-5 sm:gap-7">
            {["07", "•", "12"].map((part, i) => (
              <motion.span
                key={part}
                initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.35 }}
                className={
                  part === "•"
                    ? "text-3xl text-blush/70 sm:text-4xl"
                    : "font-display text-6xl leading-none text-blush sm:text-7xl"
                }
                style={
                  part === "•"
                    ? undefined
                    : { textShadow: "0 0 40px color-mix(in oklab, var(--rose) 45%, transparent)" }
                }
              >
                {part}
              </motion.span>
            ))}
          </div>
          <p className="relative mt-8 text-sm tracking-[0.32em] text-muted-foreground uppercase">
            7 december
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Uss din se pehle it was just another date on the calendar. Now it's the day we became a
          couple — the beginning of everything that came after.
        </p>
      </Reveal>
    </section>
  );
}

/* ── Thank you for being my girlfriend ──────────────────────── */
function ThankYou() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -6,
      y: ((e.clientX - r.left) / r.width - 0.5) * 6,
    });
  };

  return (
    <section className={section}>
      <Reveal>
        <p className={eyebrow}>thank you</p>
        <h2 className="mt-5 text-3xl leading-tight sm:text-5xl">
          Thank you for being <span className="text-blush italic">my girlfriend</span>
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div
          ref={ref}
          onPointerMove={handleMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          style={{ perspective: 1200 }}
          className="mt-12"
        >
          <motion.div
            animate={{ rotateX: tilt.x, rotateY: tilt.y }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="glass sheen relative overflow-hidden p-8 sm:p-12"
            style={{ transformStyle: "preserve-3d", boxShadow: "var(--shadow-dream)" }}
          >
            <Particles count={12} />
            <p className="relative text-lg leading-relaxed text-foreground/90 sm:text-xl">
              Thank you for saying haan that day. I don't think you know how big that was for me. I
              wasn't sure of a lot of things back then, but I was sure about you.
            </p>
            <p className="relative mt-6 text-lg leading-relaxed text-foreground/90 sm:text-xl">
              Thank you for the time you gave me, for the conversations, for being someone I could
              be completely normal around. I never had to act cooler or smarter than I actually am.
            </p>
            <p className="relative mt-6 text-lg leading-relaxed text-muted-foreground italic sm:text-xl">
              Being your boyfriend is honestly one of the things I'm most glad about.
            </p>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── I know things aren't always perfect ────────────────────── */
function NotAlwaysPerfect() {
  return (
    <section className={section}>
      <Reveal>
        <p className={eyebrow}>being honest</p>
        <h2 className="mt-5 text-3xl leading-tight sm:text-5xl">
          I know things aren't <span className="text-blush italic">always perfect</span>
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="card-premium relative mt-12 overflow-hidden p-7 sm:p-11">
          <Particles count={10} />
          <p className="relative text-lg leading-relaxed text-foreground/90 sm:text-xl">
            I know har din same nahi hota. Sometimes life gets busy, sometimes we don't talk the way
            we used to, and things don't always feel exactly like the beginning.
          </p>
          <p className="relative mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            But that doesn't make any of the good things less important to me. Phases change; what I
            feel for you didn't quietly vanish somewhere in between.
          </p>
          <p className="relative mt-6 text-lg leading-relaxed text-foreground/90 sm:text-xl">
            Main tumse kuch demand nahi kar raha. I'm just telling you, honestly, that you still
            matter to me — on the easy days and the awkward ones both.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Things I love about you (interactive cards) ────────────── */
const loveCards = [
  {
    title: "Your presence",
    body: "Even when nothing special is happening, tum ho — and that alone makes the day feel lighter.",
  },
  {
    title: "The little things you do",
    body: "The small check-ins, the tiny replies, the way you notice things I never even said out loud.",
  },
  {
    title: "The way you make me smile",
    body: "I can be in the worst mood and one message from you ruins my whole plan of staying upset.",
  },
  {
    title: "The memories we've made",
    body: "Not big events — just our normal conversations that I still replay in my head randomly.",
  },
  {
    title: "How easy you are to talk to",
    body: "Tumse baat karte waqt I never feel like I'm being judged. That's genuinely rare for me.",
  },
  {
    title: "Just you being you",
    body: "You've never tried to be someone else with me, and that's my favourite thing about you.",
  },
];

function ThingsILove() {
  return (
    <section className={section}>
      <Reveal>
        <p className={eyebrow}>things i love about you</p>
        <h2 className="mt-5 text-3xl leading-tight sm:text-5xl">
          Tap each one — <span className="text-blush italic">there's a reason for all of them</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {loveCards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.07}>
            <LoveCard title={c.title} body={c.body} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function LoveCard({ title, body, index }: { title: string; body: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        setOpen((o) => !o);
        if (!open) {
          burstHearts(e.clientX, e.clientY, 12);
          tap();
        }
      }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="card-premium relative h-full w-full overflow-hidden p-6 text-left sm:p-7"
      style={{
        background:
          index % 2 === 0
            ? "var(--glass-bg)"
            : "linear-gradient(160deg, color-mix(in oklab, var(--rose) 13%, transparent), color-mix(in oklab, white 3%, transparent))",
      }}
    >
      <motion.span
        animate={open ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
        className="inline-block"
      >
        <Heart className="h-4 w-4 text-blush" fill={open ? "currentColor" : "none"} />
      </motion.span>
      <h3 className="mt-4 text-2xl leading-snug">{title}</h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.p
            key="body"
            initial={{ opacity: 0, height: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
            exit={{ opacity: 0, height: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden leading-relaxed text-muted-foreground"
          >
            <span className="mt-3 block">{body}</span>
          </motion.p>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-xs tracking-[0.3em] text-muted-foreground uppercase"
          >
            tap to open
          </motion.p>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── The letter ─────────────────────────────────────────────── */
const letter = [
  "I'm not great at saying things like this out loud, so I'm writing it instead.",
  "Thank you for becoming my girlfriend on 7 December, and for everything that came after it — the normal conversations, the random laughs, the days that felt better only because you were part of them.",
  "I know I'm not perfect at this. Kabhi kabhi I go quiet, kabhi main galat cheez keh deta hoon. But even in those phases, you were never someone I stopped caring about.",
  "Tum jaisi ho, waisi hi acchi ho. I don't want you to change anything about yourself for me. I like the real version, the tired version, the annoyed version — all of it.",
  "I hope we get to make more memories together. Not big cinematic ones, just more ordinary days that quietly become the ones I remember.",
  "And if you ever feel like too much or not enough, please read this again. Mere liye tum bilkul theek ho.",
];

function Letter() {
  return (
    <section className={section}>
      <Reveal>
        <p className={eyebrow}>a letter for you</p>
        <h2 className="mt-5 text-3xl leading-tight sm:text-5xl">
          Sudha, this is something{" "}
          <span className="text-blush italic">I wanted you to know…</span>
        </h2>
      </Reveal>

      <div
        className="card-premium sheen relative mt-12 space-y-7 p-7 sm:p-12"
        style={{
          background:
            "linear-gradient(160deg, color-mix(in oklab, var(--blush) 12%, transparent), color-mix(in oklab, white 5%, transparent))",
        }}
      >
        <Particles count={12} />
        {letter.map((line, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <p className="relative text-lg leading-relaxed text-foreground/90 sm:text-xl">{line}</p>
          </Reveal>
        ))}
        <Reveal delay={0.3}>
          <p className="font-script relative pt-2 text-3xl text-blush sm:text-4xl">
            yours, Shourya ❤️
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Press to reveal ────────────────────────────────────────── */
function HiddenMessage() {
  const [open, setOpen] = useState(false);

  return (
    <section className={`${section} text-center`}>
      <AnimatePresence>
        {open && (
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="pointer-events-none fixed inset-0 z-[1]"
            style={{ background: "oklch(0.1 0.02 30 / 0.55)" }}
          />
        )}
      </AnimatePresence>

      <Reveal>
        <p className={eyebrow}>one more thing</p>
        <h2 className="mt-5 text-3xl leading-tight sm:text-5xl">
          There's something else <span className="text-blush italic">I want to tell you…</span>
        </h2>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="relative z-[2] mx-auto mt-12 max-w-xl">
          <AnimatePresence mode="wait" initial={false}>
            {!open ? (
              <motion.button
                key="closed"
                type="button"
                onClick={(e) => {
                  setOpen(true);
                  burstHearts(e.clientX, e.clientY, 18);
                  tap(18);
                }}
                whileTap={{ scale: 0.96 }}
                exit={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
                animate={{ y: [0, -6, 0] }}
                transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                className="card-premium sheen w-full px-8 py-14"
              >
                <Gift className="mx-auto h-7 w-7 text-blush" />
                <p className="mt-6 text-sm tracking-[0.3em] uppercase">press to reveal</p>
                <p className="mt-3 text-sm text-muted-foreground">it's short, but I mean it</p>
              </motion.button>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(18px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
                className="card-premium relative overflow-hidden p-8 sm:p-12"
                style={{ boxShadow: "var(--shadow-dream)" }}
              >
                <FloatingHearts count={10} opacity={0.45} />
                <Particles count={14} />
                <Sparkles className="relative mx-auto h-5 w-5 text-gold" />
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 0.5 }}
                  className="font-display relative mt-6 text-2xl leading-snug text-blush italic sm:text-3xl"
                >
                  Main tumhe kabhi kabhi properly keh nahi paata, so here it is written down: I love
                  you, Sudha.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.4, delay: 1.6 }}
                  className="relative mt-6 leading-relaxed text-muted-foreground"
                >
                  Not just today, and not only because of a special day on the calendar.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Finale: last surprise + song + final words ─────────────── */
const YT_ID = "jSPpbOGnFgk"; // The Ronettes — Be My Baby (Official Audio, TheRonettesVEVO)

function Finale() {
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 0 waiting, 1 building, 2 song
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (stage !== 1) return;
    const t = setTimeout(() => setStage(2), 2600);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-28">
      <Particles count={20} />
      <FloatingHearts count={12} opacity={0.4} />
      <motion.div
        animate={{ opacity: stage === 0 ? 0 : 1 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(180deg, transparent, oklch(0.09 0.02 30 / 0.85))" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--rose) 40%, transparent), transparent 70%)",
        }}
      />

      <div className={`${section} relative z-[2] text-center`}>
        <Reveal>
          <h2 className="text-3xl leading-[1.2] sm:text-5xl">
            Wait… <span className="text-blush italic">there's one last thing.</span>
          </h2>
        </Reveal>

        {stage === 0 && (
          <Reveal delay={0.2}>
            <motion.button
              type="button"
              onClick={(e) => {
                setStage(1);
                burstHearts(e.clientX, e.clientY, 22);
                tap(20);
              }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              className="card-premium sheen mt-14 px-9 py-5 text-sm tracking-[0.3em] uppercase"
            >
              open it
            </motion.button>
          </Reveal>
        )}

        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              key="build"
              initial={{ opacity: 0, filter: "blur(16px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.6 }}
              className="mt-12"
            >
              <p className="font-script text-4xl text-blush sm:text-5xl">
                This one is just for you, Sudha ❤️
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === 2 && (
            <motion.div
              key="song"
              initial={{ opacity: 0, y: 24, filter: "blur(18px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
              className="mt-14"
            >
              <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Okay… now just listen to this ❤️
              </p>

              {!playing ? (
                <motion.button
                  type="button"
                  onClick={(e) => {
                    setPlaying(true);
                    burstHearts(e.clientX, e.clientY, 20);
                    tap(20);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="card-premium sheen mx-auto mt-8 flex items-center gap-3 px-8 py-4"
                >
                  <Play className="h-4 w-4 text-blush" fill="currentColor" />
                  <span className="text-sm tracking-[0.28em] uppercase">
                    play our surprise ❤️
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2 }}
                  className="card-premium mx-auto mt-8 max-w-xl overflow-hidden p-3 sm:p-4"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl pt-[56.25%]">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&playsinline=1`}
                      title="Be My Baby"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-2 text-xs tracking-[0.25em] text-muted-foreground uppercase">
                    <Music className="h-3.5 w-3.5" /> be my baby
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, delay: 1.4 }}
                className="mt-16 space-y-6"
              >
                <p className="mx-auto max-w-xl text-lg leading-relaxed text-foreground/90 sm:text-xl">
                  I don't know if a website can ever properly explain how much someone means to you,
                  but I hope this little thing made you smile even for a moment.
                </p>
                <p className="font-script text-4xl text-blush sm:text-5xl">
                  Happy National Couple Day, Sudha ❤️
                </p>
                <p className="font-script text-3xl text-blush/90 sm:text-4xl">
                  Always your Shourya ❤️
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Reveal delay={0.4}>
          <p className="mt-24 text-[0.65rem] tracking-[0.35em] text-muted-foreground/80 uppercase">
            made with love by shourya, just for you ❤️
          </p>
        </Reveal>
      </div>
    </section>
  );
}
