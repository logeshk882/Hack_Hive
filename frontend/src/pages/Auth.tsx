import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Mail, Lock, User, ArrowRight, Code2, Sparkles, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import InteractiveBackground from "../components/InteractiveBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "signin" | "signup";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth lag for effect
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6 selection:bg-primary/30">
      <InteractiveBackground />
      
      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-8 left-8 z-50"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Terminal Home
        </Link>
      </motion.div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 mb-12"
        >
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/20">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight serif mb-2">
              {mode === "signin" ? "Neural Access" : "Create Node"}
            </h1>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center justify-center gap-2">
              {mode === "signin" ? (
                <>
                  <Sparkles className="w-3 h-3 text-primary" />
                  Authenticate to HackPulse
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-primary" />
                  Join the Global Collective
                </>
              )}
            </p>
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
                    Handle Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="GhostInTheShell" 
                      className="pl-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all h-12"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
                Ether Mail
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email"
                  placeholder="nexus@hackpulse.io" 
                  className="pl-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Access Key
                </Label>
                {mode === "signin" && (
                  <button type="button" className="text-[9px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                    Passcode Lost?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="pl-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all h-12"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest group relative overflow-hidden"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {mode === "signin" ? "Initialize Logic" : "Establish Node"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/30 mb-6">
              External Handshakes
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-11 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 gap-2 font-bold uppercase tracking-widest text-[10px]">
                <Github className="w-4 h-4" /> Github
              </Button>
              <Button variant="outline" className="h-11 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 gap-2 font-bold uppercase tracking-widest text-[10px]">
                <span className="text-lg">G</span> Google
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Footer Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button 
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors inline-flex items-center gap-2 group"
          >
            {mode === "signin" ? (
              <>
                New to the network? <span className="text-primary group-hover:underline underline-offset-4">Create identity</span>
              </>
            ) : (
              <>
                Existing node? <span className="text-primary group-hover:underline underline-offset-4">Decrypt access</span>
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Decorative Blur */}
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
