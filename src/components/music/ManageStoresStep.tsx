import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MUSIC_STORES, TERRITORIES, MusicStore } from "./StoresList";
import { Globe, Music, Download, Share2, MoreHorizontal, CheckCircle2 } from "lucide-react";

interface Props {
  selectedStores: string[];
  selectedTerritories: string[];
  onStoresChange: (stores: string[]) => void;
  onTerritoriesChange: (territories: string[]) => void;
  disabled?: boolean;
}

const categoryIcons: Record<string, any> = {
  streaming: Music,
  download: Download,
  social: Share2,
  other: MoreHorizontal,
};

const categoryLabels: Record<string, string> = {
  streaming: 'Platformy Streamingowe',
  download: 'Sklepy Cyfrowe',
  social: 'Social & Video',
  other: 'Inne',
};

export function ManageStoresStep({ selectedStores, selectedTerritories, onStoresChange, onTerritoriesChange, disabled }: Props) {
  const [showAllStores, setShowAllStores] = useState(false);

  const allStoreIds = MUSIC_STORES.map(s => s.id);
  const allSelected = selectedStores.length === allStoreIds.length;

  const toggleAll = () => {
    onStoresChange(allSelected ? [] : [...allStoreIds]);
  };

  const toggleStore = (id: string) => {
    onStoresChange(
      selectedStores.includes(id) 
        ? selectedStores.filter(s => s !== id)
        : [...selectedStores, id]
    );
  };

  const toggleTerritory = (id: string) => {
    if (id === 'worldwide') {
      onTerritoriesChange(['worldwide']);
      return;
    }
    const newTerritories = selectedTerritories.filter(t => t !== 'worldwide');
    if (newTerritories.includes(id)) {
      onTerritoriesChange(newTerritories.filter(t => t !== id));
    } else {
      onTerritoriesChange([...newTerritories, id]);
    }
  };

  const categories = ['streaming', 'download', 'social', 'other'] as const;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Zarządzaj Sklepami i Terytoriami</h3>
        <p className="text-sm text-muted-foreground">
          Wybierz platformy streamingowe i sklepy, na których chcesz dystrybuować muzykę.
          Możesz też wybrać terytoria. Zalecamy: wszystkie sklepy + cały świat.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant={allSelected ? "default" : "outline"}
          size="sm"
          onClick={toggleAll}
          disabled={disabled}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {allSelected ? 'Odznacz wszystkie' : 'Zaznacz wszystkie sklepy'}
        </Button>
        <Badge variant="secondary" className="text-xs">
          {selectedStores.length}/{allStoreIds.length} sklepów wybranych
        </Badge>
      </div>

      {/* Stores by Category */}
      <div className="space-y-4">
        {categories.map(cat => {
          const stores = MUSIC_STORES.filter(s => s.category === cat);
          const Icon = categoryIcons[cat];
          const catSelected = stores.filter(s => selectedStores.includes(s.id)).length;

          return (
            <div key={cat} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{categoryLabels[cat]}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {catSelected}/{stores.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {stores.map(store => (
                  <label
                    key={store.id}
                    className={`
                      flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm
                      transition-colors
                      ${selectedStores.includes(store.id) 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'bg-card/50 border border-transparent hover:bg-muted/50'
                      }
                    `}
                  >
                    <Checkbox
                      checked={selectedStores.includes(store.id)}
                      onCheckedChange={() => toggleStore(store.id)}
                      disabled={disabled}
                    />
                    <span className="text-xs">{store.name}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Territories */}
      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Terytoria</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Zostaw "Cały Świat" aby dystrybuować globalnie (zalecane) lub wybierz konkretne regiony.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {TERRITORIES.map(territory => (
            <label
              key={territory.id}
              className={`
                flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm
                transition-colors
                ${selectedTerritories.includes(territory.id)
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-card/50 border border-transparent hover:bg-muted/50'
                }
              `}
            >
              <Checkbox
                checked={selectedTerritories.includes(territory.id)}
                onCheckedChange={() => toggleTerritory(territory.id)}
                disabled={disabled}
              />
              <span className="text-xs">{territory.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distribution Model Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
          <h4 className="text-sm font-bold text-green-400 mb-1">Free — 85% tantiem</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Nielimitowane wydania</li>
            <li>• Wszystkie sklepy i terytoria</li>
            <li>• Wszystkie funkcje dostępne</li>
            <li>• 85% przychodów dla artysty</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
          <h4 className="text-sm font-bold text-primary mb-1">Premium — 100% tantiem</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Te same funkcje co Free</li>
            <li>• 100% przychodów dla artysty</li>
            <li>• Jednorazowa opłata za wydanie</li>
            <li>• Idealne gdy zarabiasz na muzyce</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
