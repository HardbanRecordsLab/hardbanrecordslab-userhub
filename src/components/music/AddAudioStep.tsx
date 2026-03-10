import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileAudio, Trash2, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

export interface TrackData {
  id: string;
  file: File | null;
  title: string;
  isrc: string;
  featured_artists: string;
  title_version: string;
  explicit: boolean;
}

interface Props {
  tracks: TrackData[];
  onChange: (tracks: TrackData[]) => void;
  disabled?: boolean;
}

function createEmptyTrack(): TrackData {
  return {
    id: crypto.randomUUID(),
    file: null,
    title: '',
    isrc: '',
    featured_artists: '',
    title_version: '',
    explicit: false,
  };
}

export function AddAudioStep({ tracks, onChange, disabled }: Props) {
  const addTrack = () => {
    if (tracks.length >= 15) return;
    onChange([...tracks, createEmptyTrack()]);
  };

  const removeTrack = (id: string) => {
    onChange(tracks.filter(t => t.id !== id));
  };

  const updateTrack = (id: string, key: keyof TrackData, value: any) => {
    onChange(tracks.map(t => t.id === id ? { ...t, [key]: value } : t));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Dodaj Audio</h3>
        <p className="text-sm text-muted-foreground">
          Prześlij swoje utwory. Audio musi być w formacie FLAC lub MP3, minimum 320kbps, 44.1kHz stereo.
          Możesz dodać do 15 utworów na sesję.
        </p>
      </div>

      {/* Audio Requirements */}
      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-primary" />
          Wymagania audio
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Format: <strong>FLAC</strong> lub <strong>MP3</strong> (WAV też akceptowany)</li>
          <li>• Bitrate: minimum <strong>320kbps</strong></li>
          <li>• Sample rate: <strong>44.1kHz</strong></li>
          <li>• Kanały: <strong>Stereo</strong></li>
          <li>• Maksymalny rozmiar: <strong>100MB</strong> na plik</li>
        </ul>
      </div>

      {/* Track List */}
      <div className="space-y-4">
        {tracks.map((track, index) => (
          <div 
            key={track.id} 
            className="p-4 rounded-lg border border-border bg-card/50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="font-semibold text-sm">
                  {track.title || `Utwór ${index + 1}`}
                </span>
                {track.file && (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                )}
              </div>
              {tracks.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeTrack(track.id)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Plik audio *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".mp3,.flac,.wav,audio/mpeg,audio/flac,audio/wav"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      updateTrack(track.id, 'file', file);
                      if (file && !track.title) {
                        // Auto-fill title from filename
                        const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
                        updateTrack(track.id, 'title', name);
                      }
                    }}
                    disabled={disabled}
                    className="cursor-pointer text-xs"
                  />
                  {track.file && <FileAudio className="h-4 w-4 text-primary shrink-0" />}
                </div>
                {track.file && (
                  <p className="text-xs text-muted-foreground">
                    {(track.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tytuł utworu *</Label>
                <Input
                  value={track.title}
                  onChange={(e) => updateTrack(track.id, 'title', e.target.value)}
                  placeholder="Nazwa utworu"
                  disabled={disabled}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Kod ISRC</Label>
                <Input
                  value={track.isrc}
                  onChange={(e) => updateTrack(track.id, 'isrc', e.target.value)}
                  placeholder="Zostaw puste = auto"
                  disabled={disabled}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Feat. artyści</Label>
                <Input
                  value={track.featured_artists}
                  onChange={(e) => updateTrack(track.id, 'featured_artists', e.target.value)}
                  placeholder="np. feat. Jan Kowalski"
                  disabled={disabled}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Wersja tytułu</Label>
                <Input
                  value={track.title_version}
                  onChange={(e) => updateTrack(track.id, 'title_version', e.target.value)}
                  placeholder="np. Remix, Acoustic, Live"
                  disabled={disabled}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {tracks.length < 15 && (
        <Button
          variant="outline"
          onClick={addTrack}
          disabled={disabled}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Dodaj kolejny utwór ({tracks.length}/15)
        </Button>
      )}
    </div>
  );
}

export { createEmptyTrack };
