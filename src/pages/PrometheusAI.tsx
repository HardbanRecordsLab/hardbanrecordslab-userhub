import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Share2, 
  Users, 
  BarChart3, 
  Workflow,
  Newspaper,
  Mic,
  Radio,
  Box,
  ArrowRight,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const PrometheusAI = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("overview");

  const modules = [
    {
      id: "ai-factory",
      title: "AI Factory",
      description: "Generowanie treści AI - tekst, grafika, audio, wideo",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      tools: ["GPT-J", "Mistral", "Stable Diffusion", "Whisper", "Bark"],
      action: () => navigate("/dashboard/ai-studio")
    },
    {
      id: "distribution",
      title: "Dystrybucja muzyki",
      description: "Automatyzacja dystrybucji przez RouteNote - 100% darmowa",
      icon: Share2,
      color: "from-blue-500 to-cyan-500",
      tools: ["RouteNote", "Spotify", "Apple Music", "YouTube Music", "Deezer"],
      action: () => navigate("/prometheus-distribution")
    },
    {
      id: "crm",
      title: "CRM i PR",
      description: "Zarządzanie kontaktami i relacjami prasowymi",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      tools: ["EspoCRM", "Mautic", "PostgreSQL", "Segmentacja"],
      action: () => navigate("/dashboard/contacts")
    },
    {
      id: "analytics",
      title: "Analityka",
      description: "Dashboardy i raporty z open source tools",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
      tools: ["Matomo", "Grafana", "Metabase", "ElasticSearch"],
      action: () => navigate("/dashboard/analytics")
    },
    {
      id: "automation",
      title: "Automatyzacja",
      description: "Workflowy i orkiestracja zadań",
      icon: Workflow,
      color: "from-indigo-500 to-purple-500",
      tools: ["n8n", "Node-RED", "Task Management"],
      action: () => navigate("/prometheus-automation")
    },
    {
      id: "newsroom",
      title: "Newsroom & PR Hub",
      description: "Centrum prasowe i syndykacja treści",
      icon: Newspaper,
      color: "from-pink-500 to-rose-500",
      tools: ["WordPress", "Strapi", "RSS", "WebSub"],
      action: () => navigate("/prometheus-newsroom")
    },
    {
      id: "podcasts",
      title: "Podcasty & Radio",
      description: "Generowanie i dystrybucja audio",
      icon: Mic,
      color: "from-yellow-500 to-orange-500",
      tools: ["Riffusion", "Bark", "Self-hosted RSS"],
      action: () => navigate("/prometheus-podcasts")
    },
    {
      id: "arvr",
      title: "AR/VR/MR",
      description: "Immersyjne doświadczenia i eventy",
      icon: Box,
      color: "from-teal-500 to-blue-500",
      tools: ["Spark AR", "Blender", "Three.js", "Mozilla Hubs"],
      action: () => navigate("/prometheus-arvr")
    },
    {
      id: "apis",
      title: "Darmowe API",
      description: "Lista 50+ darmowych API do integracji",
      icon: Radio,
      color: "from-emerald-500 to-green-500",
      tools: ["Spotify API", "YouTube API", "Hugging Face", "Cloudinary"],
      action: () => navigate("/prometheus-apis")
    }
  ];

  const features = [
    { icon: Zap, text: "Zero kosztów licencyjnych" },
    { icon: Sparkles, text: "100% Open Source" },
    { icon: Radio, text: "Niezależność od platform" },
    { icon: Users, text: "Wsparcie dla artystów" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Open Source</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Prometheus OS
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kompleksowa platforma promocyjna dla artystów, muzyków i wydawnictw.<br />
            W pełni bezpłatna i open source.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-card border"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="modules" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="modules">Moduły</TabsTrigger>
            <TabsTrigger value="about">O systemie</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={module.action}>
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <module.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="flex items-center justify-between">
                        {module.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {module.tools.map((tool, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tworzenie treści AI</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Teksty:</strong> Hugging Face Hub (GPT-J, Mistral, Falcon, LLaMA2)</p>
                  <p><strong>Obrazy:</strong> Stable Diffusion (AUTOMATIC1111, ComfyUI)</p>
                  <p><strong>Audio:</strong> Riffusion, Bark, OpenVoice</p>
                  <p><strong>Wideo:</strong> Deforum, AnimateDiff, Blender, FFmpeg</p>
                  <p><strong>Transkrypcje:</strong> OpenAI Whisper</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CRM i Marketing</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p><strong>CRM:</strong> EspoCRM, SuiteCRM</p>
                  <p><strong>Bazy danych:</strong> PostgreSQL, MongoDB Community</p>
                  <p><strong>Marketing automation:</strong> Mautic (self-hosted)</p>
                  <p><strong>E-mail marketing:</strong> Mautic</p>
                  <p><strong>EPK:</strong> WordPress, Strapi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Media</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Automatyzacja:</strong> n8n, Node-RED</p>
                  <p><strong>API otwarte:</strong> Mastodon, Bluesky, Telegram, Reddit</p>
                  <p><strong>API darmowe:</strong> YouTube, LinkedIn</p>
                  <p><strong>Hosting:</strong> GitHub Pages</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analityka</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Web analytics:</strong> Matomo, Umami</p>
                  <p><strong>Dashboardy:</strong> Grafana, Metabase</p>
                  <p><strong>Monitoring:</strong> ElasticSearch, Kibana</p>
                  <p><strong>Predykcje:</strong> Prophet, River ML</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Przechowywanie</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Pliki:</strong> MinIO (S3), Nextcloud</p>
                  <p><strong>Repozytoria:</strong> GitHub, GitLab</p>
                  <p><strong>Bazy:</strong> PostgreSQL, MongoDB, Redis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AR/VR/MR</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p><strong>AR Filtry:</strong> Spark AR Studio</p>
                  <p><strong>3D modele:</strong> Blender, Three.js</p>
                  <p><strong>Eventy wirtualne:</strong> Mozilla Hubs</p>
                </CardContent>
              </Card>
            </div>

            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Filozofia Prometheus OS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  Prometheus OS to kompletne rozwiązanie stworzone z myślą o artystach, muzykach, pisarzach i wydawnictwach. 
                  System bazuje na fundamentalnej zasadzie: <strong className="text-foreground">zero kosztów, pełna niezależność</strong>.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Zero kosztów licencyjnych i subskrypcji</li>
                  <li>Pełen zestaw narzędzi open source i free tier</li>
                  <li>Niezależność od płatnych API i platform zamkniętych</li>
                  <li>Wsparcie dla twórców w całkowicie bezkosztowym modelu</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrometheusAI;
