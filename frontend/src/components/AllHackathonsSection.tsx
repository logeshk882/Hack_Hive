import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, List, Loader2, ServerOff, SlidersHorizontal, X } from "lucide-react";
import HackathonCard from "./HackathonCard";

const SOURCES = ["All", "knowafest", "devpost", "unstop"];
const TAG_CATEGORIES = ["All", "AI / ML", "Web3", "Cybersecurity", "Climate", "Open Source", "Design"];

const TAG_MAP: Record<string, string[]> = {
  "AI / ML": ["AI", "ML", "Machine Learning", "Data Science", "Deep Learning", "NLP"],
  "Web3": ["Blockchain", "Web3", "DeFi", "NFT", "Crypto", "Solidity"],
  "Cybersecurity": ["Cybersecurity", "Security", "CTF", "Hacking"],
  "Climate": ["Climate", "Environment", "Green", "Sustainability"],
  "Open Source": ["Open Source", "OSS", "GitHub"],
  "Design": ["Design", "UX", "UI", "Creative"],
};

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
}

export default function AllHackathonsSection({ searchQuery = "" }: { searchQuery?: string }) {
  const [activeSource, setActiveSource] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { data: allHackathons = [], isLoading, error } = useQuery<Hackathon[]>({
    queryKey: ["hackathons"],
    queryFn: async () => {
      const res = await fetch("/api/hackathons");
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  const filtered = useMemo(() => {
    let list = allHackathons;

    // Source filter
    if (activeSource !== "All") {
      list = list.filter(h => h.source?.toLowerCase() === activeSource.toLowerCase());
    }

    // Category / tag filter
    if (activeCategory !== "All") {
      const keywords = TAG_MAP[activeCategory] ?? [];
      list = list.filter(h => {
        const hTags = (h.tags || []).map(t => t.toLowerCase());
        const title = (h.title || "").toLowerCase();
        return keywords.some(kw =>
          hTags.some(t => t.includes(kw.toLowerCase())) || title.includes(kw.toLowerCase())
        );
      });
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(h =>
        h.title?.toLowerCase().includes(q) ||
        h.organizer?.toLowerCase().includes(q) ||
        h.location?.toLowerCase().includes(q) ||
        h.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allHackathons, activeSource, activeCategory, searchQuery]);

  const clearFilters = useCallback(() => {
    setActiveSource("All");
    setActiveCategory("All");
  }, []);

  const hasActiveFilters = activeSource !== "All" || activeCategory !== "All";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading hackathons...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <ServerOff className="w-10 h-10 text-destructive/60" />
        <p className="text-muted-foreground text-sm">Failed to load hackathons. Make sure the backend is running.</p>
      </div>
    );
  }

  return (
    <section>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col gap-4 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">All Hackathons</h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {hasActiveFilters && " · filtered"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
              >
                <X className="w-3 h-3" /> Clear Filters
              </motion.button>
            )}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${showFilters ? "bg-primary/10 text-primary border border-primary/30" : "glass text-muted-foreground hover:text-foreground"
                }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* View toggle */}
            <div className="flex glass rounded-lg overflow-hidden border border-border/50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-xl p-4 flex flex-col gap-4">
                {/* Source filter */}
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Platform</p>
                  <div className="flex flex-wrap gap-2">
                    {SOURCES.map(src => (
                      <button
                        key={src}
                        onClick={() => setActiveSource(src)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${activeSource === src
                            ? "bg-primary/20 text-primary border-primary/40"
                            : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                          }`}
                      >
                        {src}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category filter */}
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {TAG_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${activeCategory === cat
                            ? "bg-neon-violet/20 text-purple-300 border-purple-500/40"
                            : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick filter chips (always visible) */}
        {!showFilters && (
          <div className="flex flex-wrap gap-2">
            {SOURCES.map(src => (
              <button
                key={src}
                onClick={() => setActiveSource(src)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${activeSource === src
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border/40 glass text-muted-foreground hover:text-foreground"
                  }`}
              >
                {src === "All" ? "All Platforms" : src.charAt(0).toUpperCase() + src.slice(1)}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-muted-foreground font-medium">No hackathons match your filters</p>
          <button onClick={clearFilters} className="text-xs text-primary hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              : "flex flex-col gap-4"
          }
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((h, i) => (
              <motion.div
                key={h._id || h.title}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2, delay: i < 12 ? i * 0.04 : 0 }}
                className={viewMode === "list" ? "w-full" : ""}
              >
                <HackathonCard {...h} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
