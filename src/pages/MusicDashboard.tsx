import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Music, 
  Plus, 
  Upload, 
  Calendar,
  Globe,
  DollarSign,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

export default function MusicDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [releases, setReleases] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist_name: "",
    album_type: "single",
    release_date: "",
    description: "",
    genre: "",
  });

  useEffect(() => {
    if (user) {
      loadReleases();
    }
  }, [user]);

  const loadReleases = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("music_releases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setReleases(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("music_releases")
        .insert({
          ...formData,
          user_id: user?.id,
          genre: formData.genre.split(",").map(g => g.trim()),
          status: "draft",
        });

      if (error) throw error;

      toast({
        title: "Sukces!",
        description: "Wydanie zostało dodane pomyślnie",
      });

      setShowForm(false);
      setFormData({
        title: "",
        artist_name: "",
        album_type: "single",
        release_date: "",
        description: "",
        genre: "",
      });
      loadReleases();
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił błąd podczas dodawania wydania",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dystrybucja Muzyki</h1>
              <p className="text-muted-foreground">
                Zarządzaj swoimi wydaniami i publikuj na 200+ platformach
              </p>
            </div>
            <Button
              variant="gradient"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nowe Wydanie
            </Button>
          </div>
        </motion.div>

        {/* Add Release Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="glass-dark border-white/10">
              <CardHeader>
                <CardTitle>Dodaj Nowe Wydanie</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tytuł wydania</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="artist">Nazwa artysty</Label>
                      <Input
                        id="artist"
                        value={formData.artist_name}
                        onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Typ wydania</Label>
                      <Select
                        value={formData.album_type}
                        onValueChange={(value) => setFormData({ ...formData, album_type: value })}
                        disabled={loading}
                      >
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Singiel</SelectItem>
                          <SelectItem value="ep">EP</SelectItem>
                          <SelectItem value="album">Album</SelectItem>
                          <SelectItem value="compilation">Kompilacja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Data wydania</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.release_date}
                        onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genre">Gatunki (oddzielone przecinkami)</Label>
                    <Input
                      id="genre"
                      placeholder="np. Pop, Rock, Electronic"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Opis</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      disabled={loading}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" variant="gradient" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Dodawanie...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Dodaj Wydanie
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      disabled={loading}
                    >
                      Anuluj
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Releases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {releases.map((release, index) => (
            <motion.div
              key={release.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-dark border-white/10 hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Music className="h-8 w-8 text-primary" />
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      release.status === 'published' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {release.status === 'published' ? 'Opublikowane' : 'Szkic'}
                    </span>
                  </div>
                  <CardTitle>{release.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {release.artist_name}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{release.release_date || 'Brak daty'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{release.album_type}</span>
                    </div>
                    {release.genre && release.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {release.genre.map((g: string) => (
                          <span key={g} className="px-2 py-1 rounded-full bg-primary/20 text-xs">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edytuj
                    </Button>
                    <Button variant="gradient" size="sm" className="flex-1">
                      Publikuj
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {releases.length === 0 && !showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Brak wydań</h3>
              <p className="text-muted-foreground mb-4">
                Zacznij dodając swoje pierwsze wydanie muzyczne
              </p>
              <Button variant="gradient" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Dodaj Pierwsze Wydanie
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}