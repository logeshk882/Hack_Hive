import { motion } from "framer-motion";
import { Activity, Calendar, Globe2, TrendingUp } from "lucide-react";

const stats = [
  { label: "Active Hackathons", value: "2,847", icon: Activity, color: "text-primary" },
  { label: "This Week", value: "342", icon: Calendar, color: "text-neon-purple" },
  { label: "Countries", value: "89", icon: Globe2, color: "text-neon-violet" },
  { label: "Total Prize Pool", value: "$12.4M", icon: TrendingUp, color: "text-neon-pink" },
];

export default function StatsBar() {
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
          <div className="text-2xl font-bold text-foreground font-mono">{stat.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
