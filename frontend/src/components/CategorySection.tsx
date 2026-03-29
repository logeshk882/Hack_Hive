import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Loader2, Cpu, Link2, Shield, Leaf, GitMerge, Palette, Box } from "lucide-react";
import HackathonCard from "./HackathonCard";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    "AI / ML": Cpu,
    "Web3 / Blockchain": Link2,
    "Cybersecurity": Shield,
    "Climate / Nature": Leaf,
    "Open Source": GitMerge,
    "Design / UX": Palette,
    "General / Other": Box,
};

const CATEGORY_COLORS: Record<string, string> = {
    "AI / ML": "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    "Web3 / Blockchain": "text-purple-400 bg-purple-400/10 border-purple-400/20",
    "Cybersecurity": "text-red-400 bg-red-400/10 border-red-400/20",
    "Climate / Nature": "text-green-400 bg-green-400/10 border-green-400/20",
    "Open Source": "text-orange-400 bg-orange-400/10 border-orange-400/20",
    "Design / UX": "text-pink-400 bg-pink-400/10 border-pink-400/20",
    "General / Other": "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

interface Hackathon {
    _id?: string;
    title: string;
    organizer: string;
    deadline: string;
    participants: string;
    prize: string;
    tags: string[];
    location: string;
    source: string;
    url: string;
}

export default function CategorySection() {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const { data: categories = {}, isLoading, error } = useQuery<Record<string, Hackathon[]>>({
        queryKey: ["hackathon-categories"],
        queryFn: async () => {
            const res = await fetch("/api/hackathons/categories");
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        },
    });

    const toggle = (cat: string) => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) return null;

    const nonEmpty = Object.entries(categories).filter(([, v]) => v.length > 0);
    if (nonEmpty.length === 0) return null;

    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 text-center"
            >
                <h2 className="text-4xl font-bold text-foreground serif">Curated Ecosystems</h2>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                    Explore hackathons by specialized domains. Each category is hand-vetted for quality and authenticity.
                </p>
            </motion.div>

            <div className="flex flex-col gap-5">
                {nonEmpty.map(([category, hackathons], idx) => {
                    const Icon = CATEGORY_ICONS[category] ?? Box;
                    const isOpen = expanded[category] ?? false;
                    const preview = hackathons.slice(0, 3);

                    return (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className={`glass-card rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 ${isOpen ? 'shadow-premium' : ''}`}
                        >
                            {/* Category Header */}
                            <button
                                onClick={() => toggle(category)}
                                className={`w-full flex items-center justify-between px-8 py-6 transition-all duration-300 ${isOpen ? 'bg-white/5' : 'hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-5 text-left">
                                    <div className={`p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-inner-glow`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground serif">{category}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                                {hackathons.length} Opportunities Available
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    {/* Mini preview items */}
                                    <div className="hidden md:flex -space-x-3 overflow-hidden">
                                        {preview.map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground"
                                            >
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 transition-colors ${isOpen ? 'bg-primary text-white border-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </span>
                                </div>
                            </button>

                            {/* Expanded card grid */}
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-8 pb-8 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {hackathons.map((h, i) => (
                                                    <HackathonCard key={h._id || h.title} {...h} index={i} />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
