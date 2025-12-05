import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Music, Globe, Save, ArrowLeft, Camera, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    username: "",
    artist_name: "",
    label_name: "",
    bio: "",
    website: "",
    avatar_url: "",
    social_links: {
      instagram: "",
      twitter: "",
      spotify: "",
      youtube: ""
    }
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        username: data.username || "",
        artist_name: data.artist_name || "",
        label_name: data.label_name || "",
        bio: data.bio || "",
        website: data.website || "",
        avatar_url: data.avatar_url || "",
        social_links: (data.social_links as any) || {
          instagram: "",
          twitter: "",
          spotify: "",
          youtube: ""
        }
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: profile.full_name,
        username: profile.username,
        artist_name: profile.artist_name,
        label_name: profile.label_name,
        bio: profile.bio,
        website: profile.website,
        avatar_url: profile.avatar_url,
        social_links: profile.social_links,
        updated_at: new Date().toISOString()
      });

    setLoading(false);

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać profilu",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sukces",
        description: "Profil został zapisany"
      });
    }
  };

  const getInitials = () => {
    if (profile.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
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
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mój Profil</h1>
              <p className="text-muted-foreground">Zarządzaj swoimi danymi i ustawieniami</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-2xl bg-primary/20">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{profile.full_name || "Twoja Nazwa"}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    {profile.artist_name && (
                      <p className="text-sm text-primary mt-1">🎵 {profile.artist_name}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informacje Profilowe</CardTitle>
                <CardDescription>
                  Uzupełnij swoje dane, aby inne osoby mogły Cię łatwiej znaleźć
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="basic">
                      <User className="w-4 h-4 mr-2" />
                      Podstawowe
                    </TabsTrigger>
                    <TabsTrigger value="artist">
                      <Music className="w-4 h-4 mr-2" />
                      Artysta
                    </TabsTrigger>
                    <TabsTrigger value="social">
                      <Globe className="w-4 h-4 mr-2" />
                      Social Media
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Imię i Nazwisko</Label>
                        <Input
                          id="full_name"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          placeholder="Jan Kowalski"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Nazwa użytkownika</Label>
                        <Input
                          id="username"
                          value={profile.username}
                          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                          placeholder="jankowalski"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Opowiedz o sobie..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Strona internetowa</Label>
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="artist" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="artist_name">Nazwa Artystyczna</Label>
                        <Input
                          id="artist_name"
                          value={profile.artist_name}
                          onChange={(e) => setProfile({ ...profile, artist_name: e.target.value })}
                          placeholder="DJ Example"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="label_name">Wytwórnia</Label>
                        <Input
                          id="label_name"
                          value={profile.label_name}
                          onChange={(e) => setProfile({ ...profile, label_name: e.target.value })}
                          placeholder="Nazwa wytwórni (jeśli dotyczy)"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                            @
                          </span>
                          <Input
                            id="instagram"
                            className="rounded-l-none"
                            value={profile.social_links.instagram}
                            onChange={(e) => setProfile({
                              ...profile,
                              social_links: { ...profile.social_links, instagram: e.target.value }
                            })}
                            placeholder="username"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                            @
                          </span>
                          <Input
                            id="twitter"
                            className="rounded-l-none"
                            value={profile.social_links.twitter}
                            onChange={(e) => setProfile({
                              ...profile,
                              social_links: { ...profile.social_links, twitter: e.target.value }
                            })}
                            placeholder="username"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spotify">Spotify Artist Link</Label>
                        <Input
                          id="spotify"
                          value={profile.social_links.spotify}
                          onChange={(e) => setProfile({
                            ...profile,
                            social_links: { ...profile.social_links, spotify: e.target.value }
                          })}
                          placeholder="https://open.spotify.com/artist/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input
                          id="youtube"
                          value={profile.social_links.youtube}
                          onChange={(e) => setProfile({
                            ...profile,
                            social_links: { ...profile.social_links, youtube: e.target.value }
                          })}
                          placeholder="https://youtube.com/@..."
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Zapisywanie..." : "Zapisz Profil"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
