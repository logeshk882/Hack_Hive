import { useState } from "react";
import InteractiveBackground from "../components/InteractiveBackground";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsBar from "../components/StatsBar";
import TrendingSection from "../components/TrendingSection";
import CategorySection from "../components/CategorySection";
import AllHackathonsSection from "../components/AllHackathonsSection";
import SignInModal from "../components/SignInModal";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <InteractiveBackground />
      <Navbar onSignInClick={() => setIsSignInOpen(true)} />

      {/* Hero */}
      <HeroSection onSearch={setSearchQuery} searchQuery={searchQuery} />

      {/* Stats */}
      <div className="relative z-10 px-6 -mt-24 mb-32">
        <StatsBar />
      </div>

      {/* Trending */}
      <div className="relative z-10 px-6 max-w-7xl mx-auto mb-32">
        <TrendingSection />
      </div>

      {/* Category Browse */}
      <div className="relative z-10 px-6 max-w-7xl mx-auto mb-32">
        <CategorySection />
      </div>

      {/* All Hackathons with filters */}
      <div id="all-hackathons" className="relative z-10 px-6 max-w-7xl mx-auto mb-32">
        <AllHackathonsSection searchQuery={searchQuery} />
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-16 px-6 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
          <span>© 2026 HackPulse. Engineered for Builders.</span>
          <div className="flex gap-10">
            <a href="#" className="hover:text-primary transition-colors">Privacy Collective</a>
            <a href="#" className="hover:text-primary transition-colors">Manifesto</a>
            <a href="#" className="hover:text-primary transition-colors">Intelligence API</a>
            <a href="#" className="hover:text-primary transition-colors">Commune</a>
          </div>
        </div>
      </footer>

      {/* Dynamic Sign In Modal */}
      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />
    </div>
  );
};

export default Index;
