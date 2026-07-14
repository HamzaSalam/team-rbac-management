"use client";
import { User } from "@/app/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const pathName = usePathname();
  const navigation = [
    { name: "Home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);

  const getNavItemClass = (href: string) => {
    let isActive = false;
    if (href === "/") {
      isActive = pathName === "/";
    } else if (href === "/dashboard") {
      isActive = pathName.startsWith("/dashboard");
    }
    return `px-3 py-2 text-sm font-medium transition-colors rounded ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:text-white hover:bg-slate-800"
    }`;
  };

  return (
    <header className="bg-slate-900 border border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link className="text-xl font-bold text-white" href="/">
            Team Access Control
          </Link>
          <nav className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavItemClass(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-slate-300 text-sm">
                  Welcome, {user.name}!
                </span>
                <button className="text-slate-300 hover:text-white bg-red-500 px-3 py-2 text-sm font-medium rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg mr-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-slate-300 border border-slate-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
