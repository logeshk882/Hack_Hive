import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Globe3D from "./Globe3D";
import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Globe Background */}
      <Globe3D />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(222_47%_4%)_70%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-primary mb-8"
        >
          <Zap className="w-3.5 h-3.5" />
          Aggregating 2,800+ hackathons in real-time
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
        >
          <span className="text-foreground">Discover Every</span>
          <br />
          <span className="text-gradient">Hackathon. Instantly.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light"
        >
          AI-powered aggregation from Devpost, Unstop, Knowafest, and across the internet.
          Never miss a hackathon again.
        </motion.p>

        {/* Search Bar */}
        <SearchBar />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <button className="px-8 py-3 rounded-xl bg-gradient-neon text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-300 glow-cyan animate-glow-pulse">
            Explore Hackathons
          </button>
          <button className="px-8 py-3 rounded-xl glass text-foreground font-medium text-sm hover:text-primary hover:border-primary/30 transition-all duration-300">
            How it works
          </button>
        </motion.div>

        {/* Source logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8 text-muted-foreground/50 text-xs font-mono tracking-wider"
        >
          <span>DEVPOST</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>UNSTOP</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>KNOWAFEST</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>MLH</span>
        </motion.div>
      </div>
    </section>
  );
}
