import { motion } from "framer-motion";
import { Activity, Calendar, Globe2, TrendingUp, Loader2 } from "lucide-react";
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
      label: "Providers",
      value: isLoading ? null : new Set(hackathons.map((h: any) => h.source)).size.toString(),
      icon: TrendingUp,
      color: "text-neon-pink"
    },
    {
      label: "Locations",
      value: isLoading ? null : new Set(hackathons.map((h: any) => h.location)).size.toString(),
      icon: Globe2,
      color: "text-neon-violet"
    },
    {
      label: "Global Reach",
      value: "Worldwide",
      icon: Calendar,
      color: "text-neon-purple"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass rounded-xl p-5 text-center group hover:glow-border transition-all duration-500"
        >
          <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
          <div className="text-2xl font-bold text-foreground font-mono flex justify-center items-center h-8">
            {isLoading || stat.value === null ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              stat.value
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
