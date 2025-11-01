import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createProfile, getProfileByUserId } from "@/db/queries/users";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if profile already exists
    const existingProfile = await getProfileByUserId(userId);
    
    if (existingProfile) {
      return NextResponse.json({ profile: existingProfile, created: false });
    }

    // Create new profile
    const profile = await createProfile(userId);
    
    return NextResponse.json({ profile, created: true });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

