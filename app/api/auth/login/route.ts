import { generateToken, hashPassword, verifyPassword } from "@/app/lib/auth";
import { getPrisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    //validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "email , password are required or not valid" },
        { status: 400 },
      );
    }

    //check if user already exists
    const userFromDB = await getPrisma().user.findUnique({
      where: { email },
      include: {
        team: true,
      },
    });

    if (!userFromDB) {
      return NextResponse.json(
        { error: "User not found with this email" },
        { status: 404 },
      );
    }

    const isValidPassword = await verifyPassword(password, userFromDB.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    //Generate token
    const token = generateToken(userFromDB.id);

    //create response
    const response = NextResponse.json({
      user: {
        id: userFromDB.id,
        name: userFromDB.name,
        email: userFromDB.email,
        role: userFromDB.role,
        teamId: userFromDB.teamId,
        team: userFromDB?.team,
        token,
      },
    });

    //set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
