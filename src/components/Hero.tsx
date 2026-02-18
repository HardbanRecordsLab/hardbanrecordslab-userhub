import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";
import { DemoModal } from "./DemoModal";

export function Hero() {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-dark">
        <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-pulse-glow" />
        <div className="absolute inset-0 bg-gradient-primary opacity-10 animate-gradient" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Zaoszczędź 15+ godzin tygodniowo na administracji</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Skup się na muzyce.
            <span className="gradient-text block mt-2">Resztę robi AI.</span>
          </motion.h1>

          {/* Subtitle - clearer value proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            Jedna platforma zamiast 7 subskrypcji. Dystrybucja, marketing, analityka i CRM - 
            wszystko z AI asystentem, który automatyzuje 80% rutynowych zadań.
          </motion.p>

          {/* Value props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap justify-center gap-4 mb-10 text-sm"
          >
            {[
              "✓ Bez karty kredytowej",
              "✓ 30 dni za darmo",
              "✓ 85% przychodów dla Ciebie"
            ].map((item, i) => (
              <span key={i} className="text-muted-foreground">{item}</span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              variant="gradient" 
              size="lg" 
              className="group"
              onClick={() => navigate("/auth")}
            >
              Rozpocznij Za Darmo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="group"
              onClick={() => setDemoOpen(true)}
            >
              <Play className="mr-2 h-4 w-4" />
              Zobacz Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {[
              { value: "38+", label: "Platform Streamingowych" },
              { value: "85%", label: "Podział Przychodów" },
              { value: "24/7", label: "AI Marketing" },
              { value: "∞", label: "Możliwości" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: "4s" }} />

      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </section>
  );
}