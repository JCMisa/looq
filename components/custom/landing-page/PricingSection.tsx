"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "₱0",
    period: "forever",
    description: "Perfect for trying Looq with small classes.",
    features: [
      "Up to 30 students",
      "5 exams per month",
      "MCQ & Identification",
      "Basic proctoring",
      "Manual grading",
    ],
    cta: "Get Started",
    variant: "outline",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₱2,499",
    period: "/month per university",
    description: "Full power for departments and faculties.",
    features: [
      "Unlimited students",
      "Unlimited exams",
      "All question types (incl. Coding)",
      "AI grading with feedback",
      "Live monitoring dashboard",
      "Full cheating detection suite",
      "Priority support",
    ],
    cta: "Start Free Trial",
    variant: "default",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For university consortiums and large institutions.",
    features: [
      "Everything in Pro",
      "Multi-campus management",
      "Custom integrations",
      "Dedicated account manager",
      "SLA & uptime guarantee",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    variant: "outline",
    highlighted: false,
  },
];

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[0];
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
      className={`relative p-6 sm:p-8 rounded-2xl border flex flex-col ${
        plan.highlighted
          ? "bg-primary/[0.03] border-primary/30 shadow-xl shadow-primary/10 ring-1 ring-primary/10"
          : "bg-card border-border/50"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {plan.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-heading text-4xl font-bold text-foreground">
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-sm text-muted-foreground">{plan.period}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm text-foreground"
          >
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={
          plan.variant as
            | "outline"
            | "default"
            | "link"
            | "secondary"
            | "ghost"
            | "destructive"
            | null
            | undefined
        }
        className={`w-full h-11 font-semibold ${
          plan.highlighted
            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            : ""
        }`}
      >
        {plan.cta}
      </Button>
    </motion.div>
  );
}

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            Pricing
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Plans for every{" "}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              university
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free and scale as your institution grows.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <PricingCard key={i} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
