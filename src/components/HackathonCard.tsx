import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Clock, Bookmark, ExternalLink } from "lucide-react";

interface HackathonCardProps {
  title: string;
  organizer: string;
  deadline: string;
  participants: string;
  prize: string;
  tags: string[];
  location: string;
  source: string;
  index: number;
}

function useCountdown(deadline: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline).getTime() - Date.now();
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
  title, organizer, deadline, participants, prize, tags, location, source, index,
}: HackathonCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timeLeft = useCountdown(deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "perspective(800px) rotateY(-2deg) rotateX(2deg) scale(1.02)" : "perspective(800px) rotateY(0) rotateX(0) scale(1)",
        transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1)",
      }}
      className="glass rounded-2xl p-6 relative overflow-hidden group cursor-pointer animated-border"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(192 95% 55% / 0.06), transparent 40%)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <span className="text-xs font-mono text-primary/70 tracking-wider uppercase">{source}</span>
            <h3 className="text-lg font-semibold text-foreground mt-1 leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{organizer}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Bookmark
              className={`w-4 h-4 transition-all duration-300 ${
                bookmarked ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
            />
          </motion.button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-primary/60" />
            {location}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-primary/60" />
            {participants}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-primary/60" />
            {new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-primary font-medium">
            💰 {prize}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs">
            <Clock className="w-3 h-3 text-neon-violet" />
            <span className="font-mono text-neon-violet font-medium">{timeLeft}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
            View Details <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
