"use client";

import LaserFlow from "@/components/react-bits/LaserFlow";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LaserFlowBoxExample() {
  const revealImgRef = useRef<HTMLImageElement>(null);

  return (
    <div
      style={{
        height: "850px", // Slightly increased to give header more room
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty("--mx", `${x}px`);
          el.style.setProperty("--my", `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty("--mx", "-9999px");
          el.style.setProperty("--my", "-9999px");
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.3}
        verticalBeamOffset={0.0}
        color="#372aac"
        fogIntensity={0.6}
        fogScale={0.4}
        wispIntensity={6}
        wispSpeed={12}
        flowSpeed={0.4}
        className="z-50"
      />

      {/* Hero Content Overlay */}
      <div className="absolute top-[12%] left-0 w-full z-[60] flex flex-col items-center text-center px-6 pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 pointer-events-auto">
          Secure Exams, <br />
          <span className="text-primary">Powered by AI</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mb-8 pointer-events-auto">
          The premier AI-driven examination platform for Philippine
          Universities. Live proctoring, automated grading, and seamless
          integrity.
        </p>
        <div className="flex gap-4 pointer-events-auto">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </div>

      {/* Fixed Dashboard Card */}
      <div
        style={{
          position: "absolute",
          top: "80%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "94%",
          height: "60%",
          backgroundColor: "var(--background)",
          borderRadius: "20px",
          border: "2px solid var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 6,
          boxShadow: "0 0 40px rgba(55, 42, 172, 0.3)",
          overflow: "hidden",
        }}
      >
        <Image
          src="/sample-dashboard.jpg"
          alt="Sample Dashboard"
          width={1200}
          height={800}
          className="rounded-[20px] absolute top-0 object-cover w-full h-full"
          priority
        />
      </div>

      {/* Reveal Effect (Now points to dashboard image) */}
      <Image
        ref={revealImgRef}
        src="/sample-dashboard.jpg"
        alt="Reveal effect"
        width={1200}
        height={800}
        style={
          {
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0",
            left: "0",
            zIndex: 5,
            mixBlendMode: "lighten",
            opacity: 0.4,
            pointerEvents: "none",
            objectFit: "cover",
            "--mx": "-9999px",
            "--my": "-9999px",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
            maskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          } as React.CSSProperties
        }
      />
    </div>
  );
}
