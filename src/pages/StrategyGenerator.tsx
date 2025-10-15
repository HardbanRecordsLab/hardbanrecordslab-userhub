import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Lightbulb, Save } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

const strategySchema = z.object({
  companyName: z.string().min(1, "Nazwa firmy jest wymagana").max(200, "Nazwa firmy jest zbyt długa").trim(),
  industry: z.string().min(1, "Branża jest wymagana").max(200, "Nazwa branży jest zbyt długa").trim(),
  productService: z.string().min(1, "Produkt/Usługa jest wymagana").max(2000, "Opis jest zbyt długi").trim(),
  targetAudience: z.string().max(2000, "Opis grupy docelowej jest zbyt długi").trim().optional(),
  goals: z.string().max(1000, "Opis celów jest zbyt długi").trim().optional(),
  budget: z.string().max(200, "Opis budżetu jest zbyt długi").trim().optional(),
  timeline: z.string().max(200, "Opis timeline jest zbyt długi").trim().optional()
});

export default function StrategyGenerator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    productService: "",
    targetAudience: "",
    goals: "",
    budget: "",
    timeline: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateStrategy = async () => {
    // Validate input
    const validation = strategySchema.safeParse(formData);
    
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
      const { data, error } = await supabase.functions.invoke("generate-strategy", {
        body: validation.data
      });

      if (error) throw error;

      setGeneratedStrategy(data.strategy);
      
      toast({
        title: "Sukces!",
        description: "Strategia została wygenerowana",
      });
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Error generating strategy:", error);
      }
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił błąd podczas generowania strategii",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveStrategy = async () => {
    if (!generatedStrategy) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("strategies").insert({
        user_id: user?.id,
        name: `${formData.companyName} - Strategia`,
        description: `Strategia marketingowa dla ${formData.productService}`,
        target_audience: { description: formData.targetAudience },
        goals: formData.goals.split(',').map(g => g.trim()),
        generated_content: generatedStrategy,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: "Zapisano!",
        description: "Strategia została zapisana w bazie",
      });

      navigate("/dashboard");
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Error saving strategy:", error);
      }
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać strategii",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
              <Lightbulb className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Generator Strategii</h1>
              <p className="text-muted-foreground">
                Stwórz kompleksową strategię marketingową z AI
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-dark border-white/10">
              <CardHeader>
                <CardTitle>Dane wejściowe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Nazwa firmy *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="np. TechStart Solutions"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Branża *</Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="np. Technologia, E-commerce, Edukacja"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="productService">Produkt/Usługa *</Label>
                  <Textarea
                    id="productService"
                    name="productService"
                    value={formData.productService}
                    onChange={handleInputChange}
                    placeholder="Opisz swój produkt lub usługę..."
                    rows={3}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Grupa docelowa</Label>
                  <Textarea
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="Opisz swoją grupę docelową..."
                    rows={2}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="goals">Cele (oddzielone przecinkami)</Label>
                  <Input
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    placeholder="np. Zwiększenie świadomości marki, Generowanie leadów"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Budżet</Label>
                  <Input
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="np. 50,000 PLN"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    placeholder="np. 6 miesięcy, Q1 2025"
                    disabled={loading}
                  />
                </div>

                <Button
                  onClick={generateStrategy}
                  variant="gradient"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generowanie...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Generuj Strategię
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Strategy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-dark border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Wygenerowana Strategia</CardTitle>
                  {generatedStrategy && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveStrategy}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Zapisz
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedStrategy ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm max-h-[600px] overflow-y-auto">
                      {generatedStrategy}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Wypełnij formularz i wygeneruj strategię
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}