import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Music, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  Users, 
  LogOut,
  Menu,
  X,
  Plus,
  DollarSign,
  PlayCircle,
  Lightbulb,
  Wand2,
  Mail,
  Calendar,
  Image,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    releases: 0,
    publications: 0,
    campaigns: 0,
    revenue: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) setProfile(data);
  };

  const loadStats = async () => {
    if (!user) return;

    // Load music releases count
    const { count: releasesCount } = await supabase
      .from("music_releases")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Load publications count
    const { count: publicationsCount } = await supabase
      .from("digital_publications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Load campaigns count
    const { count: campaignsCount } = await supabase
      .from("marketing_campaigns")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    setStats({
      releases: releasesCount || 0,
      publications: publicationsCount || 0,
      campaigns: campaignsCount || 0,
      revenue: 0, // This would be calculated from actual revenue data
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const modules = [
    {
      title: "Generator Strategii",
      icon: Lightbulb,
      color: "primary",
      link: "/dashboard/strategy-generator",
      stats: "Strategia AI",
      description: "Twórz strategie marketingowe"
    },
    {
      title: "Generator Treści",
      icon: Wand2,
      color: "secondary",
      link: "/dashboard/content-generator",
      stats: "Treści AI",
      description: "Generuj teksty i grafiki"
    },
    {
      title: "Kontakty PR",
      icon: Mail,
      color: "accent",
      link: "/dashboard/contacts",
      stats: "Baza kontaktów",
      description: "PR i influencerzy"
    },
    {
      title: "Dystrybucja Muzyki",
      icon: Music,
      color: "primary",
      link: "/dashboard/music",
      stats: `${stats.releases} wydań`,
      description: "Zarządzaj i publikuj swoją muzykę"
    },
    {
      title: "Kalendarz Publikacji",
      icon: Calendar,
      color: "secondary",
      link: "/dashboard/calendar",
      stats: "Planowanie",
      description: "Zaplanuj publikacje na wszystkich kanałach"
    },
    {
      title: "Dashboard Analityczny",
      icon: TrendingUp,
      color: "primary",
      link: "/dashboard/analytics",
      stats: "Analytics",
      description: "KPI i raporty"
    },
    {
      title: "Śledzenie Przychodów",
      icon: DollarSign,
      color: "accent",
      link: "/dashboard/revenue",
      stats: "Finanse",
      description: "Przychody i prognozowanie"
    },
    {
      title: "Assety Brandowe",
      icon: Image,
      color: "secondary",
      link: "/dashboard/brand-assets",
      stats: "Media",
      description: "Logo, grafiki, materiały"
    },
    {
      title: "Marketing AI",
      icon: TrendingUp,
      color: "accent",
      link: "/dashboard/marketing",
      stats: `${stats.campaigns} kampanii`,
      description: "Kampanie i promocja"
    },
    {
      title: "AI Studio",
      icon: Sparkles,
      color: "primary",
      link: "/dashboard/ai-studio",
      stats: "Generuj treści",
      description: "Twórz z pomocą AI"
    },
    {
      title: "Prometheus AI",
      icon: Sparkles,
      color: "accent",
      link: "/prometheus-ai",
      stats: "Open Source",
      description: "System AI - 100% darmowy"
    },
    {
      title: "Raport Aplikacji",
      icon: FileText,
      color: "secondary",
      link: "/comprehensive-report",
      stats: "40+ stron",
      description: "Kompletny raport oceny produktu"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 glass-dark border-r border-white/10`}>
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between px-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary p-2">
                <Music className="w-full h-full text-white" />
              </div>
              <span className="font-bold">HardbanLab</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {modules.map((module) => (
              <Link
                key={module.title}
                to={module.link}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition-colors"
              >
                <module.icon className="h-5 w-5" />
                <span>{module.title}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Zalogowany jako:</p>
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-white/10 glass-dark px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Panel Główny</h1>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Welcome section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2">
              Witaj, {profile?.full_name || "Twórco"}!
            </h2>
            <p className="text-muted-foreground">
              Zarządzaj swoją kreatywną karierą z jednego miejsca
            </p>
          </motion.div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-dark border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Wydania Muzyczne
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.releases}</span>
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-dark border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Publikacje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.publications}</span>
                    <BookOpen className="h-5 w-5 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-dark border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Kampanie Aktywne
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.campaigns}</span>
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-dark border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Przychody (PLN)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {stats.revenue.toFixed(2)}
                    </span>
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Module cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Link to={module.link}>
                  <Card className="glass-dark border-white/10 hover:shadow-glow transition-all duration-300 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-lg bg-${module.color}/20 p-2.5 group-hover:scale-110 transition-transform`}>
                          <module.icon className={`w-full h-full text-${module.color}`} />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {module.stats}
                        </span>
                      </div>
                      <CardTitle className="mt-4">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {module.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <h3 className="text-xl font-semibold mb-4">Szybkie Akcje</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="gradient" className="group" onClick={() => navigate("/dashboard/strategy-generator")}>
                <Lightbulb className="mr-2 h-4 w-4" />
                Nowa Strategia
              </Button>
              <Button variant="glow" onClick={() => navigate("/dashboard/content-generator")}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generuj Treść
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard/contacts")}>
                <Mail className="mr-2 h-4 w-4" />
                Dodaj Kontakt
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}