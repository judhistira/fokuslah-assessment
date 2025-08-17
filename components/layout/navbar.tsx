"use client";

import { motion } from "framer-motion";
import { Home, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCurrentAccount } from "@/features/accounts";

import { cn } from "@/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/profile", icon: User, label: "Profile" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { data: user } = useCurrentAccount();

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden items-center justify-between border-b px-6 py-4 md:flex">
        <div className="flex items-center space-x-10">
          <Link href="/" className="text-2xl font-bold text-violet-500">
            Fokuslah
          </Link>
          <div className="flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors",
                    isActive
                      ? "bg-violet-100 text-violet-700"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <Link href="/profile" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 font-bold text-white">
                {user.user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="font-medium">{user.user?.username}</span>
            </Link>
          ) : (
            <Link
              href="/auth/sign-in"
              className="rounded-lg bg-violet-500 px-4 py-2 text-white transition-colors hover:bg-violet-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white md:hidden">
        <div className="grid grid-cols-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center px-1 py-3",
                  isActive ? "text-violet-500" : "text-gray-500",
                )}
              >
                {isActive ? (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-lg"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                ) : null}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon size={24} />
                  <span className="mt-1 text-xs">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
