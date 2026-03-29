import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Clock, Bookmark, ArrowRight } from "lucide-react";

interface HackathonCardProps {
  title: string;
  organizer: string;
  deadline: string;
  participants: string;
  prize: string;
  tags: string[];
  location: string;
  source: string;
  url: string;
  index: number;
}

function parseHackathonDate(deadline: string): Date {
  let date = new Date(deadline);
  if (!isNaN(date.getTime())) return date;
  
  if (deadline && deadline.includes('-')) {
    const parts = deadline.split('-');
    const endPart = parts[parts.length - 1].trim();
    date = new Date(endPart);
    if (!isNaN(date.getTime())) return date;
    
    date = new Date(`${endPart}, ${new Date().getFullYear()}`);
    if (!isNaN(date.getTime())) return date;
  }
  return new Date(NaN);
}

function useCountdown(deadline: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calc = () => {
      const targetDate = parseHackathonDate(deadline);
      if (isNaN(targetDate.getTime())) {
        setTimeLeft("");
        return;
      }
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft("Ended");
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [deadline]);
  return timeLeft;
}

export default function HackathonCard({
  title, organizer, deadline, participants, prize, tags, location, source, url, index,
}: HackathonCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const timeLeft = useCountdown(deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="glass-card rounded-[1.5rem] p-7 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-premium hover:-translate-y-1 border-white/5"
    >
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold text-primary/80 tracking-[0.15em] uppercase px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20">{source}</span>
              {timeLeft && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent tracking-widest uppercase">
                  <Clock className="w-3 h-3" />
                  {timeLeft}
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300 serif">{title}</h3>
            <p className="text-sm text-muted-foreground/80 mt-1 font-medium italic">{organizer}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <Bookmark
              className={`w-4 h-4 transition-all duration-300 ${
                bookmarked ? "fill-primary text-primary" : "text-muted-foreground/60"
              }`}
            />
          </motion.button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white/5 text-muted-foreground/80 border border-white/10 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] font-bold text-muted-foreground/40 self-center">+{tags.length - 3}</span>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 text-xs text-muted-foreground/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/10">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-accent/5 border border-accent/10">
              <Users className="w-3.5 h-3.5 text-accent" />
            </div>
            <span>{participants}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/10">
              <Calendar className="w-3.5 h-3.5 text-primary" />
            </div>
            <span>{(() => {
              const d = parseHackathonDate(deadline);
              return isNaN(d.getTime()) ? (deadline || "TBD") : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            })()}</span>
          </div>
          <div className="flex items-center gap-2.5 font-bold text-foreground">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs">💰</span>
            </div>
            <span className="truncate">{prize.replace(/<[^>]+>/g, '')}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-5 flex items-center justify-between border-t border-white/5">
          <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            Applications Close Soon
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-all group/link bg-primary/10 px-4 py-2 rounded-full border border-primary/20"
          >
            Details <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
      
      {/* Decorative gradient wash */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />
    </motion.div>
  );
}
