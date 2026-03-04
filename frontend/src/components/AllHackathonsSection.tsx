import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import HackathonCard from "./HackathonCard";

export default function AllHackathonsSection() {
  const { data: allHackathons = [], isLoading, error } = useQuery({
    queryKey: ['hackathons'],
    queryFn: async () => {
      const response = await fetch('/api/hackathons');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-muted-foreground">Loading hackathons...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-destructive">
        Error loading hackathons. Please try again later.
      </div>
    );
  }
  return (
    <section>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-2xl font-bold text-foreground">All Hackathons</h2>
        <div className="flex gap-2">
          {["All", "Devpost", "Unstop", "Knowafest"].map((filter) => (
            <button
              key={filter}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${filter === "All"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "glass text-muted-foreground hover:text-foreground"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allHackathons.map((h, i) => (
          <HackathonCard key={h.title} {...h} index={i} />
        ))}
      </div>
    </section>
  );
}
