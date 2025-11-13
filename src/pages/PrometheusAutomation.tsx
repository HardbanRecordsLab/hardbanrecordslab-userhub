import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Workflow, Play, Pause, Plus, Zap, Calendar, Mail, Database } from "lucide-react";
import { motion } from "framer-motion";

const PrometheusAutomation = () => {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Automatyczna dystrybucja contentu",
      description: "Publikacja treści na wszystkich kanałach po zatwierdzeniu",
      status: "active",
      triggers: ["Content Approved", "Scheduled Time"],
      actions: ["Publish to Social", "Send Email", "Update Database"],
      lastRun: "2025-11-13 12:30"
    },
    {
      id: 2,
      name: "Monitoring sentymentu i alerty",
      description: "Analiza opinii i powiadomienia o negatywnych reakcjach",
      status: "active",
      triggers: ["New Comment", "New Review"],
      actions: ["Analyze Sentiment", "Send Alert", "Log Event"],
      lastRun: "2025-11-13 13:15"
    },
    {
      id: 3,
      name: "Raportowanie tygodniowe",
      description: "Generowanie i wysyłka raportów co tydzień",
      status: "paused",
      triggers: ["Weekly Schedule"],
      actions: ["Generate Report", "Send Email", "Archive"],
      lastRun: "2025-11-06 09:00"
    }
  ]);

  const workflowTemplates = [
    {
      icon: Calendar,
      name: "Harmonogram publikacji",
      description: "Automatyczne publikowanie według kalendarza",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mail,
      name: "E-mail marketing",
      description: "Kampanie emailowe z personalizacją",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Database,
      name: "Synchronizacja danych",
      description: "Integracja między systemami",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      name: "Reakcja na eventy",
      description: "Automatyczne akcje na podstawie zdarzeń",
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
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Automatyzacja Prometheus</h1>
              <p className="text-muted-foreground">Workflowy i orkiestracja zadań z n8n i Node-RED</p>
            </div>
          </div>
        </motion.div>

        {/* Active Workflows */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Aktywne Workflowy</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nowy Workflow
            </Button>
          </div>

          <div className="grid gap-4">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {workflow.name}
                          <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                            {workflow.status === "active" ? "Aktywny" : "Wstrzymany"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        {workflow.status === "active" ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Wyzwalacze:</p>
                        <div className="flex flex-wrap gap-1">
                          {workflow.triggers.map((trigger, i) => (
                            <Badge key={i} variant="outline">{trigger}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Akcje:</p>
                        <div className="flex flex-wrap gap-1">
                          {workflow.actions.map((action, i) => (
                            <Badge key={i} variant="outline">{action}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Ostatnie uruchomienie:</p>
                        <p className="text-muted-foreground">{workflow.lastRun}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Szablony Workflow</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowTemplates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                      <template.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrometheusAutomation;
