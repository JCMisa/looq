"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Looq transformed how we conduct midterms. The live monitoring dashboard gives us full visibility, and the AI grading saves our faculty 40+ hours per semester.",
    name: "Dr. Maria Santos",
    role: "Dean of Engineering",
    university: "Polytechnic University of the Philippines",
    rating: 5,
  },
  {
    quote:
      "As an IT professor, I love the coding question support. Students write and submit code during exams, and the AI evaluates it against test cases instantly. Game changer.",
    name: "Prof. James Reyes",
    role: "Computer Science Department",
    university: "University of the Philippines - Diliman",
    rating: 5,
  },
  {
    quote:
      "The multi-university setup is perfect for our consortium. Each campus manages its own exams with separate billing. Setup took less than a day.",
    name: "Dr. Angela Cruz",
    role: "VP for Academic Affairs",
    university: "De La Salle University",
    rating: 5,
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative p-6 sm:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-500 flex flex-col"
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <blockquote className="text-foreground leading-relaxed flex-1 mb-6">
        &quot;{testimonial.quote}&quot;
      </blockquote>
      <div className="border-t border-border/50 pt-4">
        <p className="font-heading font-semibold text-foreground text-sm">
          {testimonial.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {testimonial.role}
        </p>
        <p className="text-xs text-primary font-medium mt-0.5">
          {testimonial.university}
        </p>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            Testimonials
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              educators
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from university leaders who&apos;ve made the switch to Looq.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
