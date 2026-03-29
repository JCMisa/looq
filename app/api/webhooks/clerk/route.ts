import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, createClerkClient } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { profiles, universities } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

  if (!WEBHOOK_SECRET || !CLERK_SECRET_KEY) {
    console.error("Missing Clerk Secrets");
    return new Response("Server configuration error", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  const eventType = evt.type;
  const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, image_url, first_name, last_name } =
          evt.data;
        const primaryEmail = email_addresses?.find(
          (e) => e.id === email_addresses[0]?.id,
        )?.email_address;
        const fullName =
          `${first_name ?? ""} ${last_name ?? ""}`.trim() || "Anonymous User";

        await db
          .insert(profiles)
          .values({
            id: id,
            fullName: fullName,
            email: primaryEmail || `user-${id}@looq.edu`,
            imageUrl: image_url,
          })
          .onConflictDoUpdate({
            target: profiles.id,
            set: { fullName, imageUrl: image_url, email: primaryEmail },
          });
        break;
      }

      case "organization.created": {
        const { id, name, slug, created_by } = evt.data;
        if (!created_by) break;

        // Generate a clean 6-character alphanumeric join code
        const generatedJoinCode = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

        const [newUni] = await db
          .insert(universities)
          .values({
            name: name,
            slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            clerkOrgId: id,
            joinCode: generatedJoinCode,
          })
          .returning();

        await db
          .update(profiles)
          .set({ universityId: newUni.id, role: "ORG_ADMIN" })
          .where(eq(profiles.id, created_by));

        await clerk.users.updateUserMetadata(created_by, {
          publicMetadata: { university_id: newUni.id, role: "ORG_ADMIN" },
        });
        break;
      }

      case "organizationMembership.created": {
        const { organization, public_user_data } = evt.data;
        const userId = public_user_data.user_id;

        const [uni] = await db
          .select()
          .from(universities)
          .where(eq(universities.clerkOrgId, organization.id))
          .limit(1);

        if (uni) {
          await db
            .update(profiles)
            .set({ universityId: uni.id, role: "TEACHER" })
            .where(eq(profiles.id, userId));

          await clerk.users.updateUserMetadata(userId, {
            publicMetadata: { university_id: uni.id, role: "TEACHER" },
          });
        }
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;
        await db.delete(profiles).where(eq(profiles.id, id as string));
        break;
      }
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response("Database error", { status: 500 });
  }
}
