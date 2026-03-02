import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import HackathonCard from "./HackathonCard";

const trendingHackathons = [
  {
    title: "ETHGlobal Brussels 2026",
    organizer: "ETHGlobal",
    deadline: "2026-04-15",
    participants: "3.2K+",
    prize: "$500K",
    tags: ["Web3", "Blockchain", "DeFi"],
    location: "Brussels, Belgium",
    source: "Devpost",
  },
  {
    title: "Google AI Hackathon",
    organizer: "Google Developers",
    deadline: "2026-03-28",
    participants: "12K+",
    prize: "$200K",
    tags: ["AI / ML", "Cloud", "LLM"],
    location: "Online",
    source: "Unstop",
  },
  {
    title: "HackTheBox CTF 2026",
    organizer: "Hack The Box",
    deadline: "2026-04-02",
    participants: "8K+",
    prize: "$100K",
    tags: ["Cybersecurity", "CTF"],
    location: "Online",
    source: "Knowafest",
  },
  {
    title: "Climate Tech Challenge",
    organizer: "UN Innovation Lab",
    deadline: "2026-05-10",
    participants: "5K+",
    prize: "$300K",
    tags: ["Climate", "Sustainability", "IoT"],
    location: "Nairobi, Kenya",
    source: "Devpost",
  },
  {
    title: "Open Source India 2026",
    organizer: "FOSSASIA",
    deadline: "2026-03-20",
    participants: "2.1K+",
    prize: "$50K",
    tags: ["Open Source", "Linux", "DevOps"],
    location: "Bengaluru, India",
    source: "Knowafest",
  },
  {
    title: "DeFi Builder Summit",
    organizer: "Solana Foundation",
    deadline: "2026-04-22",
    participants: "6K+",
    prize: "$1M",
    tags: ["Web3", "Solana", "DeFi"],
    location: "Miami, USA",
    source: "Devpost",
  },
];

export default function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" });
    }
  };

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
          <div key={h.title} className="min-w-[340px] max-w-[340px] snap-start">
            <HackathonCard {...h} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
