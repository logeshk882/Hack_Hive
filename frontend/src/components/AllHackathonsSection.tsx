import { useState, useCallback, Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, List, Loader2, ServerOff, SlidersHorizontal, X, Plus } from "lucide-react";
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
  url: string;
}

const ITEMS_PER_PAGE = 24;

export default function AllHackathonsSection({ searchQuery = "" }: { searchQuery?: string }) {
  const [activeSource, setActiveSource] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery<Hackathon[]>({
    queryKey: ["hackathons", activeSource, activeCategory, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.append("skip", String(pageParam));
      params.append("limit", String(ITEMS_PER_PAGE));
      
      if (activeSource !== "All") params.append("source", activeSource);
      
      // If we have a category, we use the first keyword as a simple tag filter
      // Alternatively, we could update the backend to support category-based keywords
      if (activeCategory !== "All") {
        const keywords = TAG_MAP[activeCategory] || [];
        if (keywords.length > 0) {
          params.append("search", keywords[0]); // Simple fallback to using first keyword as search
        }
      }
      
      if (searchQuery.trim()) {
        params.append("search", searchQuery);
      }

      const res = await fetch(`/api/hackathons?${params.toString()}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === ITEMS_PER_PAGE ? allPages.length * ITEMS_PER_PAGE : undefined;
    },
    initialPageParam: 0,
  });

  const allHackathons = data?.pages.flat() || [];

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
        className="flex flex-col gap-6 mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold text-foreground serif">All Opportunities</h2>
            <p className="text-sm text-muted-foreground/60 mt-2 font-medium">
              A comprehensive directory of {allHackathons.length} active hackathons
              {hasActiveFilters && " curated for your preferences"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
              >
                <X className="w-3 h-3" /> Reset
              </motion.button>
            )}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${showFilters ? "bg-primary text-primary-foreground shadow-premium" : "glass text-muted-foreground hover:text-foreground"
                }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Advanced Filters
            </button>

            {/* View toggle */}
            <div className="flex glass rounded-full overflow-hidden border border-white/5 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-all duration-300 ${viewMode === "grid" ? "bg-white/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-all duration-300 ${viewMode === "list" ? "bg-white/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="w-4 h-4" />
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
              <div className="glass-card rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 border-white/5">
                {/* Source filter */}
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">Discovery Platform</p>
                  <div className="flex flex-wrap gap-2">
                    {SOURCES.map(src => (
                      <button
                        key={src}
                        onClick={() => setActiveSource(src)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${activeSource === src
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-white/5 border-white/5 text-muted-foreground/60 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        {src}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category filter */}
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">Vertical Category</p>
                  <div className="flex flex-wrap gap-2">
                    {TAG_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${activeCategory === cat
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-white/5 border-white/5 text-muted-foreground/60 hover:text-white hover:bg-white/10"
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
          <div className="flex flex-wrap gap-3">
            {SOURCES.map(src => (
              <button
                key={src}
                onClick={() => setActiveSource(src)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${activeSource === src
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-white/5 glass text-muted-foreground hover:text-foreground bg-white/5"
                  }`}
              >
                {src === "All" ? "All Platforms" : src}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Grid / List */}
      {allHackathons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5 mb-2">
              <ServerOff className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground/60 font-medium serif text-xl">No opportunities match your current filters</p>
          <button onClick={clearFilters} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "flex flex-col gap-6"
            }
          >
            <AnimatePresence mode="popLayout">
              {allHackathons.map((h, i) => (
                <motion.div
                  key={h._id || h.title + i}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: i < 9 ? i * 0.05 : 0 }}
                  className={viewMode === "list" ? "w-full" : ""}
                >
                  <HackathonCard {...h} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-20 pb-20">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center gap-3 px-10 py-4 rounded-full bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.2em] shadow-premium hover:shadow-2xl transition-all duration-500 disabled:opacity-50 group"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                    Load More Opportunities
                  </>
                )}
              </button>
            </div>
          )}
          
          {!hasNextPage && allHackathons.length > 0 && (
            <div className="text-center text-muted-foreground/30 text-[10px] font-bold uppercase tracking-[0.4em] mt-24 pb-20">
              You have explored all currently available opportunities
            </div>
          )}
        </>
      )}
    </section>
  );
}
