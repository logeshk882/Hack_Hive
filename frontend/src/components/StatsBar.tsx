import { motion } from "framer-motion";
import { Activity, Globe2, Trophy, Zap, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function StatsBar() {
  const { data: hackathons = [], isLoading } = useQuery({
    queryKey: ['hackathons'],
    queryFn: async () => {
      const response = await fetch('/api/hackathons');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  const stats = [
    {
      label: "Active Hackathons",
      value: isLoading ? null : hackathons.length.toLocaleString(),
      icon: Activity,
      color: "text-primary"
    },
    {
      label: "Live Providers",
      value: isLoading ? null : new Set(hackathons.map((h: any) => h.source)).size.toString(),
      icon: zapIcon,
      color: "text-accent"
    },
    {
      label: "Global Reach",
      value: "Worldwide",
      icon: Globe2,
      color: "text-primary/70"
    },
    {
      label: "Prize Pools",
      value: "$2.4M+",
      icon: Trophy,
      color: "text-accent/70"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass-card rounded-2xl p-6 text-center group hover:shadow-premium transition-all duration-500 border-white/5"
        >
          <div className={`${stat.color} mb-3 flex justify-center`}>
             {stat.label === "Live Providers" ? <Zap className="w-5 h-5" /> : <stat.icon className="w-5 h-5" />}
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {isLoading || stat.value === null ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
            ) : (
              stat.value
            )}
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

const zapIcon = Zap;
