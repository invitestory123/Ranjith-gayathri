import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { wedding } from "./data";
import { Reveal, Ornament } from "./Reveal";

export function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const photos = wedding.gallery || [];

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1));
  }, [selectedIndex, photos.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0));
  }, [selectedIndex, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  return (
    <section className="relative overflow-hidden px-5 py-20">
      <div className="relative mx-auto max-w-md">
        <Reveal className="text-center">
          <Ornament label="Gallery" />
          <h2 className="text-primary mt-5 text-4xl font-light">Our moments</h2>
          <p className="text-muted-foreground font-display italic mx-auto mt-3 max-w-xs text-base leading-relaxed">
            Fleeting glances, shared laughter, and little memories framed for a lifetime.
          </p>
        </Reveal>

        {/* Gallery Grid */}
        <div className="mt-10 grid grid-cols-2 gap-3.5">
          {photos.map((item, index) => {
            // First photo is full width for visual impact
            const isFeatured = index === 0;

            return (
              <Reveal
                key={item.src}
                delay={index * 0.08}
                className={isFeatured ? "col-span-2" : "col-span-1"}
              >
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIndex(index)}
                  className={`group border-gold/30 shadow-luxe hover:border-gold/60 relative cursor-pointer overflow-hidden rounded-[1.75rem] border bg-card/60 backdrop-blur-xs transition-all duration-300 hover:shadow-gold ${
                    isFeatured ? "aspect-[4/3]" : "aspect-[3/4]"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="from-emerald-ink/80 via-emerald-ink/20 absolute inset-0 bg-gradient-to-t to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                  {/* Expand icon indicator */}
                  <div className="bg-card/70 border-gold/40 text-gold shadow-gold absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </div>

                  {/* Caption on card */}
                  <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <p className="text-ivory font-display text-base font-light tracking-wide drop-shadow-xs">
                      {item.caption}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-emerald-ink/95 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="bg-card/80 border-gold/40 text-ivory hover:text-gold absolute top-5 right-5 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-colors"
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Counter Badge */}
            <div className="bg-card/80 border-gold/30 text-gold-soft font-sans absolute top-5 left-5 z-20 rounded-full border px-3.5 py-1 text-xs tracking-widest uppercase backdrop-blur-md">
              {selectedIndex + 1} / {photos.length}
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="bg-card/70 border-gold/40 text-ivory hover:text-gold hover:border-gold shadow-gold absolute left-3 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all sm:left-6"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="bg-card/70 border-gold/40 text-ivory hover:text-gold hover:border-gold shadow-gold absolute right-3 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all sm:right-6"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image & Caption Container */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] max-w-sm overflow-hidden rounded-[2rem] border border-gold/40 bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[selectedIndex].src}
                alt={photos[selectedIndex].alt}
                className="max-h-[72vh] w-auto object-contain"
              />
              <div className="bg-gradient-to-t from-emerald-ink via-emerald-ink/90 to-transparent p-4 text-center">
                <p className="font-display text-ivory text-lg font-light tracking-wide">
                  {photos[selectedIndex].caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
