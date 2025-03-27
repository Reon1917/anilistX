import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { MainNav } from "./main-nav";

export async function HeaderAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl hidden sm:inline-block">AnilistX</span>
        </Link>
        <MainNav />
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/protected">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        <MobileNav user={user} signOut={signOut} />
      </div>
    </div>
  );
} 