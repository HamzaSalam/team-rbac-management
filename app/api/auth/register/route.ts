import { generateToken, hashPassword } from "@/app/lib/auth";
import { getPrisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, teamCode } = body;

    //validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name , email , password are required or not valid" },
        { status: 400 },
      );
    }

    //check if user already exists
    const existingUser = await getPrisma().user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 },
      );
    }

    let teamId: string | undefined;

    if (teamCode) {
      const team = await getPrisma().team.findUnique({
        where: { code: teamCode },
      });
      if (!team) {
        return NextResponse.json(
          { error: "Invalid team code" },
          { status: 400 },
        );
      }
      teamId = team.id;
    }

    const hashedPassword = await hashPassword(password);

    // FIRST user become ADMIN , and other users become USER
    const userCount = await getPrisma().user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    const user = await getPrisma().user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        teamId,
        role,
      },
      include: {
        team: true,
      },
    });

    //Generate token
    const token = generateToken(user.id);

    //create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        team: user?.team,
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
    console.error("Error registering user failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
