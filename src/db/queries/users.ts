import { eq } from "drizzle-orm";
import { db } from "../db";
import { profiles, type NewProfile, type Profile } from "../schema";

export async function getProfileByUserId(userId: string): Promise<Profile | undefined> {
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
  return profile;
}

export async function createProfile(userId: string): Promise<Profile> {
  const [profile] = await db.insert(profiles).values({ userId }).returning();
  return profile;
}

export async function updateProfile(userId: string, data: Partial<NewProfile>): Promise<Profile | undefined> {
  const now = new Date().toISOString();
  const [profile] = await db
    .update(profiles)
    .set({ ...data, updatedAt: now })
    .where(eq(profiles.userId, userId))
    .returning();
  return profile;
}

export async function deleteProfile(userId: string): Promise<void> {
  await db.delete(profiles).where(eq(profiles.userId, userId));
}

