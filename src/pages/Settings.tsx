import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Bell, Shield, Globe, Palette, ArrowLeft, Save, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
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
  });

  const handleSave = async () => {
    setLoading(true);
    // Save settings to localStorage or database
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Sukces",
        description: "Ustawienia zostały zapisane"
      });
    }, 500);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Powiadomienia Email</p>
                        <p className="text-sm text-muted-foreground">Otrzymuj ważne aktualizacje na email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Powiadomienia Push</p>
                        <p className="text-sm text-muted-foreground">Powiadomienia w przeglądarce</p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, push: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Nowe Wydania</p>
                        <p className="text-sm text-muted-foreground">Powiadomienia o statusie wydań muzycznych</p>
                      </div>
                      <Switch
                        checked={settings.notifications.releases}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, releases: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Raporty Analityczne</p>
                        <p className="text-sm text-muted-foreground">Tygodniowe podsumowania statystyk</p>
                      </div>
                      <Switch
                        checked={settings.notifications.analytics}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, analytics: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Marketing</p>
                        <p className="text-sm text-muted-foreground">Informacje o promocjach i nowościach</p>
                      </div>
                      <Switch
                        checked={settings.notifications.marketing}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, marketing: checked }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Profil Publiczny</p>
                        <p className="text-sm text-muted-foreground">Czy inni użytkownicy mogą zobaczyć Twój profil</p>
                      </div>
                      <Switch
                        checked={settings.privacy.profilePublic}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, profilePublic: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Pokazuj Statystyki</p>
                        <p className="text-sm text-muted-foreground">Wyświetlaj statystyki na publicznym profilu</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showStats}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, showStats: checked }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Zezwalaj na Wiadomości</p>
                        <p className="text-sm text-muted-foreground">Inni użytkownicy mogą wysyłać Ci wiadomości</p>
                      </div>
                      <Switch
                        checked={settings.privacy.allowMessages}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, allowMessages: checked }
                        })}
                      />
                    </div>
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
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Zapisywanie..." : "Zapisz Ustawienia"}
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
