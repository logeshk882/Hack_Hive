import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className={`relative glass rounded-2xl transition-all duration-500 ${
          focused ? "search-glow" : "glow-border"
        }`}
      >
        <div className="flex items-center px-5 py-4 gap-3">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder='Try: "AI hackathons in India ending this month"'
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none font-light"
          />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            AI Search
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 justify-center flex-wrap">
        {["AI / ML", "Blockchain", "Web3", "Cybersecurity", "Open Source", "Climate"].map((tag) => (
          <button
            key={tag}
            className="px-3 py-1 rounded-full text-xs font-medium glass text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
