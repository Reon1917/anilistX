import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Film, LineChart, ListChecks, Settings, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "User Dashboard | AnilistX",
  description: "Manage your anime collection and profile settings",
};

export default async function UserDashboardPage() {
  const supabase = createClient();

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

  const { data: animeStats } = await supabase.rpc("get_user_anime_stats", {
    user_id_param: session.user.id,
  }).maybeSingle();

  const { data: recentActivity, error: activityError } = await supabase
    .from("anime_lists")
    .select("*")
    .eq("user_id", session.user.id)
    .order("updated_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="bg-card rounded-lg shadow-sm p-6 flex flex-col items-center gap-4 md:w-72">
          {profile?.avatar_url ? (
            <div className="relative h-32 w-32 rounded-full overflow-hidden">
              <Image
                src={profile.avatar_url}
                alt={profile?.username || session.user.email || "User"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
              <User className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          
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
                  className="flex items-center gap-3 text-sm py-2 font-medium text-primary"
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
                  className="flex items-center gap-3 text-sm py-2 text-muted-foreground hover:text-foreground transition-colors"
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Anime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{animeStats?.total_anime || 0}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Currently Watching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{animeStats?.watching || 0}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{animeStats?.completed || 0}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold">{animeStats?.average_score?.toFixed(1) || "-"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="recent-activity">
            <TabsList>
              <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent-activity" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity && recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((anime) => (
                        <div key={anime.id} className="flex items-center gap-4">
                          <div className="relative w-12 h-16 flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={anime.image_url || '/placeholder-anime.jpg'}
                              alt={anime.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{anime.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {
                                anime.status === 'watching' ? 'Started watching' :
                                anime.status === 'completed' ? 'Completed' :
                                anime.status === 'plan_to_watch' ? 'Added to plan to watch' :
                                anime.status === 'dropped' ? 'Dropped' :
                                'Updated status'
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(anime.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {anime.score > 0 && (
                              <>
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{anime.score}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No recent activity</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start tracking anime to see your activity here
                      </p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href="/collection">Explore Anime</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Anime Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Status Distribution</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Watching</span>
                          <span>{animeStats?.watching || 0}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full" 
                            style={{ 
                              width: `${animeStats?.total_anime ? (animeStats.watching / animeStats.total_anime) * 100 : 0}%` 
                            }} 
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Completed</span>
                          <span>{animeStats?.completed || 0}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full" 
                            style={{ 
                              width: `${animeStats?.total_anime ? (animeStats.completed / animeStats.total_anime) * 100 : 0}%` 
                            }} 
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Plan to Watch</span>
                          <span>{animeStats?.plan_to_watch || 0}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full" 
                            style={{ 
                              width: `${animeStats?.total_anime ? (animeStats.plan_to_watch / animeStats.total_anime) * 100 : 0}%` 
                            }} 
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Dropped</span>
                          <span>{animeStats?.dropped || 0}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="bg-red-500 h-full" 
                            style={{ 
                              width: `${animeStats?.total_anime ? (animeStats.dropped / animeStats.total_anime) * 100 : 0}%` 
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Score Distribution</h3>
                      <div className="space-y-1">
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => (
                          <div key={score} className="flex items-center gap-2 text-sm">
                            <span className="w-8">{score}</span>
                            <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
                              <div 
                                className={`bg-primary h-full`}
                                style={{ 
                                  width: `${animeStats?.total_anime ? ((animeStats[`score_${score}` as keyof typeof animeStats] as number || 0) / animeStats.total_anime) * 100 : 0}%` 
                                }} 
                              />
                            </div>
                            <span className="w-6 text-right">{animeStats ? animeStats[`score_${score}` as keyof typeof animeStats] || 0 : 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
