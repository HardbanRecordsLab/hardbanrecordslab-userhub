import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GENRE_LIST, LANGUAGE_LIST } from "./StoresList";

export interface AlbumDetailsData {
  title: string;
  artist_name: string;
  album_type: string;
  release_date: string;
  description: string;
  primary_genre: string;
  secondary_genre: string;
  language: string;
  upc_code: string;
  copyright_holder: string;
  copyright_year: string;
  label_name: string;
  explicit_content: boolean;
}

interface Props {
  data: AlbumDetailsData;
  onChange: (data: AlbumDetailsData) => void;
  disabled?: boolean;
}

export function AlbumDetailsStep({ data, onChange, disabled }: Props) {
  const update = (key: keyof AlbumDetailsData, value: any) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Szczegóły Albumu</h3>
        <p className="text-sm text-muted-foreground">
          Wprowadź metadane wydania — nazwa artysty, gatunek, język, data wydania itp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Tytuł wydania *</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Wpisz tytuł"
            required
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="artist">Nazwa artysty *</Label>
          <Input
            id="artist"
            value={data.artist_name}
            onChange={(e) => update('artist_name', e.target.value)}
            placeholder="Główny artysta"
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Typ wydania *</Label>
          <Select value={data.album_type} onValueChange={(v) => update('album_type', v)} disabled={disabled}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Singiel</SelectItem>
              <SelectItem value="ep">EP (2-6 utworów)</SelectItem>
              <SelectItem value="album">Album (7+ utworów)</SelectItem>
              <SelectItem value="compilation">Kompilacja</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gatunek główny *</Label>
          <Select value={data.primary_genre} onValueChange={(v) => update('primary_genre', v)} disabled={disabled}>
            <SelectTrigger><SelectValue placeholder="Wybierz gatunek" /></SelectTrigger>
            <SelectContent>
              {GENRE_LIST.map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gatunek dodatkowy</Label>
          <Select value={data.secondary_genre} onValueChange={(v) => update('secondary_genre', v)} disabled={disabled}>
            <SelectTrigger><SelectValue placeholder="Opcjonalnie" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Brak</SelectItem>
              {GENRE_LIST.map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Język *</Label>
          <Select value={data.language} onValueChange={(v) => update('language', v)} disabled={disabled}>
            <SelectTrigger><SelectValue placeholder="Wybierz język" /></SelectTrigger>
            <SelectContent>
              {LANGUAGE_LIST.map(l => (
                <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="release_date">Data wydania</Label>
          <Input
            id="release_date"
            type="date"
            value={data.release_date}
            onChange={(e) => update('release_date', e.target.value)}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            Zalecane min. 3 tygodnie od dziś
          </p>
        </div>
        <div className="space-y-2">
          <Label>Treści explicite?</Label>
          <Select 
            value={data.explicit_content ? 'yes' : 'no'} 
            onValueChange={(v) => update('explicit_content', v === 'yes')} 
            disabled={disabled}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">Nie</SelectItem>
              <SelectItem value="yes">Tak (Explicit)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="upc">Kod UPC</Label>
          <Input
            id="upc"
            value={data.upc_code}
            onChange={(e) => update('upc_code', e.target.value)}
            placeholder="Zostaw puste — wygenerujemy za darmo"
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            Jeśli masz UPC, wpisz go. Jeśli nie, zostawiaj puste.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="label">Wytwórnia</Label>
          <Input
            id="label"
            value={data.label_name}
            onChange={(e) => update('label_name', e.target.value)}
            placeholder="HardbanRecords Lab (domyślnie)"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="copyright_holder">Właściciel praw autorskich</Label>
          <Input
            id="copyright_holder"
            value={data.copyright_holder}
            onChange={(e) => update('copyright_holder', e.target.value)}
            placeholder="Domyślnie: nazwa artysty"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="copyright_year">Rok praw autorskich</Label>
          <Input
            id="copyright_year"
            value={data.copyright_year}
            onChange={(e) => update('copyright_year', e.target.value)}
            placeholder={new Date().getFullYear().toString()}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Opis wydania</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Opisz swoje wydanie — to pomoże słuchaczom je znaleźć"
          rows={3}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
