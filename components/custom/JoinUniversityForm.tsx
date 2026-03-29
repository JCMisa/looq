"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { joinUniversityAction } from "@/lib/actions/onboarding";

export function JoinUniversityForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    const result = await joinUniversityAction(code);

    if (result.success) {
      toast.success("Successfully joined the university!");
      window.location.href = "/dashboard";
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Example: PUP-2026"
        value={code}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCode(e.target.value.toUpperCase())
        }
        className="text-center text-2xl tracking-widest font-mono uppercase h-14"
      />
      <Button
        onClick={handleJoin}
        className="w-full h-12 text-lg"
        disabled={loading || code.length < 3}
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2" />
        ) : (
          "Verify and Join"
        )}
      </Button>
    </div>
  );
}
