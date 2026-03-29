import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import SearchBar from "./SearchBar";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export default function HeroSection({ onSearch, searchQuery }: HeroSectionProps) {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden">
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Empowering the next generation of builders
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tight text-foreground serif leading-[1]">
            Build the <span className="text-primary italic">Incredible</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-medium leading-[1.6]">
            Discovery engine for the world's most ambitious hackathons. Access opportunities across the web, powered by precision intelligence.
          </p>
        </motion.div>

        {/* Search Bar Container */}
        <div className="w-full max-w-2xl mx-auto relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="group relative"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000" />
            <SearchBar onSearch={onSearch} value={searchQuery} />
          </motion.div>
        </div>

        {/* CTA Buttons - Increased Margin */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-20 relative z-10"
        >
          <button
            onClick={() => document.getElementById('all-hackathons')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-12 py-5 rounded-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-[0.2em] shadow-premium hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Explore All Hackathons
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
          
          <button className="px-12 py-5 rounded-full glass border-white/5 text-foreground/80 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all duration-300">
            Learn how we aggregate
          </button>
        </motion.div>
      </div>

      {/* Source logos - Clean Editorial Look */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="relative z-10 mt-24 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-muted-foreground/20 text-[10px] font-bold tracking-[0.3em] uppercase"
      >
        <span className="hover:text-muted-foreground/60 transition-colors cursor-default">Devpost</span>
        <span className="hover:text-muted-foreground/60 transition-colors cursor-default">Unstop</span>
        <span className="hover:text-muted-foreground/60 transition-colors cursor-default">Knowafest</span>
        <span className="hover:text-muted-foreground/60 transition-colors cursor-default">MLH</span>
        <span className="hover:text-muted-foreground/60 transition-colors cursor-default">DoraHacks</span>
      </motion.div>
    </section>
  );
}
