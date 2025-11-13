import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Glasses, Video, Sparkles, Plus, Download } from "lucide-react";
import { motion } from "framer-motion";

const PrometheusARVR = () => {
  const [arFilters] = useState([
    {
      id: 1,
      name: "Album Cover Effect",
      platform: "Instagram",
      status: "published",
      uses: 15200,
      preview: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400"
    },
    {
      id: 2,
      name: "Concert Stage AR",
      platform: "Snapchat",
      status: "published",
      uses: 8500,
      preview: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400"
    },
    {
      id: 3,
      name: "Music Video Portal",
      platform: "TikTok",
      status: "draft",
      uses: 0,
      preview: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400"
    }
  ]);

  const [vrExperiences] = useState([
    {
      id: 1,
      name: "Virtual Concert Hall",
      type: "Mozilla Hubs",
      participants: 250,
      status: "active"
    },
    {
      id: 2,
      name: "Album Launch Event",
      type: "Custom WebXR",
      participants: 420,
      status: "scheduled"
    }
  ]);

  const tools = [
    {
      name: "Spark AR Studio",
      description: "Tworzenie filtrów dla Instagram i Facebook",
      icon: Glasses,
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Blender 3D",
      description: "Modelowanie 3D i animacje",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Three.js",
      description: "Interaktywne 3D w przeglądarce",
      icon: Box,
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Mozilla Hubs",
      description: "Wirtualne eventy i przestrzenie",
      icon: Video,
      color: "from-orange-500 to-red-500"
    }
  ];

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
        </motion.div>

        <Tabs defaultValue="ar" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="ar">Filtry AR</TabsTrigger>
            <TabsTrigger value="vr">Eventy VR</TabsTrigger>
            <TabsTrigger value="tools">Narzędzia</TabsTrigger>
          </TabsList>

          <TabsContent value="ar" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Filtry AR</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nowy Filtr
              </Button>
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
                        <Badge variant={filter.status === "published" ? "default" : "secondary"}>
                          {filter.status === "published" ? "Aktywny" : "Szkic"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {filter.status === "published" && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {filter.uses.toLocaleString()} użyć
                          </span>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vr" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Wirtualne Eventy</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nowy Event
              </Button>
            </div>

            <div className="grid gap-4">
              {vrExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {experience.name}
                            <Badge variant={experience.status === "active" ? "default" : "secondary"}>
                              {experience.status === "active" ? "Aktywny" : "Zaplanowany"}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{experience.type}</CardDescription>
                        </div>
                        <Button variant="outline">
                          Otwórz
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="font-medium">Uczestnicy: </span>
                          <span className="text-muted-foreground">{experience.participants}</span>
                        </div>
                        <div>
                          <span className="font-medium">Max capacity: </span>
                          <span className="text-muted-foreground">500</span>
                        </div>
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
                <Button className="w-full">Rozpocznij projekt VR</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
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
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Dokumentacja
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrometheusARVR;
