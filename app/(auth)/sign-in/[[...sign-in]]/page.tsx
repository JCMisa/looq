import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { ShieldCheck, Video, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Branding Side (Features) */}
      <div className="relative hidden flex-col bg-zinc-950 p-10 text-white lg:flex order-2 lg:order-1">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        {/* Logo Section */}
        <div className="relative z-20 flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Looq Logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-xl font-bold tracking-tight font-heading">
            Looq
          </span>
        </div>

        {/* Feature Cards */}
        <div className="relative z-20 mt-auto space-y-8">
          <div className="space-y-6">
            <div className="group flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-white/5">
              <div className="mt-1 rounded-lg bg-primary/10 p-2.5">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Academic Integrity</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Advanced proctoring that tracks tab switching and focus to
                  ensure a fair testing environment for every student.
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-white/5">
              <div className="mt-1 rounded-lg bg-primary/10 p-2.5">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Live Monitoring</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Real-time video and audio feeds synced across the room,
                  allowing teachers to oversee exams with total clarity.
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-white/5">
              <div className="mt-1 rounded-lg bg-primary/10 p-2.5">
                <BrainCircuit className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-white">
                  AI-Powered Assessment
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Generate diverse question types and get automatic assessments
                  for coding, logic, and multiple-choice items.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
              Integrity in every byte.
            </p>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <div className="flex items-center justify-center p-8 bg-background order-1 lg:order-2">
          <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[450px]">
            <div className="flex flex-col space-y-2 text-center lg:hidden">
              <Image
                src="/logo.svg"
                alt="Looq Logo"
                width={48}
                height={48}
                className="mx-auto mb-2"
              />
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome Back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your university dashboard
              </p>
            </div>

            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-primary hover:bg-primary/90 text-sm normal-case shadow-sm",
                  card: "shadow-none border-none bg-transparent p-0",
                  socialButtonsBlockButton:
                    "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  dividerLine: "bg-border",
                  dividerText: "text-muted-foreground text-xs uppercase",
                  footer: "hidden",
                },
                options: {
                  logoImageUrl: "/logo.svg",
                  socialButtonsVariant: "blockButton",
                },
              }}
            />

            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
