import { checkDatabaseConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { status: "error", message: "Database connection failed" },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { status: "ok", message: "Database connection successful" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
