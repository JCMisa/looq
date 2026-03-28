"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { PenTool, Play, BarChart3, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: PenTool,
    number: "01",
    title: "Create Your Exam",
    description:
      "Build exams with MCQ, essay, identification, or coding questions. Set proctoring rules — camera, microphone, tab switch detection, and violation limits.",
  },
  {
    icon: Play,
    number: "02",
    title: "Students Take It Securely",
    description:
      "Students join with camera and mic enabled. Looq's AI monitors integrity in real-time — tracking tab switches, fullscreen exits, and suspicious activity.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Monitor Live",
    description:
      "Teachers view all active sessions on a live dashboard. See camera feeds, heartbeat status, and receive instant violation alerts. Flag or terminate sessions in one click.",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "AI Grades Instantly",
    description:
      "MCQs and identifications are auto-scored. Essays and code are graded by Gemini AI using rubrics and test cases. Students receive detailed feedback.",
  },
];

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative flex gap-6"
    >
      {/* Timeline line */}
      <div className="hidden sm:flex flex-col items-center">
        <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm shrink-0 shadow-lg shadow-primary/25">
          {step.number}
        </div>
        {index < steps.length - 1 && (
          <div className="w-px flex-1 bg-border mt-4" />
        )}
      </div>

      <div className="pb-12 sm:pb-16">
        <div className="sm:hidden mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          Step {step.number}
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">
          {step.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed max-w-lg">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Parallax background decoration */}
      <motion.div
        style={{ y: bgY }}
        className="absolute -right-40 top-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            How It Works
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            From creation to{" "}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              grading in minutes
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four simple steps to run secure, AI-powered exams at scale.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
