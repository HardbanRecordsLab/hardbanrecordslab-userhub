import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Radio, Upload, Music, Play, Pause, Plus } from "lucide-react";
import { motion } from "framer-motion";

const PrometheusPodcasts = () => {
  const [episodes] = useState([
    {
      id: 1,
      title: "Za kulisami nowego albumu",
      duration: "42:15",
      publishDate: "2025-11-10",
      status: "published",
      downloads: 1240,
      platform: "Spotify"
    },
    {
      id: 2,
      title: "Proces twórczy - rozmowa z producentem",
      duration: "38:20",
      publishDate: "2025-11-03",
      status: "published",
      downloads: 980,
      platform: "Apple Podcasts"
    },
    {
      id: 3,
      title: "Live session - akustyczne wersje hitów",
      duration: "55:30",
      publishDate: "2025-11-13",
      status: "processing",
      downloads: 0,
      platform: "YouTube"
    }
  ]);

  const aiVoiceTools = [
    {
      name: "Riffusion",
      description: "Generowanie muzyki z tekstu",
      icon: Music,
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Bark",
      description: "Synteza mowy i efekty audio",
      icon: Mic,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Podcast Generator",
      description: "AI do tworzenia scenariuszy",
      icon: Radio,
      color: "from-green-500 to-emerald-500"
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
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Podcasty & Radio</h1>
              <p className="text-muted-foreground">Generowanie i dystrybucja audio z Riffusion i Bark</p>
            </div>
          </div>
        </motion.div>

        {/* Episodes List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Odcinki</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nowy Odcinek
            </Button>
          </div>

          <div className="grid gap-4">
            {episodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {episode.title}
                          <Badge variant={episode.status === "published" ? "default" : "secondary"}>
                            {episode.status === "published" ? "Opublikowane" : "Przetwarzanie"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {episode.duration} • {episode.publishDate} • {episode.platform}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="icon">
                        {episode.status === "published" ? (
                          <Play className="w-4 h-4" />
                        ) : (
                          <Pause className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {episode.status === "published" ? (
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="font-medium">Pobrania: </span>
                          <span className="text-muted-foreground">{episode.downloads}</span>
                        </div>
                        <div>
                          <span className="font-medium">Trend: </span>
                          <span className="text-green-600">↑ 15%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Przetwarzanie audio...</span>
                          <span>68%</span>
                        </div>
                        <Progress value={68} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Voice Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Narzędzia AI</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {aiVoiceTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Uruchom</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Dystrybucja RSS</CardTitle>
            <CardDescription>Self-hosted RSS feed dla podcastów</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Radio className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium">RSS Feed URL</p>
                  <p className="text-sm text-muted-foreground">https://your-domain.com/podcast/feed.xml</p>
                </div>
              </div>
              <Button variant="outline">Kopiuj</Button>
            </div>
            <Button className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Wyślij do platform
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrometheusPodcasts;
