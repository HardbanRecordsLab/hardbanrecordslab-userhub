import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Send, Users, Rss, FileText, Plus } from "lucide-react";
import { motion } from "framer-motion";

const PrometheusNewsroom = () => {
  const [pressReleases] = useState([
    {
      id: 1,
      title: "Nowy album studyjny - premiera 15 grudnia",
      date: "2025-11-10",
      status: "published",
      recipients: 45,
      opens: 38
    },
    {
      id: 2,
      title: "Trasa koncertowa 2026 - ogłoszenie dat",
      date: "2025-11-08",
      status: "published",
      recipients: 52,
      opens: 47
    },
    {
      id: 3,
      title: "Współpraca z Netflix - soundtrack do nowego serialu",
      date: "2025-11-13",
      status: "draft",
      recipients: 0,
      opens: 0
    }
  ]);

  const [journalists] = useState([
    {
      id: 1,
      name: "Anna Kowalska",
      outlet: "Muzyka.pl",
      topics: ["Pop", "Rock", "Wywiady"],
      engagement: "high"
    },
    {
      id: 2,
      name: "Piotr Nowak",
      outlet: "Radio Zet",
      topics: ["Hip-hop", "Electronic", "News"],
      engagement: "medium"
    },
    {
      id: 3,
      name: "Magdalena Wiśniewska",
      outlet: "Gazeta Wyborcza",
      topics: ["Culture", "Music Industry", "Reviews"],
      engagement: "high"
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Newsroom & PR Hub</h1>
              <p className="text-muted-foreground">Centrum prasowe i syndykacja treści z WordPress i Strapi</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="releases" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="releases">Press Releases</TabsTrigger>
            <TabsTrigger value="media">Baza Mediów</TabsTrigger>
            <TabsTrigger value="distribution">Dystrybucja</TabsTrigger>
          </TabsList>

          <TabsContent value="releases" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Komunikaty Prasowe</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nowy Komunikat
              </Button>
            </div>

            <div className="grid gap-4">
              {pressReleases.map((release, index) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {release.title}
                            <Badge variant={release.status === "published" ? "default" : "secondary"}>
                              {release.status === "published" ? "Opublikowane" : "Szkic"}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{release.date}</CardDescription>
                        </div>
                        <Button variant="outline">
                          <Send className="w-4 h-4 mr-2" />
                          Wyślij
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="font-medium">Odbiorcy: </span>
                          <span className="text-muted-foreground">{release.recipients}</span>
                        </div>
                        <div>
                          <span className="font-medium">Otwarcia: </span>
                          <span className="text-muted-foreground">{release.opens}</span>
                        </div>
                        {release.opens > 0 && (
                          <div>
                            <span className="font-medium">Open Rate: </span>
                            <span className="text-muted-foreground">
                              {Math.round((release.opens / release.recipients) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Baza Dziennikarzy i Influencerów</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Dodaj Kontakt
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {journalists.map((journalist, index) => (
                <motion.div
                  key={journalist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{journalist.name}</CardTitle>
                      <CardDescription>{journalist.outlet}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Tematy:</p>
                          <div className="flex flex-wrap gap-1">
                            {journalist.topics.map((topic, i) => (
                              <Badge key={i} variant="outline">{topic}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant={journalist.engagement === "high" ? "default" : "secondary"}>
                            {journalist.engagement === "high" ? "Wysoki engagement" : "Średni engagement"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Kanały Dystrybucji</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Rss className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle>RSS Feed</CardTitle>
                      <CardDescription>Automatyczna syndykacja treści</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Konfiguruj RSS</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle>Press Kit</CardTitle>
                      <CardDescription>EPK i materiały promocyjne</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Zarządzaj EPK</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrometheusNewsroom;
