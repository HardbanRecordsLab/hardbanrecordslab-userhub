import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Wand2, Save, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

const contentSchema = z.object({
  prompt: z.string()
    .min(1, "Prompt nie może być pusty")
    .max(10000, "Prompt jest zbyt długi (maksymalnie 10000 znaków)")
    .trim(),
  contentType: z.enum(["social_post", "blog_article", "email", "ad_copy"]),
  channel: z.enum(["instagram", "facebook", "linkedin", "twitter", "tiktok", "email", "blog"]),
  generateImage: z.boolean()
});

export default function ContentGenerator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("social_post");
  const [channel, setChannel] = useState("instagram");
  const [generateImage, setGenerateImage] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateContent = async () => {
    // Validate input
    const validation = contentSchema.safeParse({
      prompt,
      contentType,
      channel,
      generateImage
    });
    
    if (!validation.success) {
      toast({
        title: "Błąd walidacji",
        description: validation.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedContent("");
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: validation.data,
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
      
      toast({
        title: "Sukces!",
        description: "Treść została wygenerowana",
      });
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił błąd podczas generowania treści",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!generatedContent) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("content_library").insert({
        user_id: user?.id,
        title: `${contentType} - ${new Date().toLocaleDateString()}`,
        content_type: contentType,
        channel: channel,
        content_text: generatedContent,
        media_url: generatedImage,
        ai_generated: true,
        prompt: prompt,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: "Zapisano!",
        description: "Treść została zapisana w bibliotece",
      });
    } catch (error: any) {
      console.error("Error saving content:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać treści",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Skopiowano!",
      description: "Treść została skopiowana do schowka",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
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
              <Wand2 className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Generator Treści</h1>
              <p className="text-muted-foreground">
                Twórz treści marketingowe i grafiki z AI
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
            <Card className="glass-dark border-white/10">
              <CardHeader>
                <CardTitle>Parametry generowania</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contentType">Typ treści</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social_post">Post Social Media</SelectItem>
                      <SelectItem value="blog_article">Artykuł Blogowy</SelectItem>
                      <SelectItem value="email">Email Marketing</SelectItem>
                      <SelectItem value="ad_copy">Tekst Reklamowy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="channel">Kanał</Label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="generateImage">Generuj grafikę</Label>
                  <Switch
                    id="generateImage"
                    checked={generateImage}
                    onCheckedChange={setGenerateImage}
                  />
                </div>

                <div>
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Opisz, jaką treść chcesz wygenerować..."
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
            className="space-y-4"
          >
            <Card className="glass-dark border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Wygenerowana Treść</CardTitle>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Kopiuj
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveContent}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Zapisz
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="whitespace-pre-wrap text-sm max-h-[400px] overflow-y-auto">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wand2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Wygenerowana treść pojawi się tutaj
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {generatedImage && (
              <Card className="glass-dark border-white/10">
                <CardHeader>
                  <CardTitle>Wygenerowana Grafika</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={generatedImage} 
                    alt="Generated content" 
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}