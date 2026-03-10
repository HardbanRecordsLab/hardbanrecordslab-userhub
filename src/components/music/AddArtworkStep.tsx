import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ImageIcon, CheckCircle2, Upload } from "lucide-react";

interface Props {
  coverFile: File | null;
  coverPreview: string | null;
  onChange: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
}

export function AddArtworkStep({ coverFile, coverPreview, onChange, disabled }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);

    // Check format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Format musi być JPEG (.jpg). PNG jest akceptowany ale JPEG jest zalecany.');
    }

    // Check size (25MB max)
    if (file.size > 25 * 1024 * 1024) {
      setError('Plik jest za duży. Maksymalny rozmiar to 25MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 3000 || img.height < 3000) {
          setError(`Wymiary: ${img.width}x${img.height}px. Wymagane minimum 3000x3000px.`);
        }
        if (img.width !== img.height) {
          setError((prev) => (prev ? prev + ' ' : '') + `Obraz nie jest kwadratowy (${img.width}x${img.height}).`);
        }
        onChange(file, e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Dodaj Okładkę</h3>
        <p className="text-sm text-muted-foreground">
          Prześlij okładkę albumu. Dobra okładka wyróżni Twoje wydanie na platformach streamingowych.
        </p>
      </div>

      {/* Requirements */}
      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-primary" />
          Wymagania okładki
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Wymiary: <strong>3000 x 3000 pikseli</strong> (kwadrat)</li>
          <li>• Format: <strong>JPEG (.jpg)</strong> — zalecany</li>
          <li>• Maksymalny rozmiar: <strong>25MB</strong></li>
          <li>• Przestrzeń kolorów: <strong>RGB</strong></li>
          <li>• Bez tekstu na okładce typu "Nowy singiel!" lub URL</li>
          <li>• Bez logo platform streamingowych</li>
        </ul>
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${dragOver ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
          ${coverPreview ? 'border-green-500/50' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {coverPreview ? (
          <div className="space-y-4">
            <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden shadow-lg">
              <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Okładka załadowana</span>
            </div>
            {coverFile && (
              <p className="text-xs text-muted-foreground">
                {coverFile.name} — {(coverFile.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Kliknij aby zmienić okładkę
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">Przeciągnij i upuść okładkę</p>
              <p className="text-xs text-muted-foreground">lub kliknij aby wybrać plik</p>
            </div>
            <p className="text-xs text-muted-foreground">JPEG, 3000x3000px, max 25MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
