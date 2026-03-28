"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Video,
  Brain,
  FileCheck,
  Shield,
  Code2,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Live Camera & Mic Monitoring",
    description:
      "Real-time webcam and microphone feeds for every student. Teachers monitor live from a single dashboard with instant alerts.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Shield,
    title: "AI Integrity Engine",
    description:
      "Detects tab switches, fullscreen exits, and suspicious behavior. Configurable violation thresholds auto-flag or terminate sessions.",
    color: "bg-red-500/10 text-red-600",
  },
  {
    icon: Brain,
    title: "Automated AI Grading",
    description:
      "Essay, identification, and coding answers graded instantly with Gemini AI. Rubric-based scoring with personalized feedback.",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Code2,
    title: "Multi-Type Question Builder",
    description:
      "Create MCQ, Essay, Identification, and Coding questions in a single exam. Full test case support for coding evaluations.",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track exam progress, score distributions, and student performance live. Heartbeat monitoring detects disconnections instantly.",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: FileCheck,
    title: "Multi-University Support",
    description:
      "Built for organizations. Each university is a separate tenant with its own teachers, students, exams, and billing plan.",
    color: "bg-teal-500/10 text-teal-600",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-6 sm:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5"
    >
      <div
        className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
      >
        <feature.icon className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            Features
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              secure exams
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From AI proctoring to automated grading — Looq handles the entire
            exam lifecycle so you can focus on teaching.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
