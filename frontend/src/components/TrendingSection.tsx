import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import HackathonCard from "./HackathonCard";

export default function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: hackathons = [], isLoading, error } = useQuery({
    queryKey: ['hackathons'],
    queryFn: async () => {
      const response = await fetch('/api/hackathons');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  // Use the first 6 hackathons as "trending"
  const trendingHackathons = hackathons.slice(0, 6);

  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-neon-pink" />
          <h2 className="text-2xl font-bold text-foreground">Trending Hackathons</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neon-pink/10 text-neon-pink border border-neon-pink/20 animate-neon-pulse">
            LIVE
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-lg glass text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-lg glass text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {trendingHackathons.map((h, i) => (
          <div key={h._id || h.title} className="min-w-[340px] max-w-[340px] snap-start">
            <HackathonCard {...h} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
