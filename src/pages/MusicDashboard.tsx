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
import { Badge } from "@/components/ui/badge";
import { 
  Music, 
  Plus, 
  Upload, 
  Calendar,
  Globe,
  Loader2,
  ArrowLeft,
  Download,
  CheckSquare,
  FileAudio,
  Image as ImageIcon,
  Send
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  validateFileForUpload, 
  generateSafeFilename,
  MUSIC_AUDIO_ALLOWED_TYPES,
  MUSIC_COVER_ALLOWED_TYPES,
  MAX_FILE_SIZES 
} from "@/lib/fileValidation";

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
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

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

  const uploadFile = async (file: File, folder: string, releaseId: string) => {
    // Generate safe filename
    const safeFilename = generateSafeFilename(file.name);
    const fileName = `${releaseId}/${folder}/${safeFilename}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('music-releases')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('music-releases')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate audio file if provided
      if (audioFile) {
        const audioValidation = await validateFileForUpload(
          audioFile,
          MUSIC_AUDIO_ALLOWED_TYPES,
          MAX_FILE_SIZES.musicAudio
        );
        if (!audioValidation.valid) {
          throw new Error(`Plik audio: ${audioValidation.error}`);
        }
      }

      // Validate cover file if provided
      if (coverFile) {
        const coverValidation = await validateFileForUpload(
          coverFile,
          MUSIC_COVER_ALLOWED_TYPES,
          MAX_FILE_SIZES.musicCover
        );
        if (!coverValidation.valid) {
          throw new Error(`Okładka: ${coverValidation.error}`);
        }
      }

      // First create the release
      const { data: release, error: insertError } = await supabase
        .from("music_releases")
        .insert({
          ...formData,
          user_id: user?.id,
          genre: formData.genre.split(",").map(g => g.trim()),
          status: "draft",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Upload files if provided
      let audioUrl = null;
      let coverUrl = null;

      if (audioFile) {
        setUploadProgress(25);
        audioUrl = await uploadFile(audioFile, 'audio', release.id);
      }

      if (coverFile) {
        setUploadProgress(50);
        coverUrl = await uploadFile(coverFile, 'cover', release.id);
      }

      // Update release with file URLs
      if (audioUrl || coverUrl) {
        const { error: updateError } = await supabase
          .from("music_releases")
          .update({
            audio_file_url: audioUrl,
            cover_file_url: coverUrl,
          })
          .eq('id', release.id);

        if (updateError) throw updateError;
      }

      setUploadProgress(100);

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
      setAudioFile(null);
      setCoverFile(null);
      setUploadProgress(0);
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

  const submitForReview = async (releaseId: string) => {
    try {
      const { error } = await supabase
        .from("music_releases")
        .update({
          status: "submitted",
          submitted_at: new Date().toISOString(),
        })
        .eq('id', releaseId);

      if (error) throw error;

      toast({
        title: "Wysłano do weryfikacji!",
        description: "Twoje wydanie zostało przesłane do weryfikacji przez HardbanRecords Lab",
      });

      loadReleases();
      setShowSubmitDialog(false);
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił błąd podczas wysyłania",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { label: "Szkic", variant: "outline" },
      submitted: { label: "Wysłano", variant: "secondary" },
      under_review: { label: "W weryfikacji", variant: "default" },
      approved: { label: "Zatwierdzono", variant: "default" },
      published: { label: "Opublikowano", variant: "default" },
      rejected: { label: "Odrzucono", variant: "destructive" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const exportToRouteNote = (release: any) => {
    // Przygotowanie danych w formacie CSV dla HardbanRecords Lab
    const metadata = {
      "Release Title": release.title,
      "Artist Name": release.artist_name,
      "Release Type": release.album_type,
      "Release Date": release.release_date || "",
      "Primary Genre": release.genre?.[0] || "",
      "Secondary Genre": release.genre?.[1] || "",
      "Description": release.description || "",
      "UPC": release.upc_code || "TO BE ASSIGNED",
      "Label": "Independent",
      "Copyright Year": new Date().getFullYear(),
      "Copyright Holder": release.artist_name,
    };

    // Konwersja do CSV
    const headers = Object.keys(metadata).join(",");
    const values = Object.values(metadata).map(v => `"${v}"`).join(",");
    const csv = `${headers}\n${values}`;

    // Download CSV
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hardbanrecords_${release.title.replace(/[^a-z0-9]/gi, '_')}.csv`;
    a.click();

    toast({
      title: "Metadata wyeksportowana!",
      description: "Plik CSV gotowy dla HardbanRecords Lab",
    });
  };

  const prepareForSubmit = (release: any) => {
    setSelectedRelease(release);
    setShowSubmitDialog(true);
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
                Zarządzaj swoimi wydaniami i publikuj na 38+ platformach via RouteNote
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="audio">Plik Audio (opcjonalnie)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="audio"
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                          disabled={loading}
                          className="cursor-pointer"
                        />
                        {audioFile && <FileAudio className="h-5 w-5 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        WAV, MP3, FLAC (max 100MB)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cover">Okładka (opcjonalnie)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="cover"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                          disabled={loading}
                          className="cursor-pointer"
                        />
                        {coverFile && <ImageIcon className="h-5 w-5 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG (3000x3000px zalecane)
                      </p>
                    </div>
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Przesyłanie...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

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
                    {getStatusBadge(release.status)}
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
                  {release.admin_notes && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-semibold mb-1">Notatki od zespołu:</p>
                      <p className="text-xs text-muted-foreground">{release.admin_notes}</p>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    {release.status === 'draft' && release.audio_file_url && release.cover_file_url && (
                      <Button 
                        variant="gradient" 
                        size="sm" 
                        className="w-full"
                        onClick={() => prepareForSubmit(release)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Wyślij do Weryfikacji
                      </Button>
                    )}
                    
                    {release.status === 'draft' && (!release.audio_file_url || !release.cover_file_url) && (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        Dodaj plik audio i okładkę aby móc wysłać do weryfikacji
                      </div>
                    )}

                    {(release.status === 'submitted' || release.status === 'under_review') && (
                      <div className="text-xs text-center py-2 text-primary">
                        Wydanie jest weryfikowane przez zespół HardbanRecords Lab
                      </div>
                    )}

                    {release.status === 'approved' && (
                      <div className="text-xs text-center py-2 text-green-400">
                        Wydanie zatwierdzone! Wkrótce zostanie przesłane do dystrybucji.
                      </div>
                    )}

                    {release.status === 'published' && (
                      <div className="text-xs text-center py-2 text-green-400">
                        Wydanie jest dostępne na platformach streamingowych!
                      </div>
                    )}
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

        {/* Submit Dialog */}
        {showSubmitDialog && selectedRelease && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-lg max-w-lg w-full"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Wyślij do Weryfikacji</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold mb-2">{selectedRelease.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedRelease.artist_name}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Gotowe materiały:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-green-400" />
                        <span>Plik audio przesłany</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-green-400" />
                        <span>Okładka przesłana</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-green-400" />
                        <span>Metadata wypełniona</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      Po wysłaniu, zespół HardbanRecords Lab zweryfikuje Twoje wydanie i skontaktuje się z Tobą w sprawie dalszych kroków. 
                      Proces weryfikacji zazwyczaj trwa 1-2 dni robocze.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowSubmitDialog(false)}
                  >
                    Anuluj
                  </Button>
                  <Button 
                    variant="gradient" 
                    className="flex-1"
                    onClick={() => submitForReview(selectedRelease.id)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Wyślij
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