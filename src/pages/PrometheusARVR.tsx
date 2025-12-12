import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Box, Glasses, Video, Sparkles, Plus, Download, Trash2, Eye, ExternalLink, Users, Calendar, Settings, Play, Upload, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ARFilter {
  id: string;
  name: string;
  platform: "Instagram" | "Snapchat" | "TikTok" | "Facebook";
  status: "published" | "draft" | "review";
  uses: number;
  preview: string;
  createdAt: string;
}

interface VREvent {
  id: string;
  name: string;
  type: string;
  status: "active" | "scheduled" | "ended";
  participants: number;
  maxCapacity: number;
  date: string;
  description: string;
}

const PrometheusARVR = () => {
  const { toast } = useToast();

  const [arFilters, setArFilters] = useState<ARFilter[]>([
    {
      id: "1",
      name: "Album Cover Effect",
      platform: "Instagram",
      status: "published",
      uses: 15200,
      preview: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      createdAt: "2025-11-01"
    },
    {
      id: "2",
      name: "Concert Stage AR",
      platform: "Snapchat",
      status: "published",
      uses: 8500,
      preview: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
      createdAt: "2025-10-15"
    },
    {
      id: "3",
      name: "Music Video Portal",
      platform: "TikTok",
      status: "draft",
      uses: 0,
      preview: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      createdAt: "2025-12-10"
    }
  ]);

  const [vrEvents, setVrEvents] = useState<VREvent[]>([
    {
      id: "1",
      name: "Virtual Concert Hall",
      type: "Mozilla Hubs",
      participants: 250,
      maxCapacity: 500,
      status: "active",
      date: "2025-12-20",
      description: "Wirtualny koncert z interaktywnymi elementami"
    },
    {
      id: "2",
      name: "Album Launch Event",
      type: "Custom WebXR",
      participants: 420,
      maxCapacity: 1000,
      status: "scheduled",
      date: "2025-12-25",
      description: "Premiera albumu w wirtualnej przestrzeni"
    }
  ]);

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const [newFilter, setNewFilter] = useState({
    name: "",
    platform: "",
    description: ""
  });

  const [newEvent, setNewEvent] = useState({
    name: "",
    type: "",
    maxCapacity: "500",
    date: "",
    description: ""
  });

  const platforms = [
    { value: "Instagram", label: "Instagram" },
    { value: "Snapchat", label: "Snapchat" },
    { value: "TikTok", label: "TikTok" },
    { value: "Facebook", label: "Facebook" }
  ];

  const eventTypes = [
    { value: "Mozilla Hubs", label: "Mozilla Hubs" },
    { value: "Custom WebXR", label: "Custom WebXR" },
    { value: "Spatial", label: "Spatial.io" },
    { value: "VRChat", label: "VRChat" }
  ];

  const tools = [
    {
      name: "Spark AR Studio",
      description: "Tworzenie filtrów dla Instagram i Facebook",
      icon: Glasses,
      color: "from-purple-500 to-pink-500",
      link: "https://spark.meta.com/"
    },
    {
      name: "Blender 3D",
      description: "Modelowanie 3D i animacje",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500",
      link: "https://www.blender.org/"
    },
    {
      name: "Three.js",
      description: "Interaktywne 3D w przeglądarce",
      icon: Box,
      color: "from-green-500 to-emerald-500",
      link: "https://threejs.org/"
    },
    {
      name: "Mozilla Hubs",
      description: "Wirtualne eventy i przestrzenie",
      icon: Video,
      color: "from-orange-500 to-red-500",
      link: "https://hubs.mozilla.com/"
    }
  ];

  const filterTemplates = [
    { name: "Face Mask", description: "Maska nakładana na twarz", icon: "🎭" },
    { name: "World Effect", description: "Efekty w otoczeniu użytkownika", icon: "🌍" },
    { name: "Body Tracking", description: "Śledzenie całego ciała", icon: "🕺" },
    { name: "Portal", description: "Portal do innego świata", icon: "🚪" },
    { name: "3D Object", description: "Obiekt 3D w przestrzeni", icon: "📦" },
    { name: "Game", description: "Interaktywna mini-gra", icon: "🎮" }
  ];

  const createFilter = () => {
    if (!newFilter.name || !newFilter.platform) {
      toast({
        title: "Uzupełnij wymagane pola",
        variant: "destructive"
      });
      return;
    }

    const filter: ARFilter = {
      id: Date.now().toString(),
      name: newFilter.name,
      platform: newFilter.platform as ARFilter["platform"],
      status: "draft",
      uses: 0,
      preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setArFilters(prev => [filter, ...prev]);
    setNewFilter({ name: "", platform: "", description: "" });
    setIsFilterDialogOpen(false);
    toast({
      title: "Filtr utworzony",
      description: "Możesz teraz dodać zasoby i opublikować filtr"
    });
  };

  const createEvent = () => {
    if (!newEvent.name || !newEvent.type || !newEvent.date) {
      toast({
        title: "Uzupełnij wymagane pola",
        variant: "destructive"
      });
      return;
    }

    const event: VREvent = {
      id: Date.now().toString(),
      name: newEvent.name,
      type: newEvent.type,
      status: "scheduled",
      participants: 0,
      maxCapacity: parseInt(newEvent.maxCapacity) || 500,
      date: newEvent.date,
      description: newEvent.description
    };

    setVrEvents(prev => [event, ...prev]);
    setNewEvent({ name: "", type: "", maxCapacity: "500", date: "", description: "" });
    setIsEventDialogOpen(false);
    toast({
      title: "Event utworzony",
      description: "Wirtualny event został zaplanowany"
    });
  };

  const deleteFilter = (id: string) => {
    setArFilters(prev => prev.filter(f => f.id !== id));
    toast({ title: "Filtr usunięty" });
  };

  const deleteEvent = (id: string) => {
    setVrEvents(prev => prev.filter(e => e.id !== id));
    toast({ title: "Event usunięty" });
  };

  const publishFilter = (id: string) => {
    setArFilters(prev => prev.map(f => 
      f.id === id ? { ...f, status: "review" as const } : f
    ));
    toast({
      title: "Wysłano do recenzji",
      description: "Filtr zostanie sprawdzony przez platformę"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
      case "active": return "default";
      case "review":
      case "scheduled": return "secondary";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published": return "Opublikowany";
      case "draft": return "Szkic";
      case "review": return "W recenzji";
      case "active": return "Aktywny";
      case "scheduled": return "Zaplanowany";
      case "ended": return "Zakończony";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AR/VR/MR Studio</h1>
              <p className="text-muted-foreground">Immersyjne doświadczenia z Spark AR, Blender i Mozilla Hubs</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{arFilters.length}</p>
                <p className="text-sm text-muted-foreground">Filtry AR</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-500">
                  {arFilters.reduce((sum, f) => sum + f.uses, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Użycia</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-500">{vrEvents.length}</p>
                <p className="text-sm text-muted-foreground">Eventy VR</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-purple-500">
                  {vrEvents.reduce((sum, e) => sum + e.participants, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Uczestnicy</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <Tabs defaultValue="ar" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="ar">Filtry AR</TabsTrigger>
            <TabsTrigger value="vr">Eventy VR</TabsTrigger>
            <TabsTrigger value="tools">Narzędzia</TabsTrigger>
          </TabsList>

          <TabsContent value="ar" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Filtry AR</h2>
              <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nowy Filtr
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Utwórz nowy filtr AR</DialogTitle>
                    <DialogDescription>
                      Wybierz szablon i stwórz filtr dla swoich fanów
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="filter-name">Nazwa filtra *</Label>
                      <Input
                        id="filter-name"
                        value={newFilter.name}
                        onChange={(e) => setNewFilter(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="np. Album Cover Effect"
                      />
                    </div>
                    <div>
                      <Label>Platforma *</Label>
                      <Select
                        value={newFilter.platform}
                        onValueChange={(value) => setNewFilter(prev => ({ ...prev, platform: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz platformę" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Typ filtra (szablony)</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {filterTemplates.map((template) => (
                          <div
                            key={template.name}
                            className="p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors text-center"
                          >
                            <span className="text-2xl">{template.icon}</span>
                            <p className="text-sm font-medium mt-1">{template.name}</p>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="filter-desc">Opis</Label>
                      <Textarea
                        id="filter-desc"
                        value={newFilter.description}
                        onChange={(e) => setNewFilter(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Opisz działanie filtra..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>Anuluj</Button>
                    <Button onClick={createFilter}>Utwórz filtr</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {arFilters.map((filter, index) => (
                <motion.div
                  key={filter.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <img 
                        src={filter.preview} 
                        alt={filter.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2">
                        {filter.platform}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {filter.name}
                        <Badge variant={getStatusColor(filter.status)}>
                          {getStatusLabel(filter.status)}
                        </Badge>
                      </CardTitle>
                      <CardDescription>Utworzono: {filter.createdAt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        {filter.status === "published" && (
                          <span className="text-sm text-muted-foreground">
                            {filter.uses.toLocaleString()} użyć
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Podgląd
                        </Button>
                        {filter.status === "draft" && (
                          <Button size="sm" className="flex-1" onClick={() => publishFilter(filter.id)}>
                            <Upload className="w-4 h-4 mr-2" />
                            Publikuj
                          </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={() => deleteFilter(filter.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vr" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Wirtualne Eventy</h2>
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nowy Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Utwórz wirtualny event</DialogTitle>
                    <DialogDescription>
                      Zaplanuj immersyjne doświadczenie dla fanów
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="event-name">Nazwa eventu *</Label>
                      <Input
                        id="event-name"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="np. Virtual Album Launch"
                      />
                    </div>
                    <div>
                      <Label>Platforma *</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz platformę" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="event-date">Data *</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-capacity">Max. uczestników</Label>
                      <Input
                        id="event-capacity"
                        type="number"
                        value={newEvent.maxCapacity}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, maxCapacity: e.target.value }))}
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-desc">Opis</Label>
                      <Textarea
                        id="event-desc"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Opisz event..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Anuluj</Button>
                    <Button onClick={createEvent}>Utwórz event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {vrEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {event.name}
                            <Badge variant={getStatusColor(event.status)}>
                              {getStatusLabel(event.status)}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                            <span>•</span>
                            {event.type}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline">
                            <Play className="w-4 h-4 mr-2" />
                            Otwórz
                          </Button>
                          <Button variant="outline" size="icon">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => deleteEvent(event.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                      )}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Uczestnicy: {event.participants} / {event.maxCapacity}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {Math.round((event.participants / event.maxCapacity) * 100)}% pojemności
                          </span>
                        </div>
                        <Progress value={(event.participants / event.maxCapacity) * 100} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <CardHeader>
                <CardTitle>Stwórz Wirtualną Przestrzeń</CardTitle>
                <CardDescription>
                  Zaprojektuj immersyjne doświadczenie dla swoich fanów z Mozilla Hubs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Rozpocznij projekt VR
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Narzędzia Open Source</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <a href={tool.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Otwórz
                        </a>
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Dokumentacja
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Zasoby i tutoriale</CardTitle>
                <CardDescription>Naucz się tworzyć immersyjne doświadczenia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Glasses className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium">Spark AR Basics</h4>
                    <p className="text-sm text-muted-foreground">Podstawy tworzenia filtrów</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Palette className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium">3D Modeling</h4>
                    <p className="text-sm text-muted-foreground">Blender dla początkujących</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Video className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium">VR Events</h4>
                    <p className="text-sm text-muted-foreground">Organizacja eventów VR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrometheusARVR;
