import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Music, Plus, Calendar, Globe, ArrowLeft, 
  Send, Clock, CheckCircle2, XCircle, Eye,
  BarChart3, DollarSign, Disc3
} from "lucide-react";
import { motion } from "framer-motion";
import { ReleaseWizard } from "@/components/music/ReleaseWizard";

export default function MusicDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [releases, setReleases] = useState<any[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  useEffect(() => {
    if (user) loadReleases();
  }, [user]);

  const loadReleases = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("music_releases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setReleases(data);
  };

  const submitForReview = async (releaseId: string) => {
    try {
      const { error } = await supabase
        .from("music_releases")
        .update({ status: "submitted", submitted_at: new Date().toISOString() })
        .eq('id', releaseId);
      if (error) throw error;
      toast({ title: "Wysłano do weryfikacji!", description: "Czas moderacji: do 12 dni roboczych." });
      loadReleases();
      setShowSubmitDialog(false);
    } catch (error: any) {
      toast({ title: "Błąd", description: error.message, variant: "destructive" });
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any; color: string }> = {
      draft: { label: "Szkic", variant: "outline", icon: Clock, color: "text-muted-foreground" },
      submitted: { label: "Wysłano", variant: "secondary", icon: Send, color: "text-blue-400" },
      under_review: { label: "W moderacji", variant: "default", icon: Eye, color: "text-yellow-400" },
      approved: { label: "Zatwierdzono", variant: "default", icon: CheckCircle2, color: "text-green-400" },
      published: { label: "Na platformach", variant: "default", icon: Globe, color: "text-green-500" },
      rejected: { label: "Odrzucono", variant: "destructive", icon: XCircle, color: "text-destructive" },
    };
    return config[status] || config.draft;
  };

  const getMetadata = (release: any) => {
    const meta = release.metadata || {};
    return {
      stores: meta.distribution?.stores?.length || 0,
      territories: meta.distribution?.territories || [],
      tracks: meta.tracks?.length || 1,
      label: meta.label_name || 'HardbanRecords Lab',
      language: meta.language || '—',
    };
  };

  // Stats
  const totalReleases = releases.length;
  const publishedCount = releases.filter(r => r.status === 'published').length;
  const pendingCount = releases.filter(r => ['submitted', 'under_review'].includes(r.status)).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Powrót do panelu
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <Disc3 className="inline mr-3 h-8 w-8 text-primary" />
                Dystrybucja Muzyki
              </h1>
              <p className="text-muted-foreground">
                Publikuj muzykę na 38+ platformach streamingowych przez HardbanRecords Lab
              </p>
            </div>
            {!showWizard && (
              <Button variant="gradient" onClick={() => setShowWizard(true)}>
                <Plus className="mr-2 h-4 w-4" /> Nowe Wydanie
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        {!showWizard && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Wszystkie wydania', value: totalReleases, icon: Music, color: 'text-primary' },
              { label: 'Na platformach', value: publishedCount, icon: Globe, color: 'text-green-400' },
              { label: 'W moderacji', value: pendingCount, icon: Clock, color: 'text-yellow-400' },
              { label: 'Model', value: 'Free 85%', icon: DollarSign, color: 'text-primary' },
            ].map((stat, i) => (
              <Card key={i} className="glass-dark border-white/10">
                <CardContent className="p-4 flex items-center gap-3">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Wizard */}
        {showWizard && (
          <div className="mb-8">
            <ReleaseWizard 
              onClose={() => setShowWizard(false)} 
              onComplete={() => { setShowWizard(false); loadReleases(); }} 
            />
          </div>
        )}

        {/* Process Info */}
        {!showWizard && releases.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border">
            <h3 className="text-sm font-semibold mb-2">📋 Proces dystrybucji</h3>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Szkic</span>
              <span>→</span>
              <span className="flex items-center gap-1"><Send className="h-3 w-3" /> Wysłano</span>
              <span>→</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Moderacja (do 12 dni)</span>
              <span>→</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Zatwierdzone</span>
              <span>→</span>
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> W sklepach (7-14 dni)</span>
            </div>
          </div>
        )}

        {/* Releases Grid */}
        {!showWizard && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releases.map((release, index) => {
              const statusCfg = getStatusConfig(release.status);
              const meta = getMetadata(release);
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-dark border-white/10 hover:shadow-glow transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-5 w-5 ${statusCfg.color}`} />
                          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                        </div>
                        {release.cover_file_url && (
                          <div className="w-10 h-10 rounded-md overflow-hidden">
                            <img src={release.cover_file_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg">{release.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{release.artist_name}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Data wydania
                          </span>
                          <span>{release.release_date || 'Nie ustawiona'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Music className="h-3 w-3" /> Typ
                          </span>
                          <span className="capitalize">{release.album_type || 'single'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3" /> Sklepy
                          </span>
                          <span>{meta.stores > 0 ? `${meta.stores} platform` : 'Wszystkie'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" /> Utwory
                          </span>
                          <span>{meta.tracks}</span>
                        </div>
                        {release.genre && release.genre.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {release.genre.map((g: string) => (
                              <span key={g} className="px-2 py-0.5 rounded-full bg-primary/20 text-xs">{g}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {release.admin_notes && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs font-semibold mb-1">Notatki od zespołu:</p>
                          <p className="text-xs text-muted-foreground">{release.admin_notes}</p>
                        </div>
                      )}

                      <div className="mt-4 space-y-2">
                        {release.status === 'draft' && release.audio_file_url && release.cover_file_url && (
                          <Button 
                            variant="gradient" size="sm" className="w-full"
                            onClick={() => { setSelectedRelease(release); setShowSubmitDialog(true); }}
                          >
                            <Send className="mr-2 h-4 w-4" /> Wyślij do Dystrybucji
                          </Button>
                        )}
                        
                        {release.status === 'draft' && (!release.audio_file_url || !release.cover_file_url) && (
                          <div className="text-xs text-muted-foreground text-center py-2">
                            Dodaj audio i okładkę aby wysłać do dystrybucji
                          </div>
                        )}

                        {['submitted', 'under_review'].includes(release.status) && (
                          <div className="text-xs text-center py-2 text-blue-400">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Wydanie w trakcie moderacji — do 12 dni roboczych
                          </div>
                        )}

                        {release.status === 'approved' && (
                          <div className="text-xs text-center py-2 text-green-400">
                            <CheckCircle2 className="h-3 w-3 inline mr-1" />
                            Zatwierdzone! Pojawi się w sklepach w ciągu 7-14 dni.
                          </div>
                        )}

                        {release.status === 'published' && (
                          <div className="text-xs text-center py-2 text-green-500">
                            <Globe className="h-3 w-3 inline mr-1" />
                            Dostępne na platformach streamingowych!
                          </div>
                        )}

                        {release.status === 'rejected' && (
                          <div className="text-xs text-center py-2 text-destructive">
                            <XCircle className="h-3 w-3 inline mr-1" />
                            Odrzucono — sprawdź notatki od zespołu
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {releases.length === 0 && !showWizard && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-16">
                <Disc3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Zacznij dystrybucję muzyki</h3>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                  Stwórz wydanie w 4 krokach: szczegóły albumu, audio, okładka, wybór sklepów.
                  Kompletny proces dystrybucji pod marką HardbanRecords Lab.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Free: 85% tantiem • 38+ platform • Nielimitowane wydania
                </p>
                <Button variant="gradient" size="lg" onClick={() => setShowWizard(true)}>
                  <Plus className="mr-2 h-5 w-5" /> Stwórz Pierwsze Wydanie
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Submit Dialog */}
        {showSubmitDialog && selectedRelease && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-lg max-w-lg w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Wyślij do Dystrybucji</h2>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold">{selectedRelease.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedRelease.artist_name}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /><span>Audio przesłane</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /><span>Okładka przesłana</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /><span>Metadane wypełnione</span></div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-2">
                    <p><strong>Co dalej:</strong></p>
                    <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
                      <li>Moderacja (do 12 dni roboczych)</li>
                      <li>Po zatwierdzeniu — wysyłka do sklepów</li>
                      <li>Pojawienie się na platformach (7-14 dni od zatwierdzenia)</li>
                      <li>Statystyki dostępne 45 dni po zakończeniu miesiąca</li>
                      <li>Wypłaty przy minimum $50 na koncie</li>
                    </ol>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowSubmitDialog(false)}>Anuluj</Button>
                  <Button variant="gradient" className="flex-1" onClick={() => submitForReview(selectedRelease.id)}>
                    <Send className="mr-2 h-4 w-4" /> Wyślij do Dystrybucji
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
