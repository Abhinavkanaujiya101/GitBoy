import { NextRequest, NextResponse } from "next/server";
import { getUserAnalytics, GitHubApiError } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username || username.trim() === "") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const data = await getUserAnalytics(username);
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json(
        {
          error: error.message,
          status: error.status,
          resetTime: error.resetTime,
        },
        { status: error.status }
      );
    }

    console.error("Error in profile API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching GitHub profile" },
      { status: 500 }
    );
  }
}
