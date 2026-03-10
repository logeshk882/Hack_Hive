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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold text-foreground">Browse by Category</h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {nonEmpty.length} categories · expand to explore
                </p>
            </motion.div>

            <div className="flex flex-col gap-4">
                {nonEmpty.map(([category, hackathons], idx) => {
                    const Icon = CATEGORY_ICONS[category] ?? Box;
                    const colors = CATEGORY_COLORS[category] ?? "text-primary bg-primary/10 border-primary/20";
                    const isOpen = expanded[category] ?? false;
                    const preview = hackathons.slice(0, 3);

                    return (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.06 }}
                            className="glass rounded-2xl overflow-hidden border border-border/40"
                        >
                            {/* Category Header */}
                            <button
                                onClick={() => toggle(category)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg border text-sm ${colors}`}>
                                        <Icon className="w-4 h-4" />
                                    </span>
                                    <div className="text-left">
                                        <p className="font-semibold text-foreground text-sm">{category}</p>
                                        <p className="text-[11px] text-muted-foreground font-mono">
                                            {hackathons.length} hackathon{hackathons.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Mini preview dots */}
                                    <div className="hidden md:flex gap-1">
                                        {preview.map((h) => (
                                            <span
                                                key={h._id || h.title}
                                                className="w-1.5 h-1.5 rounded-full bg-primary/40"
                                            />
                                        ))}
                                        {hackathons.length > 3 && (
                                            <span className="text-[10px] text-muted-foreground font-mono ml-1">
                                                +{hackathons.length - 3}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
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
                                        <div className="px-6 pb-6 pt-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
