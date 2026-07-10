import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role, User } from "../types";
import { cookies } from "next/headers";
import { getPrisma } from "./db";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign(userId, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return null;
    }

    const decode = verifyToken(token);

    const userFromdb = await getPrisma().user.findUnique({
      where: { id: decode.userId },
    });
    if (!userFromdb) {
      return null;
    }

    const { password, ...user } = userFromdb;
    return user as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export function checkUserPermission(user: User, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.GUEST]: 0,
    [Role.USER]: 1,
    [Role.MANAGER]: 2,
    [Role.ADMIN]: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}
