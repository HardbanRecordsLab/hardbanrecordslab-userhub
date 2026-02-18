import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, 
  Music, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download,
  FileText,
  Globe,
  Headphones,
  Radio,
  Play,
  ArrowLeft,
  Sparkles,
  Zap,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// RouteNote supported platforms
// Pełna lista platform RouteNote (oficjalna)
const DISTRIBUTION_PLATFORMS = [
  // Streaming
  { id: "spotify", name: "Spotify", icon: "🎵", category: "streaming" },
  { id: "apple_music", name: "Apple Music", icon: "🍎", category: "streaming" },
  { id: "youtube_music", name: "YouTube Music", icon: "▶️", category: "streaming" },
  { id: "amazon_music", name: "Amazon Music", icon: "📦", category: "streaming" },
  { id: "deezer", name: "Deezer", icon: "🎧", category: "streaming" },
  { id: "tidal", name: "TIDAL", icon: "🌊", category: "streaming" },
  { id: "pandora", name: "Pandora", icon: "📻", category: "streaming" },
  { id: "soundcloud", name: "SoundCloud", icon: "☁️", category: "streaming" },
  { id: "anghami", name: "Anghami", icon: "🌍", category: "streaming" },
  { id: "boomplay", name: "Boomplay", icon: "🌍", category: "streaming" },
  { id: "jiosaavn", name: "JioSaavn", icon: "🇮🇳", category: "streaming" },
  { id: "napster", name: "Napster", icon: "🎶", category: "streaming" },
  { id: "iheartradio", name: "iHeartRadio", icon: "📻", category: "streaming" },
  { id: "melon", name: "Melon", icon: "🇰🇷", category: "streaming" },
  { id: "bugs", name: "Bugs!", icon: "🇰🇷", category: "streaming" },
  { id: "flo", name: "FLO", icon: "🇰🇷", category: "streaming" },
  { id: "genie", name: "Genie", icon: "🇰🇷", category: "streaming" },
  { id: "kkbox", name: "KKBOX", icon: "🎵", category: "streaming" },
  { id: "joox", name: "Joox", icon: "🎵", category: "streaming" },
  { id: "line_music", name: "Line Music", icon: "🇯🇵", category: "streaming" },
  { id: "awa", name: "AWA", icon: "🇯🇵", category: "streaming" },
  { id: "netease", name: "NetEase", icon: "🇨🇳", category: "streaming" },
  { id: "tencent", name: "Tencent / QQ Music", icon: "🇨🇳", category: "streaming" },
  { id: "kanjian", name: "Kanjian", icon: "🇨🇳", category: "streaming" },
  { id: "yg", name: "YG", icon: "🇰🇷", category: "streaming" },
  { id: "claro_musica", name: "Claro Música", icon: "🌎", category: "streaming" },
  { id: "kuack", name: "Kuack", icon: "🌎", category: "streaming" },
  { id: "zing_mp3", name: "Zing MP3", icon: "🇻🇳", category: "streaming" },
  { id: "nuuday", name: "Nuuday", icon: "🇩🇰", category: "streaming" },
  { id: "allsaints", name: "AllSaints", icon: "🎵", category: "streaming" },
  { id: "tuned_global", name: "Tuned Global", icon: "🌍", category: "streaming" },
  // Downloads
  { id: "itunes", name: "iTunes", icon: "🍎", category: "downloads" },
  { id: "qobuz", name: "Qobuz", icon: "🎵", category: "downloads" },
  // Content Recognition
  { id: "tiktok", name: "TikTok", icon: "🎬", category: "social" },
  { id: "capcut", name: "CapCut", icon: "✂️", category: "social" },
  { id: "instagram", name: "Instagram", icon: "📷", category: "social" },
  { id: "facebook", name: "Facebook", icon: "📘", category: "social" },
  { id: "youtube_content_id", name: "YouTube Content ID", icon: "🔒", category: "social" },
  { id: "youtube_shorts", name: "YouTube Shorts", icon: "📱", category: "social" },
];

// Internal workflow steps for RouteNote process
const WORKFLOW_STEPS = [
  { id: 1, name: "Przygotowanie metadanych", description: "Tytuł, artysta, gatunek, data wydania" },
  { id: 2, name: "Przesłanie plików", description: "Audio WAV/FLAC + okładka 3000x3000px" },
  { id: 3, name: "Walidacja techniczna", description: "Sprawdzenie jakości i formatów" },
  { id: 4, name: "Generowanie pakietu RouteNote", description: "CSV metadanych + instrukcje" },
  { id: 5, name: "Review zespołu", description: "Weryfikacja przed wysyłką" },
  { id: 6, name: "Upload do RouteNote", description: "Ręczne przesłanie do panelu" },
  { id: 7, name: "Dystrybucja na platformy", description: "2-7 dni na pojawienie się" },
];

const PrometheusDistribution = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    DISTRIBUTION_PLATFORMS.map(p => p.id)
  );
  
  // Form state for new release
  const [releaseForm, setReleaseForm] = useState({
    title: "",
    artistName: "",
    albumType: "single",
    genre: "",
    releaseDate: "",
    description: "",
    upcCode: "",
    isrcCode: ""
  });
  
  const [releases, setReleases] = useState([
    {
      id: "1",
      title: "Nowa Droga",
      artist: "Artysta X",
      status: "published",
      platforms: 18,
      releaseDate: "2025-11-01",
      streams: 45200
    },
    {
      id: "2", 
      title: "Cienie Nocy EP",
      artist: "Artysta X",
      status: "processing",
      platforms: 18,
      releaseDate: "2025-12-15",
      streams: 0
    },
    {
      id: "3",
      title: "Demo Track",
      artist: "Artysta X",
      status: "draft",
      platforms: 0,
      releaseDate: "",
      streams: 0
    }
  ]);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const generateRouteNotePackage = async (releaseId: string) => {
    const release = releases.find(r => r.id === releaseId);
    if (!release) return;

    // Generate CSV for RouteNote
    const csvContent = `Track Title,Artist Name,Album Type,Release Date,UPC,ISRC,Genre,Platforms
"${release.title}","${release.artist}","Single","${release.releaseDate}","","","Pop/Electronic","${selectedPlatforms.join(", ")}"`;

    // Generate instruction file
    const instructions = `
=== ROUTENOTE UPLOAD INSTRUCTIONS ===
Generated: ${new Date().toISOString()}

RELEASE DETAILS:
- Title: ${release.title}
- Artist: ${release.artist}
- Release Date: ${release.releaseDate}
- Platforms: ${selectedPlatforms.length} selected

STEPS TO COMPLETE:
1. Log in to RouteNote: https://routenote.com/login
2. Click "Create New Release"
3. Fill in metadata from CSV
4. Upload audio file (WAV/FLAC, 44.1kHz, 16-bit minimum)
5. Upload cover art (3000x3000px, JPG/PNG)
6. Select distribution territories
7. Review and submit

PLATFORM SELECTION:
${selectedPlatforms.map(p => `✅ ${DISTRIBUTION_PLATFORMS.find(dp => dp.id === p)?.name}`).join('\n')}

NOTE: RouteNote is 100% FREE for basic distribution.
Keep 85% of royalties (RouteNote takes 15%).
    `;

    // Download files
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const txtBlob = new Blob([instructions], { type: 'text/plain' });
    
    const csvUrl = URL.createObjectURL(csvBlob);
    const txtUrl = URL.createObjectURL(txtBlob);
    
    // Trigger downloads
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `routenote_${release.title.toLowerCase().replace(/\s/g, '_')}_metadata.csv`;
    csvLink.click();
    
    const txtLink = document.createElement('a');
    txtLink.href = txtUrl;
    txtLink.download = `routenote_${release.title.toLowerCase().replace(/\s/g, '_')}_instructions.txt`;
    txtLink.click();

    toast({
      title: "Pakiet wygenerowany",
      description: "Pobrano CSV z metadanymi i instrukcje dla RouteNote"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Opublikowane</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Przetwarzanie</Badge>;
      case "draft":
        return <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" /> Szkic</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate("/prometheus-ai")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do Prometheus OS
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dystrybucja Muzyki</h1>
              <p className="text-muted-foreground">
                Wewnętrzna automatyzacja dla RouteNote - 100% darmowa dystrybucja
              </p>
            </div>
          </div>

          {/* RouteNote Info Banner */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Globe className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Dlaczego RouteNote?</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    RouteNote oferuje <strong>100% darmową dystrybucję</strong> na wszystkie główne platformy streamingowe.
                    Zachowujesz 85% przychodów (RouteNote pobiera 15% prowizji). Brak opłat za przesyłanie ani abonamentu.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> 0 PLN za upload
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      <Headphones className="w-3 h-3 mr-1" /> 38+ platform
                    </Badge>
                    <Badge variant="outline" className="text-purple-600 border-purple-600">
                      <Zap className="w-3 h-3 mr-1" /> 85% royalties
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://routenote.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    RouteNote
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="new-release">Nowe wydanie</TabsTrigger>
            <TabsTrigger value="platforms">Platformy</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2</p>
                      <p className="text-sm text-muted-foreground">Opublikowane</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-yellow-500/10">
                      <Clock className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">W przetwarzaniu</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <Headphones className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">45.2K</p>
                      <p className="text-sm text-muted-foreground">Łącznie streamów</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Twoje wydania</h2>
              <Button onClick={() => setActiveTab("new-release")}>
                <Upload className="w-4 h-4 mr-2" />
                Nowe wydanie
              </Button>
            </div>

            <div className="grid gap-4">
              {releases.map((release, index) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Music className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{release.title}</h3>
                            <p className="text-sm text-muted-foreground">{release.artist}</p>
                            {release.releaseDate && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Data wydania: {release.releaseDate}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(release.status)}
                          {release.status === "published" && (
                            <div className="text-right">
                              <p className="text-lg font-semibold">{release.streams.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">streamów</p>
                            </div>
                          )}
                          {release.status !== "published" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => generateRouteNotePackage(release.id)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Pakiet RouteNote
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* New Release Tab */}
          <TabsContent value="new-release" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nowe wydanie muzyczne</CardTitle>
                <CardDescription>
                  Przygotuj metadane i pliki do dystrybucji przez RouteNote
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Tytuł utworu/albumu *</Label>
                      <Input 
                        id="title" 
                        placeholder="np. Nowa Droga"
                        value={releaseForm.title}
                        onChange={(e) => setReleaseForm({...releaseForm, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="artist">Nazwa artysty *</Label>
                      <Input 
                        id="artist" 
                        placeholder="np. Jan Kowalski"
                        value={releaseForm.artistName}
                        onChange={(e) => setReleaseForm({...releaseForm, artistName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="albumType">Typ wydania</Label>
                      <Select 
                        value={releaseForm.albumType}
                        onValueChange={(value) => setReleaseForm({...releaseForm, albumType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="ep">EP (2-6 utworów)</SelectItem>
                          <SelectItem value="album">Album (7+ utworów)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="genre">Gatunek</Label>
                      <Select
                        value={releaseForm.genre}
                        onValueChange={(value) => setReleaseForm({...releaseForm, genre: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz gatunek" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="hip-hop">Hip-Hop / Rap</SelectItem>
                          <SelectItem value="electronic">Electronic / EDM</SelectItem>
                          <SelectItem value="r&b">R&B / Soul</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="classical">Classical</SelectItem>
                          <SelectItem value="metal">Metal</SelectItem>
                          <SelectItem value="folk">Folk / Acoustic</SelectItem>
                          <SelectItem value="reggae">Reggae / Dancehall</SelectItem>
                          <SelectItem value="latin">Latin</SelectItem>
                          <SelectItem value="world">World Music</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="releaseDate">Data wydania</Label>
                      <Input 
                        id="releaseDate" 
                        type="date"
                        value={releaseForm.releaseDate}
                        onChange={(e) => setReleaseForm({...releaseForm, releaseDate: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum 2-3 tygodnie od dzisiaj dla nowych wydań
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="upc">Kod UPC (opcjonalnie)</Label>
                      <Input 
                        id="upc" 
                        placeholder="RouteNote wygeneruje automatycznie"
                        value={releaseForm.upcCode}
                        onChange={(e) => setReleaseForm({...releaseForm, upcCode: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="isrc">Kod ISRC (opcjonalnie)</Label>
                      <Input 
                        id="isrc" 
                        placeholder="RouteNote wygeneruje automatycznie"
                        value={releaseForm.isrcCode}
                        onChange={(e) => setReleaseForm({...releaseForm, isrcCode: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Opis (opcjonalnie)</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Krótki opis utworu lub albumu..."
                        value={releaseForm.description}
                        onChange={(e) => setReleaseForm({...releaseForm, description: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Wymagane pliki</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h4 className="font-medium mb-2">Plik audio</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          WAV lub FLAC, 44.1kHz, 16-bit minimum
                        </p>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Wybierz plik
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h4 className="font-medium mb-2">Okładka</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          JPG/PNG, 3000x3000px, max 20MB
                        </p>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Wybierz okładkę
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline">Zapisz szkic</Button>
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Przygotuj do dystrybucji
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wybierz platformy dystrybucji</CardTitle>
                <CardDescription>
                  RouteNote obsługuje ponad 38 platform streamingowych, downloadowych i social media na całym świecie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {DISTRIBUTION_PLATFORMS.map((platform) => (
                    <motion.div
                      key={platform.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all ${
                          selectedPlatforms.includes(platform.id) 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-muted-foreground/50'
                        }`}
                        onClick={() => handlePlatformToggle(platform.id)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <Checkbox 
                            checked={selectedPlatforms.includes(platform.id)}
                            onCheckedChange={() => handlePlatformToggle(platform.id)}
                          />
                          <span className="text-2xl">{platform.icon}</span>
                          <span className="font-medium text-sm">{platform.name}</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Wybrano: <strong>{selectedPlatforms.length}</strong> z {DISTRIBUTION_PLATFORMS.length} platform
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedPlatforms([])}
                    >
                      Odznacz wszystkie
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedPlatforms(DISTRIBUTION_PLATFORMS.map(p => p.id))}
                    >
                      Zaznacz wszystkie
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Proces dystrybucji - Automatyzacja wewnętrzna</CardTitle>
                <CardDescription>
                  Ponieważ RouteNote nie oferuje publicznego API, stworzyliśmy wewnętrzny workflow
                  przygotowujący wszystkie materiały do ręcznego uploadu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {WORKFLOW_STEPS.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index < 4 ? 'bg-green-500' : index === 4 ? 'bg-yellow-500' : 'bg-muted-foreground'
                      }`}>
                        {step.id}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{step.name}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      {index < 4 && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                      {index === 4 && <RefreshCw className="w-6 h-6 text-yellow-500 animate-spin" />}
                    </motion.div>
                  ))}
                </div>

                <Card className="mt-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Dlaczego ręczny upload?</h4>
                        <p className="text-sm text-muted-foreground">
                          RouteNote nie udostępnia publicznego API do automatyzacji. Nasz system przygotowuje 
                          wszystkie materiały (CSV z metadanymi, instrukcje, zwalidowane pliki), 
                          ale finalny upload musi być wykonany ręcznie w panelu RouteNote. 
                          To jednorazowy proces trwający około 5-10 minut na wydanie.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrometheusDistribution;
