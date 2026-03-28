"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LaserFlowBoxExample from "./LaserFlowBoxExample";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative flex items-center overflow-hidden pt-20 lg:pt-0"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl animate-pulse-glow" />
        <div
          className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full bg-primary/6 blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <LaserFlowBoxExample />
      </motion.div>
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full",
          "bg-gradient-to-t from-background via-background/80 to-transparent",
          "dark:from-background dark:via-background/70 dark:to-transparent",
        )}
      />
    </section>
  );
}
