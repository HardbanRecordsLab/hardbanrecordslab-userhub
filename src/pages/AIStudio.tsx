import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Sparkles,
  MessageSquare,
  Image,
  Music,
  FileText,
  Loader2,
  ArrowLeft,
  Wand2,
  Copy
} from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

const promptSchema = z.object({
  prompt: z.string()
    .min(1, "Prompt nie może być pusty")
    .max(10000, "Prompt jest zbyt długi (maksymalnie 10000 znaków)")
    .trim(),
  type: z.enum(["marketing", "content", "strategy"])
});

export default function AIStudio() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [contentType, setContentType] = useState("content");

  const generateContent = async () => {
    // Validate input
    const validation = promptSchema.safeParse({ prompt, type: contentType });
    
    if (!validation.success) {
      toast({
        title: "Błąd walidacji",
        description: validation.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-content", {
        body: validation.data,
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      
      // Save to database
      await supabase.from("ai_content").insert({
        user_id: user?.id,
        content_type: "text",
        prompt,
        generated_content: data.content,
      });

      toast({
        title: "Sukces!",
        description: "Treść została wygenerowana",
      });
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Error generating content:", error);
      }
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił błąd podczas generowania treści",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Skopiowano!",
      description: "Treść została skopiowana do schowka",
    });
  };

  const templates = [
    {
      title: "Post na social media",
      icon: MessageSquare,
      prompt: "Napisz angażujący post na Instagram o nowym singlu...",
    },
    {
      title: "Opis albumu",
      icon: Music,
      prompt: "Stwórz profesjonalny opis albumu muzycznego...",
    },
    {
      title: "Bio artysty",
      icon: FileText,
      prompt: "Napisz krótkie bio artysty do użycia na platformach streamingowych...",
    },
    {
      title: "Plan kampanii",
      icon: Sparkles,
      prompt: "Zaproponuj plan kampanii marketingowej dla nowego wydania...",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do panelu
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary p-2.5">
              <Sparkles className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Creative Studio</h1>
              <p className="text-muted-foreground">
                Generuj treści z pomocą sztucznej inteligencji
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-dark border-white/10 h-full">
              <CardHeader>
                <CardTitle>Generator AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={contentType} onValueChange={setContentType}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Treści</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                    <TabsTrigger value="strategy">Strategia</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Szablony:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {templates.map((template) => (
                      <button
                        key={template.title}
                        onClick={() => setPrompt(template.prompt)}
                        className="p-3 rounded-lg glass text-left hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <template.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{template.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Twój prompt:</label>
                  <Textarea
                    placeholder="Opisz, co chcesz wygenerować..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    className="resize-none"
                    disabled={loading}
                  />
                </div>

                <Button
                  onClick={generateContent}
                  variant="gradient"
                  className="w-full"
                  disabled={loading || !prompt.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generowanie...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generuj Treść
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-dark border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Wygenerowana Treść</CardTitle>
                  {generatedContent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Kopiuj
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm">
                      {generatedContent}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Wygenerowana treść pojawi się tutaj
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { icon: MessageSquare, title: "Posty Social", desc: "Instagram, Facebook, X" },
            { icon: FileText, title: "Opisy i Bio", desc: "Profesjonalne teksty" },
            { icon: Sparkles, title: "Strategie", desc: "Plany marketingowe" },
            { icon: Image, title: "Pomysły Graficzne", desc: "Koncepty wizualne" },
          ].map((feature, index) => (
            <Card key={index} className="glass-dark border-white/10">
              <CardContent className="p-4">
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}