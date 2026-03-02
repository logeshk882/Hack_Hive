import { motion } from "framer-motion";
import { Code2, Github, Twitter } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground tracking-tight">HackPulse</span>
          <span className="text-[10px] font-mono text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
            BETA
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Hackathons</a>
          <a href="#" className="hover:text-foreground transition-colors">Workshops</a>
          <a href="#" className="hover:text-foreground transition-colors">Calendar</a>
          <a href="#" className="hover:text-foreground transition-colors">API</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <button className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-all duration-300">
            Sign In
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
