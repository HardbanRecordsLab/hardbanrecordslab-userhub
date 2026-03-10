import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, Circle, Loader2, Send, 
  FileText, FileAudio, ImageIcon, Globe,
  ArrowLeft, ArrowRight, Save
} from "lucide-react";
import { motion } from "framer-motion";
import { AlbumDetailsStep, AlbumDetailsData } from "./AlbumDetailsStep";
import { AddAudioStep, TrackData, createEmptyTrack } from "./AddAudioStep";
import { AddArtworkStep } from "./AddArtworkStep";
import { ManageStoresStep } from "./ManageStoresStep";
import { MUSIC_STORES } from "./StoresList";
import { 
  validateFileForUpload, 
  generateSafeFilename,
  MUSIC_AUDIO_ALLOWED_TYPES,
  MUSIC_COVER_ALLOWED_TYPES,
  MAX_FILE_SIZES 
} from "@/lib/fileValidation";

interface Props {
  onClose: () => void;
  onComplete: () => void;
  editReleaseId?: string;
}

const STEPS = [
  { id: 'details', label: 'Szczegóły Albumu', icon: FileText },
  { id: 'audio', label: 'Dodaj Audio', icon: FileAudio },
  { id: 'artwork', label: 'Dodaj Okładkę', icon: ImageIcon },
  { id: 'stores', label: 'Sklepy i Terytoria', icon: Globe },
] as const;

export function ReleaseWizard({ onClose, onComplete, editReleaseId }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('details');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Album Details
  const [albumDetails, setAlbumDetails] = useState<AlbumDetailsData>({
    title: '',
    artist_name: '',
    album_type: 'single',
    release_date: '',
    description: '',
    primary_genre: '',
    secondary_genre: '',
    language: 'pl',
    upc_code: '',
    copyright_holder: '',
    copyright_year: new Date().getFullYear().toString(),
    label_name: '',
    explicit_content: false,
  });

  // Audio tracks
  const [tracks, setTracks] = useState<TrackData[]>([createEmptyTrack()]);

  // Artwork
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Stores & Territories
  const [selectedStores, setSelectedStores] = useState<string[]>(MUSIC_STORES.map(s => s.id));
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>(['worldwide']);

  // Completion status
  const isDetailsComplete = !!(albumDetails.title && albumDetails.artist_name && albumDetails.primary_genre && albumDetails.language);
  const isAudioComplete = tracks.some(t => t.file !== null && t.title);
  const isArtworkComplete = coverFile !== null;
  const isStoresComplete = selectedStores.length > 0 && selectedTerritories.length > 0;
  const allComplete = isDetailsComplete && isAudioComplete && isArtworkComplete && isStoresComplete;

  const completionMap: Record<string, boolean> = {
    details: isDetailsComplete,
    audio: isAudioComplete,
    artwork: isArtworkComplete,
    stores: isStoresComplete,
  };

  const uploadFile = async (file: File, folder: string, releaseId: string) => {
    const safeFilename = generateSafeFilename(file.name);
    const filePath = `${user?.id}/${releaseId}/${folder}/${safeFilename}`;
    
    const { error: uploadError } = await supabase.storage
      .from('music-releases')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('music-releases')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSaveDraft = async () => {
    if (!user || !albumDetails.title || !albumDetails.artist_name) {
      toast({ title: "Uzupełnij przynajmniej tytuł i nazwę artysty", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const genres = [albumDetails.primary_genre, albumDetails.secondary_genre].filter(Boolean);

      const releaseData = {
        title: albumDetails.title,
        artist_name: albumDetails.artist_name,
        album_type: albumDetails.album_type,
        release_date: albumDetails.release_date || null,
        description: albumDetails.description || null,
        genre: genres.length > 0 ? genres : null,
        upc_code: albumDetails.upc_code || null,
        user_id: user.id,
        status: 'draft' as const,
        metadata: {
          language: albumDetails.language,
          copyright_holder: albumDetails.copyright_holder || albumDetails.artist_name,
          copyright_year: albumDetails.copyright_year,
          label_name: albumDetails.label_name || 'HardbanRecords Lab',
          explicit_content: albumDetails.explicit_content,
          tracks: tracks.filter(t => t.title).map(t => ({
            title: t.title,
            isrc: t.isrc,
            featured_artists: t.featured_artists,
            title_version: t.title_version,
            explicit: t.explicit,
          })),
          distribution: {
            stores: selectedStores,
            territories: selectedTerritories,
          },
        },
      };

      const { data: release, error: insertError } = await supabase
        .from("music_releases")
        .insert(releaseData)
        .select()
        .single();

      if (insertError) throw insertError;

      // Upload audio files
      for (const track of tracks) {
        if (track.file) {
          await uploadFile(track.file, 'audio', release.id);
        }
      }

      // Upload cover
      let coverUrl = null;
      if (coverFile) {
        coverUrl = await uploadFile(coverFile, 'cover', release.id);
      }

      // Update with file URLs
      if (coverUrl || tracks.some(t => t.file)) {
        const firstAudioTrack = tracks.find(t => t.file);
        let audioUrl = null;
        if (firstAudioTrack?.file) {
          const safeFilename = generateSafeFilename(firstAudioTrack.file.name);
          const { data: { publicUrl } } = supabase.storage
            .from('music-releases')
            .getPublicUrl(`${user.id}/${release.id}/audio/${safeFilename}`);
          audioUrl = publicUrl;
        }

        await supabase
          .from("music_releases")
          .update({
            cover_file_url: coverUrl,
            audio_file_url: audioUrl,
          })
          .eq('id', release.id);
      }

      toast({ title: "Szkic zapisany!", description: "Wydanie zostało zapisane jako szkic." });
      onComplete();
    } catch (error: any) {
      toast({ title: "Błąd", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!allComplete) {
      toast({ title: "Uzupełnij wszystkie sekcje", description: "Każda z 4 sekcji musi być wypełniona.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const genres = [albumDetails.primary_genre, albumDetails.secondary_genre].filter(Boolean);

      const releaseData = {
        title: albumDetails.title,
        artist_name: albumDetails.artist_name,
        album_type: albumDetails.album_type,
        release_date: albumDetails.release_date || null,
        description: albumDetails.description || null,
        genre: genres.length > 0 ? genres : null,
        upc_code: albumDetails.upc_code || null,
        user_id: user!.id,
        status: 'submitted' as const,
        submitted_at: new Date().toISOString(),
        metadata: {
          language: albumDetails.language,
          copyright_holder: albumDetails.copyright_holder || albumDetails.artist_name,
          copyright_year: albumDetails.copyright_year,
          label_name: albumDetails.label_name || 'HardbanRecords Lab',
          explicit_content: albumDetails.explicit_content,
          tracks: tracks.filter(t => t.title).map(t => ({
            title: t.title,
            isrc: t.isrc,
            featured_artists: t.featured_artists,
            title_version: t.title_version,
            explicit: t.explicit,
          })),
          distribution: {
            stores: selectedStores,
            territories: selectedTerritories,
          },
        },
      };

      const { data: release, error: insertError } = await supabase
        .from("music_releases")
        .insert(releaseData)
        .select()
        .single();

      if (insertError) throw insertError;

      // Upload all files
      for (const track of tracks) {
        if (track.file) {
          await uploadFile(track.file, 'audio', release.id);
        }
      }

      let coverUrl = null;
      if (coverFile) {
        coverUrl = await uploadFile(coverFile, 'cover', release.id);
      }

      // Update URLs
      const firstTrack = tracks.find(t => t.file);
      let audioUrl = null;
      if (firstTrack?.file) {
        const safeName = generateSafeFilename(firstTrack.file.name);
        const { data: { publicUrl } } = supabase.storage
          .from('music-releases')
          .getPublicUrl(`${user!.id}/${release.id}/audio/${safeName}`);
        audioUrl = publicUrl;
      }

      await supabase
        .from("music_releases")
        .update({ cover_file_url: coverUrl, audio_file_url: audioUrl })
        .eq('id', release.id);

      toast({
        title: "Wysłano do weryfikacji! 🎵",
        description: "Twoje wydanie przejdzie moderację. Czas oczekiwania: do 12 dni roboczych. Po zatwierdzeniu, pojawi się w sklepach w ciągu 7-14 dni.",
      });
      onComplete();
    } catch (error: any) {
      toast({ title: "Błąd", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = STEPS.findIndex(s => s.id === activeTab);
  const canGoNext = stepIndex < STEPS.length - 1;
  const canGoPrev = stepIndex > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="glass-dark border-white/10">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Nowe Wydanie</h2>
              <p className="text-sm text-muted-foreground">
                Wypełnij 4 sekcje w dowolnej kolejności, a następnie wyślij do dystrybucji.
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {STEPS.map(step => {
              const isComplete = completionMap[step.id];
              const isActive = activeTab === step.id;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg text-left transition-all text-sm
                    ${isActive ? 'bg-primary/20 border border-primary/40' : 'bg-card/50 border border-transparent hover:bg-muted/50'}
                  `}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <div className="min-w-0">
                    <Icon className="h-4 w-4 mb-0.5" />
                    <span className="text-xs font-medium block truncate">{step.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="details" className="mt-0">
              <AlbumDetailsStep data={albumDetails} onChange={setAlbumDetails} disabled={loading || saving} />
            </TabsContent>
            <TabsContent value="audio" className="mt-0">
              <AddAudioStep tracks={tracks} onChange={setTracks} disabled={loading || saving} />
            </TabsContent>
            <TabsContent value="artwork" className="mt-0">
              <AddArtworkStep 
                coverFile={coverFile} 
                coverPreview={coverPreview}
                onChange={(file, preview) => { setCoverFile(file); setCoverPreview(preview); }}
                disabled={loading || saving}
              />
            </TabsContent>
            <TabsContent value="stores" className="mt-0">
              <ManageStoresStep
                selectedStores={selectedStores}
                selectedTerritories={selectedTerritories}
                onStoresChange={setSelectedStores}
                onTerritoriesChange={setSelectedTerritories}
                disabled={loading || saving}
              />
            </TabsContent>
          </Tabs>

          {/* Navigation & Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div className="flex gap-2">
              {canGoPrev && (
                <Button variant="outline" onClick={() => setActiveTab(STEPS[stepIndex - 1].id)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Wstecz
                </Button>
              )}
              {canGoNext && (
                <Button variant="outline" onClick={() => setActiveTab(STEPS[stepIndex + 1].id)}>
                  Dalej <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft} disabled={loading || saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Zapisz szkic
              </Button>
              <Button 
                variant="gradient" 
                onClick={handleSubmitForReview}
                disabled={!allComplete || loading || saving}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Wyślij do Dystrybucji
              </Button>
            </div>
          </div>

          {/* Moderation Info */}
          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Proces dystrybucji:</strong> Po wysłaniu, Twoje wydanie przechodzi moderację (do 12 dni roboczych). 
              Po zatwierdzeniu, trafia do wybranych sklepów w ciągu 7-14 dni. 
              Planuj wydanie z wyprzedzeniem minimum 3 tygodni.
              <br />
              <strong>Model Free:</strong> 85% tantiem dla artysty • <strong>Bez opłat</strong> za dystrybucję • Nielimitowane wydania
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
