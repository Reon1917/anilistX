import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LineChart, ListChecks, Settings, User } from "lucide-react";
import Link from "next/link";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Profile Settings | AnilistX",
  description: "Update your profile and account settings",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="bg-card rounded-lg shadow-sm p-6 flex flex-col items-center gap-4 md:w-72">
        <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
          <User className="h-16 w-16 text-muted-foreground" />
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold">{profile?.username || "User"}</h2>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        
        <div className="w-full border-t border-border my-2"></div>
        
        <nav className="w-full">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/protected" 
                className="flex items-center gap-3 text-sm py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <LineChart className="h-4 w-4" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/collection" 
                className="flex items-center gap-3 text-sm py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ListChecks className="h-4 w-4" />
                Collection
              </Link>
            </li>
            <li>
              <Link 
                href="/protected/settings" 
                className="flex items-center gap-3 text-sm py-2 font-medium text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="w-full pt-4">
          <form action="/auth/sign-out" method="post">
            <Button variant="outline" className="w-full" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
      
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        
        <ProfileSettingsForm initialData={profile} userId={session.user.id} />
      </div>
    </div>
  );
} 