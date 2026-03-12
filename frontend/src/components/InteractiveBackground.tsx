import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const gap = 40; // Grid spacing

    class Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      friction: number;
      ease: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.size = 1.2;
        this.color = "rgba(34, 211, 238, 0.4)";
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.9;
        this.ease = 0.08;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (mouse.current.active && distance < 180) {
          const force = (180 - distance) / 180;
          this.vx -= dx * force * 0.4;
          this.vy -= dy * force * 0.4;
          this.color = `rgba(168, 85, 247, ${0.4 + force * 0.6})`; // Shift to purple
          this.size = 1.2 + force * 2;
        } else {
          this.vx += (this.originX - this.x) * this.ease;
          this.vy += (this.originY - this.y) * this.ease;
          this.color = "rgba(34, 211, 238, 0.4)";
          this.size = 1.2;
        }

        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          particles.push(new Particle(x, y));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw interactive connections
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        
        // Draw lines to mouse if close
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (mouse.current.active && dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
    };

    const handleResize = () => {
      init();
    };

    init();
    animate();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#020617]">
        {/* Animated Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
        
        <canvas
            ref={canvasRef}
            className="absolute inset-0 opacity-40 mix-blend-screen"
        />
        
        {/* Custom cursor glow following mouse */}
        <CursorAura />
    </div>
  );
}

function CursorAura() {
    const auraRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (auraRef.current) {
                auraRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
            }
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <div 
            ref={auraRef}
            className="w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px] fixed top-0 left-0 transition-transform duration-300 ease-out pointer-events-none mix-blend-screen z-0"
        />
    );
}
