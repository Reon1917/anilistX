"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface MobileNavProps {
  user: any;
  signOut: () => Promise<void>;
}

export function MobileNav({ user, signOut }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleOpen = () => setOpen(!open);
  const closeNav = () => setOpen(false);

  // Close the mobile nav when route changes
  React.useEffect(() => {
    closeNav();
  }, [pathname]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        className="p-2"
        onClick={toggleOpen}
        aria-label="Toggle Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="fixed inset-0 top-16 z-50 bg-background p-6 animate-in fade-in slide-in-from-top-5">
          <nav className="flex flex-col gap-6 text-lg font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeNav}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-2 text-muted-foreground group" onClick={closeNav}>
              <RandomAnimeButton />
              <span className="transition-colors group-hover:text-primary">Random Anime</span>
            </div>

            <div className="h-px bg-border my-2" />

            {user ? (
              <>
                <Link
                  href="/protected"
                  onClick={closeNav}
                  className="transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <form
                  action={signOut}
                  className="transition-colors hover:text-primary text-muted-foreground"
                >
                  <button type="submit" className="w-full text-left">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeNav}
                  className="transition-colors hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={closeNav}
                  className="transition-colors hover:text-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
} 