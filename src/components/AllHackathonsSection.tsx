import { motion } from "framer-motion";
import HackathonCard from "./HackathonCard";

const allHackathons = [
  {
    title: "MIT Reality Hack 2026",
    organizer: "MIT Media Lab",
    deadline: "2026-03-25",
    participants: "1.5K+",
    prize: "$75K",
    tags: ["AR / VR", "XR", "AI"],
    location: "Boston, USA",
    source: "Devpost",
  },
  {
    title: "Smart India Hackathon",
    organizer: "Govt. of India",
    deadline: "2026-04-30",
    participants: "50K+",
    prize: "₹25L",
    tags: ["Civic Tech", "AI / ML", "IoT"],
    location: "India (Multiple Cities)",
    source: "Knowafest",
  },
  {
    title: "Buildathon 2026",
    organizer: "Polygon Labs",
    deadline: "2026-04-08",
    participants: "4K+",
    prize: "$250K",
    tags: ["Web3", "ZK Proofs", "DeFi"],
    location: "Online",
    source: "Unstop",
  },
  {
    title: "NASA Space Apps 2026",
    organizer: "NASA",
    deadline: "2026-05-15",
    participants: "30K+",
    prize: "Various",
    tags: ["Space", "Data Science", "Climate"],
    location: "Global",
    source: "Devpost",
  },
  {
    title: "HackMIT 2026",
    organizer: "MIT",
    deadline: "2026-04-18",
    participants: "1.2K+",
    prize: "$80K",
    tags: ["AI", "FinTech", "Health"],
    location: "Cambridge, USA",
    source: "Devpost",
  },
  {
    title: "Junction X 2026",
    organizer: "Junction",
    deadline: "2026-05-01",
    participants: "3K+",
    prize: "€100K",
    tags: ["Sustainability", "AI", "Open Source"],
    location: "Helsinki, Finland",
    source: "Unstop",
  },
];

export default function AllHackathonsSection() {
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                filter === "All"
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
