import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";
import { wedding } from "./data";

export function MusicPlayer({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasInteracted(true);
            // Smooth fade-in
            let vol = 0;
            const interval = setInterval(() => {
              vol = Math.min(0.7, vol + 0.05);
              if (audio) audio.volume = vol;
              if (vol >= 0.7) clearInterval(interval);
            }, 60);
          })
          .catch((err) => {
            console.log("Audio autoplay waiting for user interaction:", err);
          });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return (
    <>
      <audio
        ref={audioRef}
        src={wedding.bgmUrl}
        loop
        preload="auto"
      />

      <motion.aside
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2"
        aria-label="Background music controls"
      >
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="bg-emerald-ink/90 border-gold/40 shadow-gold pointer-events-none hidden items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md sm:flex"
            >
              <div className="flex h-3 items-end gap-0.5">
                {[0.6, 1, 0.4, 0.8].map((h, i) => (
                  <motion.span
                    key={i}
                    className="bg-gold-soft inline-block w-0.5 rounded-full"
                    animate={{ height: ["20%", `${h * 100}%`, "20%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <span className="text-gold-soft font-serif text-[0.65rem] tracking-widest uppercase">
                Satyam Sarva Mangalyam
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={onToggle}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          className="bg-emerald-ink/90 border-gold/50 shadow-gold text-gold-soft hover:border-gold hover:text-gold relative grid h-12 w-12 place-items-center rounded-full border backdrop-blur-md transition-colors"
          title={isPlaying ? "Mute Background Music" : "Play Background Music"}
          aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
        >
          {isPlaying ? (
            <>
              <motion.span
                className="border-gold/30 absolute inset-0 rounded-full border"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
              />
              <Volume2 className="h-5 w-5" />
            </>
          ) : (
            <VolumeX className="h-5 w-5 opacity-70" />
          )}
        </motion.button>
      </motion.aside>
    </>
  );
}
