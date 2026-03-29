import { motion, useScroll, useSpring } from "framer-motion";
import { Code2, Github, Twitter } from "lucide-react";

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight serif">HackPulse</span>
          <span className="text-[9px] font-bold text-muted-foreground/40 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">
            v1.0
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          <a href="#" className="hover:text-primary transition-colors">Opportunities</a>
          <a href="#" className="hover:text-primary transition-colors">Ecosystem</a>
          <a href="#" className="hover:text-primary transition-colors">Intelligence</a>
          <a href="#" className="hover:text-primary transition-colors">Docs</a>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 border-r border-white/10 pr-5 mr-1">
            <a href="#" className="text-muted-foreground/40 hover:text-primary transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="text-muted-foreground/40 hover:text-primary transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
          <button className="px-6 py-2 rounded-full bg-white/5 text-foreground/80 text-xs font-bold uppercase tracking-widest border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300">
            Sign In
          </button>
        </div>
      </div>

      {/* Progress Bar - Minimal */}
      <motion.div
        className="h-[1px] bg-primary origin-left"
        style={{ scaleX }}
      />
    </motion.nav>
  );
}
