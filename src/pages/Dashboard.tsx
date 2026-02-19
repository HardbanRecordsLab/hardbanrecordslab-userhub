import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCardSkeleton, CardSkeleton } from "@/components/ui/skeleton";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { 
  Music, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  Users, 
  LogOut,
  Menu,
  X,
  DollarSign,
  Lightbulb,
  Wand2,
  Mail,
  Calendar,
  Image,
  FileText,
  LayoutDashboard,
  Disc3,
  Megaphone,
  Brain,
  BadgeDollarSign,
  Palette,
  BarChart3,
  ScrollText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import logoColor from "@/assets/logo-color.png";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [stats, setStats] = useState({
    releases: 0,
    publications: 0,
    campaigns: 0,
    revenue: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadProfile(), loadStats()]);
    setLoading(false);
    
    const onboardingCompleted = localStorage.getItem(`onboarding_${user?.id}`);
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  };

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) setProfile(data);
  };

  const loadStats = async () => {
    if (!user) return;
    const { count: releasesCount } = await supabase
      .from("music_releases")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    const { count: publicationsCount } = await supabase
      .from("digital_publications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    const { count: campaignsCount } = await supabase
      .from("marketing_campaigns")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    setStats({
      releases: releasesCount || 0,
      publications: publicationsCount || 0,
      campaigns: campaignsCount || 0,
      revenue: 0,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const modules = [
    { title: "Generator Strategii", icon: Lightbulb, link: "/dashboard/strategy-generator", stats: "Strategia AI", description: "Twórz strategie marketingowe" },
    { title: "Generator Treści", icon: Wand2, link: "/dashboard/content-generator", stats: "Treści AI", description: "Generuj teksty i grafiki" },
    { title: "Kontakty PR", icon: Mail, link: "/dashboard/contacts", stats: "Baza kontaktów", description: "PR i influencerzy" },
    { title: "Dystrybucja Muzyki", icon: Disc3, link: "/dashboard/music", stats: `${stats.releases} wydań`, description: "Zarządzaj i publikuj swoją muzykę" },
    { title: "Kalendarz Publikacji", icon: Calendar, link: "/dashboard/calendar", stats: "Planowanie", description: "Zaplanuj publikacje na wszystkich kanałach" },
    { title: "Dashboard Analityczny", icon: BarChart3, link: "/dashboard/analytics", stats: "Analytics", description: "KPI i raporty" },
    { title: "Śledzenie Przychodów", icon: BadgeDollarSign, link: "/dashboard/revenue", stats: "Finanse", description: "Przychody i prognozowanie" },
    { title: "Assety Brandowe", icon: Palette, link: "/dashboard/brand-assets", stats: "Media", description: "Logo, grafiki, materiały" },
    { title: "Marketing AI", icon: Megaphone, link: "/dashboard/marketing", stats: `${stats.campaigns} kampanii`, description: "Kampanie i promocja" },
    { title: "AI Studio", icon: Brain, link: "/dashboard/ai-studio", stats: "Generuj treści", description: "Twórz z pomocą AI" },
    { title: "Prometheus AI", icon: Sparkles, link: "/prometheus-ai", stats: "Open Source", description: "System AI - 100% darmowy" },
    { title: "Raport Aplikacji", icon: ScrollText, link: "/comprehensive-report", stats: "40+ stron", description: "Kompletny raport oceny produktu" },
  ];

  const handleOnboardingComplete = () => {
    localStorage.setItem(`onboarding_${user?.id}`, 'true');
    setShowOnboarding(false);
  };

  const statCards = [
    { label: "Wydania Muzyczne", value: stats.releases, icon: Disc3 },
    { label: "Publikacje", value: stats.publications, icon: BookOpen },
    { label: "Kampanie Aktywne", value: stats.campaigns, icon: Megaphone },
    { label: "Przychody (PLN)", value: stats.revenue.toFixed(2), icon: BadgeDollarSign },
  ];

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingWizard 
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingComplete}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 glass-dark`}>
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between px-5">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logoColor} alt="HRL" className="h-10 w-auto" />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-muted rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
            {modules.map((module) => (
              <Link
                key={module.title}
                to={module.link}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 group"
              >
                <module.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="truncate">{module.title}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="mb-3">
              <p className="text-xs text-muted-foreground">Zalogowany jako:</p>
              <p className="text-sm font-medium truncate text-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border glass-dark px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Panel Główny</h1>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Welcome section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Witaj, <span className="gradient-text">{profile?.full_name || "Twórco"}</span>!
            </h2>
            <p className="text-muted-foreground">
              Zarządzaj swoją kreatywną karierą z jednego miejsca
            </p>
          </motion.div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
            ) : (
              statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <Card className="glass-card border-gradient card-3d">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold gradient-text">{stat.value}</span>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Module cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              modules.map((module, index) => (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (index + 1) }}
                >
                  <Link to={module.link}>
                    <Card className="glass-card border-gradient card-3d cursor-pointer group h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                            <module.icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {module.stats}
                          </span>
                        </div>
                        <CardTitle className="mt-3 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {module.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Szybkie Akcje</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="gradient" className="group animate-glow-pulse" onClick={() => navigate("/dashboard/strategy-generator")}>
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
