"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { RandomAnimeButton } from "@/components/anime/random-anime-button";

const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "My Collection",
    href: "/collection",
  },
  {
    name: "Top Anime",
    href: "/top",
  },
  {
    name: "Seasonal",
    href: "/seasonal",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-foreground font-semibold"
              : "text-muted-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
      <RandomAnimeButton className="ml-2" />
    </nav>
  );
} 