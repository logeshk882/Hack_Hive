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
    <div className="w-full max-w-2xl mx-auto relative">
      <div
        className={`relative glass rounded-2xl transition-all duration-500 overflow-hidden ${focused ? "shadow-premium border-primary/30" : "border-white/10"
          }`}
      >
        <div className="flex items-center px-6 py-4.5 gap-4">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => { setFocused(true); setShowSuggestions(true); }}
            onBlur={() => { setFocused(false); setTimeout(() => setShowSuggestions(false), 200); }}
            placeholder='Search hackathons by name, category, location…'
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-base outline-none font-medium"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest shrink-0 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI Intelligence
          </div>
        </div>

        {/* Suggestion dropdown - Higher visibility */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/5 bg-background/95 backdrop-blur-2xl z-50 shadow-2xl"
            >
              <div className="py-2">
                {filteredSuggestions.map((s, i) => (
                  <button
                    key={s}
                    onMouseDown={() => handleTagClick(s)}
                    className="w-full text-left flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors text-sm text-foreground/70 hover:text-white group"
                  >
                    <Search className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                    <span className="font-medium">{s}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick tag chips - Cleaner look */}
      <div className="flex items-center gap-3 mt-4 justify-center flex-wrap">
        {["AI / ML", "Blockchain", "Web3", "Cybersecurity", "Open Source", "Climate"].map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${query === tag
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white/5 text-muted-foreground/60 hover:text-white hover:bg-white/10 border-white/5"
              }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
