import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, X } from "lucide-react";

const SUGGESTIONS = [
  "AI hackathons in India",
  "Blockchain event near me",
  "Open Source contribution",
  "Cybersecurity CTF challenge",
  "Climate & sustainability hack",
  "Machine learning competition",
];

interface SearchBarProps {
  onSearch?: (query: string) => void;
  value?: string;
}

export default function SearchBar({ onSearch, value = "" }: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value
  useEffect(() => { setQuery(value); }, [value]);

  const handleChange = (val: string) => {
    setQuery(val);
    onSearch?.(val);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    onSearch?.(tag);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  const filteredSuggestions = SUGGESTIONS.filter(s =>
    query ? s.toLowerCase().includes(query.toLowerCase()) : true
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="w-full max-w-2xl mx-auto relative"
    >
      <div
        className={`relative glass rounded-2xl transition-all duration-500 ${focused ? "search-glow" : "glow-border"
          }`}
      >
        <div className="flex items-center px-5 py-4 gap-3">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => { setFocused(true); setShowSuggestions(true); }}
            onBlur={() => { setFocused(false); setTimeout(() => setShowSuggestions(false), 150); }}
            placeholder='Search hackathons by name, category, location…'
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none font-light"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            AI Search
          </div>
        </div>

        {/* Suggestion dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 top-full mt-2 glass rounded-xl overflow-hidden z-50 shadow-xl border border-border/50"
            >
              {filteredSuggestions.map((s, i) => (
                <button
                  key={s}
                  onMouseDown={() => handleTagClick(s)}
                  className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-primary/10 transition-colors text-sm text-muted-foreground hover:text-foreground group"
                >
                  <Search className="w-3 h-3 text-primary/50 group-hover:text-primary transition-colors" />
                  <span>{s}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick tag chips */}
      <div className="flex items-center gap-2 mt-3 justify-center flex-wrap">
        {["AI / ML", "Blockchain", "Web3", "Cybersecurity", "Open Source", "Climate"].map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${query === tag
                ? "bg-primary/20 text-primary border border-primary/40"
                : "glass text-muted-foreground hover:text-primary hover:border-primary/30 border border-transparent"
              }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
