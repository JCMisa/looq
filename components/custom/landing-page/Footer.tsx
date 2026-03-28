import Image from "next/image";
import CurrentYear from "./CurrentYear";
import { Suspense } from "react";

const footerLinks = {
  Product: ["Features", "Pricing", "Security", "Integrations"],
  Resources: ["Documentation", "API Reference", "Blog", "Changelog"],
  Company: ["About", "Careers", "Contact", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.svg" alt="Looq Logo" width={28} height={28} />
              <span className="font-heading text-lg font-bold text-foreground">
                Looq
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The premier AI-driven examination platform for Philippine
              universities.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-semibold text-foreground text-sm mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Suspense fallback={<p>Loading...</p>}>
            <CurrentYear />
          </Suspense>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Made with 🇵🇭 in the Philippines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
