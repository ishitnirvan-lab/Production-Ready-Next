import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaGift,
  FaHeart,
  FaMusic,
  FaPause,
  FaPlay,
  FaRegEnvelope,
  FaRegStar,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

const memories = [
  {
    src: "/memories/memory-01.jpeg",
    title: "Little scrapbook smiles",
    note: "This one already feels like it was saved between two pages of a memory book.",
    rotate: "-rotate-2",
  },
  {
    src: "/memories/memory-02.jpeg",
    title: "Evening sparkle",
    note: "A soft evening, a tiny sparkle, and that easy Khanku ✨ kind of calm.",
    rotate: "rotate-2",
  },
  {
    src: "/memories/memory-03.jpeg",
    title: "A simple Thursday",
    note: "Dear 🌸, this is why ordinary days never feel completely ordinary with you.",
    rotate: "-rotate-1",
  },
  {
    src: "/memories/memory-04.jpeg",
    title: "Bacha energy",
    note: "Cute, a little dramatic, and honestly impossible not to smile at.",
    rotate: "rotate-1",
  },
  {
    src: "/memories/memory-05.jpeg",
    title: "Heart filter classic",
    note: "Soft hearts, softer smile, peak Khanku charm. This one stays special.",
    rotate: "-rotate-3",
  },
  {
    src: "/memories/memory-06.jpeg",
    title: "Quiet comfort",
    note: "The peaceful friend vibe that makes even quiet moments feel safe.",
    rotate: "rotate-3",
  },
];

const timeline = [
  [
    "How we met",
    "Some friendships arrive quietly, then slowly become part of your normal day in the best way.",
  ],
  [
    "Funny moments",
    "The random laughs, silly moods, and tiny inside jokes that make no sense to anyone else.",
  ],
  [
    "Important memories",
    "The days that stayed, the talks that mattered, and the little things we somehow never forgot.",
  ],
  [
    "Special experiences",
    "A page for everything that made this bond feel rare, comfortable, safe, and real.",
  ],
];

const appreciation = [
  [
    "Kindness",
    "You make people feel noticed in a way that feels natural, never forced.",
  ],
  [
    "Support",
    "You show up in the small moments, and those small moments are never small to me.",
  ],
  [
    "Humor",
    "You can turn a normal conversation into something I remember later and smile about.",
  ],
  [
    "Honesty",
    "You keep things real, but still gentle enough to feel safe around.",
  ],
  [
    "Caring nature",
    "Dear 🌸, your care has this quiet way of staying with people.",
  ],
  [
    "Positive energy",
    "Even one tiny message from you can make a heavy day feel lighter.",
  ],
];

const chats = [
  ["me", "Random reminder: you are genuinely one of my safest people."],
  ["her", "Aww, why so sweet today?"],
  ["me", "Friendship Day website pressure. I had to behave premium."],
  ["her", "Khanku approves ✨"],
  ["me", "Good. This page was made only for you, Bacha ❤️"],
];

const quiz = [
  {
    question: "What should this friendship always keep?",
    options: ["Honesty and laughter", "Formality", "Silent treatment"],
    answer: 0,
  },
  {
    question: "Best cure for a boring day?",
    options: ["One chaotic conversation", "More boring", "Ignoring everyone"],
    answer: 0,
  },
  {
    question: "What does Bacha deserve today?",
    options: ["A little surprise", "Zero appreciation", "A plain webpage"],
    answer: 0,
  },
];

const hiddenNotes = [
  "Secret note: You matter more than you realize, even on your quiet days.",
  "Hidden heart found: your smile is officially bookmarked in my brain.",
  "Tiny truth: life feels kinder with a friend like you.",
];

const teddyMessages = [
  "I knew you'd find me! 🧸❤️",
  "Every adventure is better with a friend.",
  "Thanks for stopping to say hello!",
  "Hugs make everything better.",
  "You have a kind heart.",
];

// Fixed positions that stay clear of main content and the music player (bottom-right)
const teddySafeZones = [
  { left: "6%",  top: "30%" },
  { left: "88%", top: "22%" },
  { left: "5%",  top: "55%" },
  { left: "88%", top: "46%" },
  { left: "7%",  top: "73%" },
  { left: "83%", top: "63%" },
  { left: "6%",  top: "42%" },
  { left: "90%", top: "36%" },
];

const chapterNotes: Record<string, string> = {
  story: "a small beginning, saved carefully",
  gallery: "tap a photo, open a little pocket of memory",
  appreciate: "things I may not say every day, but always mean",
  letter: "one folded note, kept soft on purpose",
  chat: "because some messages deserve to be kept",
  fun: "a tiny playful break, because of course",
  surprise: "the last page before the quiet ending",
};

function useFirstInteraction(onFirst: () => void) {
  const callbackRef = useRef(onFirst);
  callbackRef.current = onFirst;

  useEffect(() => {
    let fired = false;
    const start = () => {
      if (fired) return;
      fired = true;
      callbackRef.current();
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };

    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    window.addEventListener("touchstart", start);

    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function MagneticButton({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16 });
  const springY = useSpring(y, { stiffness: 220, damping: 16 });

  const props = {
    onMouseMove: (event: React.MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
      y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
    },
    onMouseLeave: () => {
      x.set(0);
      y.set(0);
    },
    onClick,
    style: { x: springX, y: springY },
    className: "magnetic-button",
  };

  if (href) {
    return (
      <motion.a href={href} {...props}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" {...props}>
      {children}
    </motion.button>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [7, -7]);
  const rotateY = useTransform(x, [-60, 60], [-7, 7]);

  return (
    <motion.div
      className="tilt-card"
      style={{ rotateX, rotateY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

export default function FriendshipExperience() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeMemory, setActiveMemory] = useState<
    (typeof memories)[number] | null
  >(null);
  const [letterOpen, setLetterOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [foundHearts, setFoundHearts] = useState<number[]>([]);
  const [teddyFound, setTeddyFound] = useState(
    () => localStorage.getItem("ee_teddy") === "true",
  );
  const [showAchievement, setShowAchievement] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const finaleRef = useRef<HTMLElement | null>(null);

  const typedLetter = useMemo(
    () =>
      "Dear Khanku ✨,\n\nHappy Friendship Day. I wanted this to feel less like a website and more like a little corner made only for you.\n\nThank you for being the friend who makes normal days softer, boring moments funnier, and heavy days easier to carry. Your kindness, your honest heart, your cute moods, and the way you care are things I notice more than I say.\n\nBacha ❤️, I hope this reminds you that you are valued, appreciated, and never taken for granted.\n\nThank you for being you. Really.Love you bacha",
    [],
  );

  const startMusic = useCallback(async () => {
    if (!audioRef.current || musicStarted) return;
    // If the audio element is in an error state (e.g. file missing), mark started but don't crash
    if (audioRef.current.error) {
      setMusicStarted(true);
      return;
    }
    try {
      audioRef.current.volume = 0.45;
      await audioRef.current.play();
      setMusicStarted(true);
      setMusicPlaying(true);
    } catch {
      setMusicStarted(true);
    }
  }, [musicStarted]);

  useFirstInteraction(startMusic);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + Math.ceil(Math.random() * 9), 100);
        if (next >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => setLoaded(true), 500);
        }
        return next;
      });
    }, 110);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!cursorRef.current) return;
      gsap.to(cursorRef.current, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.18,
        ease: "power2.out",
      });
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (!musicStarted) {
      await startMusic();
      return;
    }
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setMusicPlaying(true);
    } else {
      audioRef.current.pause();
      setMusicPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  const answerQuiz = (index: number) => {
    if (index === quiz[quizStep].answer) setScore((current) => current + 1);
    if (quizStep === quiz.length - 1) {
      setQuizDone(true);
      confettiBurst();
      return;
    }
    setQuizStep((current) => current + 1);
  };

  const confettiBurst = async () => {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.72 },
      colors: ["#f7abc6", "#c9b8ff", "#fff6df", "#c7984c"],
    });
  };

  const openGift = () => {
    setGiftOpen(true);
    confettiBurst();
    window.setTimeout(() => {
      finaleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 2400);
  };

  const discoverHeart = (index: number) => {
    setFoundHearts((current) =>
      current.includes(index) ? current : [...current, index],
    );
  };

  const handleTeddyFound = () => {
    localStorage.setItem("ee_teddy", "true");
    setTeddyFound(true);
    setShowAchievement(true);
    window.setTimeout(() => setShowAchievement(false), 4200);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-silk text-ink">
      <audio
        ref={audioRef}
        src="/music/song.mp3"
        loop
        preload="metadata"
        onError={() => {
          /* no song.mp3 yet — suppress media error */
        }}
      />
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />

      <AnimatePresence>
        {!loaded && (
          <motion.section
            className="fixed inset-0 z-50 grid place-items-center bg-silk px-6"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            aria-label="Loading friendship experience"
          >
            <div className="loading-card">
              <div className="loading-orbit">
                <FaHeart />
              </div>
              <p className="font-script text-4xl text-[#a75f80]">
                For Bacha ❤️
              </p>
              <h1 className="mt-3 font-display text-3xl">
                Opening a little memory book
              </h1>
              <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/60">
                <motion.div
                  className="h-full bg-[#d49a55]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-medium text-[#77566d]">
                {progress}%
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <FloatingDecor foundHearts={foundHearts} discoverHeart={discoverHeart} />

      {!teddyFound && <HiddenTeddy onFound={handleTeddyFound} />}
      <AnimatePresence>
        {showAchievement && <AchievementToast label="Lost Teddy Found 🧸" />}
      </AnimatePresence>

      <section id="welcome" className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 py-12 text-center"
        >
          <p className="mb-4 font-script text-4xl text-[#9f5b86]">Dear 🌸</p>
          <h1 className="max-w-3xl font-display text-5xl leading-tight text-ink sm:text-7xl">
            Happy Friendship Day
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#6f5368] sm:text-lg">
            For someone who makes life brighter in the most effortless way.
          </p>
          <div className="mt-9">
            <MagneticButton href="#story">
              <FaRegStar aria-hidden="true" />
              Begin the Journey
            </MagneticButton>
          </div>
          <p className="hand-note mt-7">
            made slowly, carefully, and only for you
          </p>
        </motion.div>
      </section>

      <Chapter eyebrow="Chapter 1" title="Our Story" id="story">
        <div className="timeline">
          {timeline.map(([title, copy], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="timeline-card"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <small>kept here because it matters</small>
            </motion.article>
          ))}
        </div>
      </Chapter>

      <Chapter eyebrow="Chapter 2" title="Memory Gallery" id="gallery">
        <div className="scrapbook-grid">
          {memories.map((memory, index) => (
            <motion.button
              key={memory.src}
              type="button"
              className={`polaroid ${memory.rotate}`}
              onClick={() => setActiveMemory(memory)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="tape" aria-hidden="true" />
              <img src={memory.src} alt={memory.title} className="photo" />
              <span className="font-script text-2xl text-[#84506d]">
                {memory.title}
              </span>
              <em>
                {index % 2 === 0 ? "little keeper" : "saved with a smile"}
              </em>
            </motion.button>
          ))}
        </div>
      </Chapter>

      <Chapter eyebrow="Chapter 3" title="Things I Appreciate" id="appreciate">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {appreciation.map(([title, copy]) => (
            <TiltCard key={title}>
              <FaHeart className="mb-4 text-[#d49a55]" aria-hidden="true" />
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#72576b]">{copy}</p>
              <span className="card-whisper">noticed, always</span>
            </TiltCard>
          ))}
        </div>
      </Chapter>

      <Chapter eyebrow="Chapter 4" title="Interactive Letter" id="letter">
        <div className="letter-stage">
          <motion.button
            type="button"
            className={`envelope ${letterOpen ? "is-open" : ""}`}
            onClick={() => setLetterOpen(true)}
            whileTap={{ scale: 0.98 }}
            aria-label="Open the friendship letter"
          >
            <FaRegEnvelope aria-hidden="true" />
            <span>{letterOpen ? "Letter opened" : "Tap to open"}</span>
          </motion.button>
          <AnimatePresence>
            {letterOpen && (
              <motion.article
                className="letter-paper"
                initial={{ opacity: 0, y: 80, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="typewriter">{typedLetter}</p>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </Chapter>

      <Chapter eyebrow="Optional Memory" title="Tiny Chat Corner" id="chat">
        <div className="chat-phone" aria-label="Friendship chat memories">
          {chats.map(([from, text], index) => (
            <motion.div
              key={`${from}-${text}`}
              className={`chat-bubble ${from === "me" ? "from-me" : "from-her"}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.16 }}
            >
              {text}
            </motion.div>
          ))}
        </div>
      </Chapter>

      <Chapter eyebrow="Chapter 5" title="Fun Zone" id="fun">
        <div className="fun-grid">
          <section className="glass-panel">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl">Friendship Quiz</h3>
              <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-[#8b5f7a]">
                {quizDone ? "Done" : `${quizStep + 1}/${quiz.length}`}
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/60">
              <motion.div
                className="h-full rounded-full bg-[#c7984c]"
                animate={{
                  width: `${quizDone ? 100 : ((quizStep + 1) / quiz.length) * 100}%`,
                }}
              />
            </div>
            {!quizDone ? (
              <div className="mt-6">
                <p className="font-medium leading-7">
                  {quiz[quizStep].question}
                </p>
                <div className="mt-5 grid gap-3">
                  {quiz[quizStep].options.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      className="answer-button"
                      onClick={() => answerQuiz(index)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-6"
              >
                <p className="font-display text-4xl text-[#9f5b86]">
                  {score}/{quiz.length}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#72576b]">
                  Perfect friendship energy. Obviously. Celebration unlocked.
                </p>
              </motion.div>
            )}
          </section>

          <section className="glass-panel">
            <h3 className="font-display text-2xl">Hidden Hearts</h3>
            <p className="mt-3 text-sm leading-6 text-[#72576b]">
              Find the glowing hearts floating through the page. They are tiny
              things I wanted to say quietly.
            </p>
            <div className="mt-6 grid gap-3">
              {hiddenNotes.map((note, index) => (
                <div key={note} className="secret-note">
                  {foundHearts.includes(index) ? note : "Locked memory"}
                </div>
              ))}
            </div>
          </section>
        </div>
      </Chapter>

      <Chapter eyebrow="Chapter 6" title="Final Surprise" id="surprise">
        <div className="gift-stage">
          <motion.button
            type="button"
            className={`gift-box ${giftOpen ? "is-open" : ""}`}
            onClick={openGift}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Open the final surprise"
          >
            <FaGift aria-hidden="true" />
            <span>{giftOpen ? "Surprise opened" : "Open the gift"}</span>
          </motion.button>
          <AnimatePresence>
            {giftOpen && (
              <motion.div
                className="final-message"
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <p className="font-script text-4xl text-[#9f5b86]">
                  Happy Friendship Day ❤️
                </p>
                <p className="mt-3 text-sm leading-6 text-[#72576b]">
                  Thank you for being such an amazing friend, and for being you
                  in a way nobody else can copy.
                </p>
                <MagneticButton href="#welcome">
                  <FaHeart aria-hidden="true" />
                  Start Again
                </MagneticButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Chapter>

      <AnimatePresence>
        {giftOpen && <GrandFinale finaleRef={finaleRef} />}
      </AnimatePresence>

      <div className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full border border-white/50 bg-white/50 p-2 shadow-glow backdrop-blur-xl">
        <button
          type="button"
          className="music-button"
          onClick={toggleMusic}
          aria-label="Play or pause music"
        >
          {musicPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          type="button"
          className="music-button"
          onClick={toggleMute}
          aria-label="Mute or unmute music"
        >
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <FaMusic
          className={`mx-2 text-sm ${musicPlaying ? "animate-pulse text-[#c7984c]" : "text-[#8b6c7d]"}`}
        />
      </div>

      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.figure
              className="lightbox-card"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activeMemory.src}
                alt={activeMemory.title}
                className="rounded-[1.25rem]"
                style={{ width: "100%", height: "auto" }}
              />
              <figcaption>
                <strong>{activeMemory.title}</strong>
                <span>{activeMemory.note}</span>
              </figcaption>
              <button type="button" onClick={() => setActiveMemory(null)}>
                Close
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Chapter({
  eyebrow,
  title,
  id,
  children,
}: {
  eyebrow: string;
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="chapter">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-6xl px-5"
      >
        <p className="chapter-eyebrow">{eyebrow}</p>
        <h2 className="chapter-title">{title}</h2>
        <p className="chapter-note">{chapterNotes[id]}</p>
        <div className="mt-9">{children}</div>
      </motion.div>
    </section>
  );
}

function GrandFinale({
  finaleRef,
}: {
  finaleRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <motion.section
      ref={finaleRef}
      id="forever-note"
      className="grand-finale"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: "easeInOut" }}
      aria-label="Final handwritten friendship message"
    >
      <div className="finale-particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 13 + 7) % 100}%`,
              animationDelay: `${index * 0.38}s`,
              animationDuration: `${9 + (index % 4) * 1.4}s`,
            }}
          />
        ))}
      </div>
      <motion.div
        className="finale-message-wrap"
        initial={{ y: 32, scale: 0.94, opacity: 0 }}
        whileInView={{ y: 0, scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.5, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="finale-small"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          one last thing, Dear 🌸
        </motion.p>
        <motion.h2
          className="finale-script"
          initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.6 }}
          whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, delay: 1.35, ease: "easeInOut" }}
        >
          I Love You 3000 ❤️
        </motion.h2>
        <motion.p
          className="finale-after"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 3.4 }}
        >
          Calm, simple, and true.
        </motion.p>
      </motion.div>
    </motion.section>
  );
}

// ── Hidden Teddy Bear Easter Egg ─────────────────────────────────────────────

type TeddyPhase = "idle" | "jumping" | "hugging" | "gone";

function HiddenTeddy({ onFound }: { onFound: () => void }) {
  const [phase, setPhase] = useState<TeddyPhase>("idle");
  const [message] = useState(
    () => teddyMessages[Math.floor(Math.random() * teddyMessages.length)],
  );
  const [pos] = useState(
    () => teddySafeZones[Math.floor(Math.random() * teddySafeZones.length)],
  );
  const [particles] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      angle: (i / 10) * Math.PI * 2,
      distance: 52 + (i % 3) * 22,
      emoji: ["❤️", "✨", "💕", "🌸", "💖", "⭐"][i % 6],
    })),
  );

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("jumping");
    window.setTimeout(() => setPhase("hugging"), 720);
    window.setTimeout(() => {
      setPhase("gone");
      onFound();
    }, 3700);
  };

  if (phase === "gone") return null;

  const showMessage = phase === "jumping" || phase === "hugging";

  return (
    <>
      <motion.button
        type="button"
        className="teddy-bear"
        style={{ left: pos.left, top: pos.top }}
        animate={
          phase === "idle"
            ? { rotate: [-5, 5, -5], y: [0, -7, 0] }
            : phase === "jumping"
              ? { y: [0, -42, 4, -18, 0], scale: [1, 1.42, 1.05, 1.26, 1] }
              : { rotate: [-12, 12, -9, 9, 0], scale: [1, 1.18, 1] }
        }
        transition={
          phase === "idle"
            ? { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.65, ease: "easeInOut" }
        }
        whileHover={phase === "idle" ? { scale: 1.2, opacity: 1 } : undefined}
        onClick={handleClick}
        aria-label="Discover the hidden teddy bear"
      >
        🧸
      </motion.button>

      {/* Burst particles */}
      <AnimatePresence>
        {showMessage &&
          particles.map((p) => (
            <motion.span
              key={p.id}
              className="teddy-particle"
              style={{ left: pos.left, top: pos.top }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                scale: [0, 1.4, 0],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 1.15, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.span>
          ))}
      </AnimatePresence>

      {/* Message card */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="teddy-message"
            initial={{ opacity: 0, scale: 0.84, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -12 }}
            transition={{ duration: 0.46, delay: 0.2 }}
          >
            <motion.span
              className="teddy-message-icon"
              animate={{ rotate: [0, -16, 16, -10, 10, 0] }}
              transition={{ duration: 0.9, delay: 0.5, repeat: 3 }}
            >
              🧸
            </motion.span>
            <p className="teddy-message-heading">
              You found the Lost Teddy!
              <br />
              Thanks for giving me a hug. ❤️
            </p>
            <p className="teddy-message-quote">&ldquo;{message}&rdquo;</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AchievementToast({ label }: { label: string }) {
  return (
    <motion.div
      className="achievement-toast"
      initial={{ y: -88, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -88, opacity: 0 }}
      transition={{ type: "spring", stiffness: 210, damping: 24 }}
    >
      <span className="achievement-trophy">🏆</span>
      <div>
        <p className="achievement-label">Achievement Unlocked</p>
        <p className="achievement-title">{label}</p>
      </div>
    </motion.div>
  );
}

function FloatingDecor({
  foundHearts,
  discoverHeart,
}: {
  foundHearts: number[];
  discoverHeart: (index: number) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: 16 }).map((_, index) => (
        <span
          key={index}
          className="ambient-particle"
          style={{
            left: `${(index * 19) % 100}%`,
            animationDelay: `${index * 0.9}s`,
            animationDuration: `${10 + (index % 5) * 2}s`,
          }}
        />
      ))}
      {hiddenNotes.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`hidden-heart pointer-events-auto ${foundHearts.includes(index) ? "is-found" : ""}`}
          style={{ left: `${18 + index * 28}%`, top: `${30 + index * 17}%` }}
          onClick={() => discoverHeart(index)}
          aria-label={`Find hidden heart ${index + 1}`}
        >
          <FaHeart />
        </button>
      ))}
    </div>
  );
}
