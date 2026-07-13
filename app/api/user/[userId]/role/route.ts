import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { getPrisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const currentUser = await getCurrentUser();

    if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to update user information or assign team",
        },
        { status: 401 },
      );
    }

    //prevent user to change their own role

    if (userId === currentUser.id) {
      return NextResponse.json(
        {
          error: "You are not authorized to update your own role",
        },
        { status: 401 },
      );
    }

    const { role } = await request.json();

    //validate role

    const validateRoles = [Role.USER, Role.MANAGER];

    if (!validateRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid role or you cannot have more than one Admin role user",
        },
        { status: 404 },
      );
    }

    //update user's team assignment
    const updatedUser = await getPrisma().user.update({
      where: { id: userId },
      data: { role },
      include: {
        team: true,
      },
    });

    // if you want to exclude the password from the response, you can destructure it out
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: `User role updated to ${role} successfully`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Role assignment error:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
