import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Eye, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalViews: 0,
    totalEngagements: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    // Load revenue
    const { data: revenueData } = await supabase
      .from("revenue_transactions")
      .select("amount")
      .eq("user_id", user.id);

    const totalRevenue = revenueData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // Load analytics events
    const { data: eventsData } = await supabase
      .from("analytics_events")
      .select("*")
      .eq("user_id", user.id);

    const totalViews = eventsData?.filter(e => e.event_type === 'view').length || 0;
    const totalEngagements = eventsData?.filter(e => e.event_type === 'engagement').length || 0;

    // Count active projects
    const { count: musicCount } = await supabase
      .from("music_releases")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "published");

    const { count: contentCount } = await supabase
      .from("content_library")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "published");

    const activeProjects = (musicCount || 0) + (contentCount || 0);

    setStats({
      totalRevenue,
      totalViews,
      totalEngagements,
      activeProjects,
    });
  };

  const statCards = [
    {
      title: "Całkowity przychód",
      value: stats.totalRevenue,
      prefix: "$",
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Wyświetlenia",
      value: stats.totalViews,
      icon: Eye,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Zaangażowanie",
      value: stats.totalEngagements,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Aktywne projekty",
      value: stats.activeProjects,
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Dashboard Analityczny" description="Analizuj wydajność i monitoruj kluczowe wskaźniki (KPI)" />
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do panelu
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Analityczny</h1>
            <p className="text-muted-foreground">
              Śledź wyniki i KPI wszystkich projektów
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-dark border-white/10 hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">
                    {stat.prefix}
                    <CountUp end={stat.value} duration={2} separator="," decimals={stat.prefix ? 2 : 0} />
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-dark border-white/10">
              <CardHeader>
                <CardTitle>Ostatnia aktywność</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                    <div>
                      <p className="font-medium">Nowe wydanie muzyczne</p>
                      <p className="text-sm text-muted-foreground">2 dni temu</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                    <div>
                      <p className="font-medium">Kampania marketingowa uruchomiona</p>
                      <p className="text-sm text-muted-foreground">5 dni temu</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-dark border-white/10">
              <CardHeader>
                <CardTitle>Top Platformy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Spotify</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-glow w-[75%]" />
                      </div>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Apple Music</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-glow w-[60%]" />
                      </div>
                      <span className="text-sm font-medium">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">YouTube</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-glow w-[45%]" />
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
