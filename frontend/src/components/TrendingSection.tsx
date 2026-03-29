import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import HackathonCard from "./HackathonCard";

interface Hackathon {
  _id?: string;
  title: string;
  organizer: string;
  deadline: string;
  participants: string;
  prize: string;
  tags: string[];
  location: string;
  source: string;
  url: string;
}

export default function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: hackathons = [], isLoading, error } = useQuery<Hackathon[]>({
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
        className="flex items-center justify-between mb-10"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
            <Flame className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground serif leading-tight">Currently Rising</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                Live Intelligence
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full glass border-white/5 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full glass border-white/5 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
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
