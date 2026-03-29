import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      
      // Lazily move gradients towards mouse
      containerRef.current.style.setProperty("--mouse-x", `${x}%`);
      containerRef.current.style.setProperty("--mouse-y", `${y}%`);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 bg-background overflow-hidden mesh-bg transition-colors duration-1000"
      style={{
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      } as any}
    >
      {/* Drifting atmospheric orbs */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-20 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.15), transparent 80%)`
        }}
      />
      
      <div className="absolute top-[10%] left-[15%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-smooth-float" />
      <div className="absolute bottom-[10%] right-[15%] w-[50%] h-[50%] bg-accent/5 blur-[140px] rounded-full animate-smooth-float" style={{ animationDelay: '-4s' }} />
      
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
}
