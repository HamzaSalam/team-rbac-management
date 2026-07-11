import { getCurrentUser } from "@/app/lib/auth";
import { getPrisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Your are not authorized to access this user information" },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const teamId = searchParams.get("teamId");
    const role = searchParams.get("role");

    //Build where clause based on usr role

    const where: Prisma.UserWhereInput = {};

    if (user.role === Role.ADMIN) {
      // Admin can view all users
    } else if (user.role === Role.MANAGER) {
      // Manager can view users in their team or cross team user but not cross team managers
      where.OR = [{ teamId: user.teamId }, { role: Role.USER }];
    } else {
      //Regular users can only see in thier team
      where.teamId = user.teamId;
      where.role = { not: Role.ADMIN };
    }

    //Additional filters
    if (teamId) {
      where.teamId = teamId;
    }
    if (role) {
      where.role = role as Role;
    }

    const users = await getPrisma().user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
