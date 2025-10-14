import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones, BookText, Megaphone, Brain } from "lucide-react";

const modules = [
  {
    icon: Headphones,
    title: "Moduł Muzyczny",
    subtitle: "Dla Artystów i Wytwórni",
    description: "Kompletna dystrybucja muzyki z automatycznym zarządzaniem metadanych, kodami ISRC/UPC i podziałem tantiem.",
    features: [
      "200+ platform streamingowych",
      "Automatyczne kody ISRC",
      "Zarządzanie prawami",
      "Split sheets",
    ],
    color: "primary",
  },
  {
    icon: BookText,
    title: "Moduł Publikacji",
    subtitle: "Dla Autorów i Wydawców",
    description: "Publikuj e-booki i audiobooki w globalnych księgarniach. Generuj audiobooki z AI i zarządzaj ISBN.",
    features: [
      "Amazon, Apple Books, Google",
      "Generator audiobooków AI",
      "Druk na żądanie",
      "Zarządzanie ISBN",
    ],
    color: "secondary",
  },
  {
    icon: Megaphone,
    title: "Moduł Marketingu",
    subtitle: "Promocja z AI",
    description: "Inteligentne kampanie marketingowe napędzane przez AI. Od strategii po automatyczne targetowanie.",
    features: [
      "Generator strategii AI",
      "Smart links",
      "Automatyzacja PR",
      "Social media scheduling",
    ],
    color: "accent",
  },
  {
    icon: Brain,
    title: "AI Creative Studio",
    subtitle: "Narzędzia Kreatywne",
    description: "Generuj treści, grafiki, muzykę i wideo. Twój kreatywny partner AI dostępny 24/7.",
    features: [
      "Generator treści",
      "DALL-E 3 grafiki",
      "Synteza muzyki",
      "Mastering audio",
    ],
    color: "primary",
  },
];

export function Modules() {
  return (
    <section className="py-24 relative bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Potężne <span className="gradient-text">Moduły</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Każdy moduł to kompletne centrum zarządzania dla różnych aspektów Twojej kreatywnej działalności.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass-dark p-8 rounded-2xl h-full hover:shadow-glow transition-all duration-500 group">
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-xl bg-${module.color}/20 p-3 shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className={`w-full h-full text-${module.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{module.title}</h3>
                    <p className={`text-sm text-${module.color} mb-3`}>{module.subtitle}</p>
                    <p className="text-muted-foreground mb-4">{module.description}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {module.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="glow" 
                      className="group/btn"
                      onClick={() => window.location.href = "#contact"}
                    >
                      Dowiedz się więcej
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}