"use server";

import { auth, createClerkClient } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { profiles, universities } from "@/config/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const secretKey = process.env.CLERK_SECRET_KEY;
if (!secretKey) {
  throw new Error("Missing CLERK_SECRET_KEY in environment variables");
}

export async function joinUniversityAction(joinCode: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    // 1. Find university by code
    const [university] = await db
      .select()
      .from(universities)
      .where(eq(universities.joinCode, joinCode.trim().toUpperCase()))
      .limit(1);

    if (!university) {
      return {
        success: false,
        message: "Invalid join code. Please try again.",
      };
    }

    // 2. Link Student in DB
    await db
      .update(profiles)
      .set({
        universityId: university.id,
        role: "STUDENT",
      })
      .where(eq(profiles.id, userId));

    // 3. Update Clerk Session Metadata
    const clerk = createClerkClient({ secretKey });
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        university_id: university.id,
        role: "STUDENT",
      },
    });

    // 4. Force refresh to trigger Middleware redirect to dashboard
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Join Action Error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
