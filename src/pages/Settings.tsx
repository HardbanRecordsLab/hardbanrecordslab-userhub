import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Bell, Shield, Globe, Palette, ArrowLeft, Save, LogOut, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const defaultSettings = {
  notifications: {
    email: true,
    push: true,
    marketing: false,
    releases: true,
    analytics: true
  },
  privacy: {
    profilePublic: true,
    showStats: false,
    allowMessages: true
  },
  preferences: {
    language: "pl",
    timezone: "Europe/Warsaw",
    theme: "dark",
    currency: "PLN"
  }
};

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    setLoadingSettings(true);
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("settings")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data?.settings) {
        setSettings({ ...defaultSettings, ...(data.settings as typeof defaultSettings) });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert(
          { user_id: user.id, settings: settings as any },
          { onConflict: "user_id" }
        );

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Ustawienia zostały zapisane"
      });
    } catch (err: any) {
      toast({
        title: "Błąd",
        description: err.message || "Nie udało się zapisać ustawień",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do Panelu
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Ustawienia</h1>
                <p className="text-muted-foreground">Dostosuj aplikację do swoich potrzeb</p>
              </div>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="notifications" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="notifications">
                    <Bell className="w-4 h-4 mr-2" />
                    Powiadomienia
                  </TabsTrigger>
                  <TabsTrigger value="privacy">
                    <Shield className="w-4 h-4 mr-2" />
                    Prywatność
                  </TabsTrigger>
                  <TabsTrigger value="preferences">
                    <Globe className="w-4 h-4 mr-2" />
                    Preferencje
                  </TabsTrigger>
                  <TabsTrigger value="appearance">
                    <Palette className="w-4 h-4 mr-2" />
                    Wygląd
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notifications" className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { key: "email" as const, label: "Powiadomienia Email", desc: "Otrzymuj ważne aktualizacje na email" },
                      { key: "push" as const, label: "Powiadomienia Push", desc: "Powiadomienia w przeglądarce" },
                      { key: "releases" as const, label: "Nowe Wydania", desc: "Powiadomienia o statusie wydań muzycznych" },
                      { key: "analytics" as const, label: "Raporty Analityczne", desc: "Tygodniowe podsumowania statystyk" },
                      { key: "marketing" as const, label: "Marketing", desc: "Informacje o promocjach i nowościach" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={settings.notifications[item.key]}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, [item.key]: checked }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { key: "profilePublic" as const, label: "Profil Publiczny", desc: "Czy inni użytkownicy mogą zobaczyć Twój profil" },
                      { key: "showStats" as const, label: "Pokazuj Statystyki", desc: "Wyświetlaj statystyki na publicznym profilu" },
                      { key: "allowMessages" as const, label: "Zezwalaj na Wiadomości", desc: "Inni użytkownicy mogą wysyłać Ci wiadomości" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={settings.privacy[item.key]}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, [item.key]: checked }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Język</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, language: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pl">Polski</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Strefa Czasowa</Label>
                      <Select
                        value={settings.preferences.timezone}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, timezone: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Warsaw">Europa/Warszawa (CET)</SelectItem>
                          <SelectItem value="Europe/London">Europa/Londyn (GMT)</SelectItem>
                          <SelectItem value="America/New_York">Ameryka/Nowy Jork (EST)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Ameryka/Los Angeles (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Waluta</Label>
                      <Select
                        value={settings.preferences.currency}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, currency: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PLN">PLN (zł)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                  <div className="space-y-4">
                    <Label>Motyw</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {['dark', 'light', 'system'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setSettings({
                            ...settings,
                            preferences: { ...settings.preferences, theme }
                          })}
                          className={`p-4 border rounded-lg text-center transition-all ${
                            settings.preferences.theme === theme
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="font-medium capitalize">{theme === 'dark' ? 'Ciemny' : theme === 'light' ? 'Jasny' : 'Systemowy'}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-6 pt-6 border-t">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Zapisz Ustawienia
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;