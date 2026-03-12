import { useState } from "react";
import InteractiveBackground from "../components/InteractiveBackground";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsBar from "../components/StatsBar";
import TrendingSection from "../components/TrendingSection";
import CategorySection from "../components/CategorySection";
import AllHackathonsSection from "../components/AllHackathonsSection";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background relative selection:bg-cyan-500/30">
      <InteractiveBackground />
      <Navbar />

      {/* Hero */}
      <HeroSection onSearch={setSearchQuery} searchQuery={searchQuery} />

      {/* Stats */}
      <div className="relative z-10 px-6 -mt-20 mb-20">
        <StatsBar />
      </div>

      {/* Trending */}
      <div className="relative z-10 px-6 max-w-7xl mx-auto mb-20">
        <TrendingSection />
      </div>

      {/* Category Browse */}
      <div className="relative z-10 px-6 max-w-7xl mx-auto mb-20">
        <CategorySection />
      </div>

      {/* All Hackathons with filters */}
      <div id="all-hackathons" className="relative z-10 px-6 max-w-7xl mx-auto mb-20">
        <AllHackathonsSection searchQuery={searchQuery} />
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="font-mono">© 2026 HackPulse. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">API Docs</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
