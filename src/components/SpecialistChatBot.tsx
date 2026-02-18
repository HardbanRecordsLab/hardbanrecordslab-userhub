import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";

interface Message {
  role: "bot" | "user";
  content: string;
}

interface SpecialistChatBotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const predefinedResponses = {
  hello: "Cześć! Jestem asystentem Hardban Records. Jak mogę Ci pomóc? 🎵",
  pricing: "Oferujemy elastyczne plany cenowe dostosowane do Twoich potrzeb. Plan Basic to 99 PLN/miesiąc, Pro to 299 PLN/miesiąc, a Enterprise jest dostępny na indywidualnych warunkach. Chcesz dowiedzieć się więcej o konkretnym planie?",
  demo: "Z chęcią umówię dla Ciebie demo! Proszę podaj swój email, a nasz specjalista skontaktuje się z Tobą w ciągu 24 godzin. Możesz też od razu napisać na: kontakt@hardbanrecords.com",
  music: "Nasz Moduł Muzyczny pozwala na dystrybucję na 38+ platformach streamingowych (via RouteNote), automatyczne generowanie kodów ISRC/UPC, zarządzanie prawami i split sheets. Chcesz dowiedzieć się więcej?",
  publishing: "Moduł Publikacji umożliwia publikację e-booków i audiobooków na Amazon, Apple Books, Google Play i innych platformach. Mamy również generator audiobooków AI w 40+ językach!",
  marketing: "Moduł Marketingu oferuje AI-powered strategie, smart links, automatyzację PR i social media scheduling. Wszystko w jednym miejscu!",
  ai: "AI Creative Studio to Twoje centrum kreatywne - generowanie treści, grafik, muzyki i profesjonalny mastering audio. Wszystko napędzane najnowszymi modelami AI!",
  default: "Dziękuję za wiadomość! Jeśli chcesz porozmawiać z naszym specjalistą, napisz do nas na kontakt@hardbanrecords.com lub zadzwoń pod numer widoczny na stronie. Czekamy na kontakt! 😊"
};

export function SpecialistChatBot({ open, onOpenChange }: SpecialistChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Cześć! Jestem wirtualnym asystentem Hardban Records. Jak mogę Ci pomóc? Mogę odpowiedzieć na pytania o nasze moduły, cennik lub umówić demo. 🎵" }
  ]);
  const [input, setInput] = useState("");

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("cześć") || input.includes("hej") || input.includes("hello")) {
      return predefinedResponses.hello;
    }
    if (input.includes("cen") || input.includes("koszt") || input.includes("płatność") || input.includes("plan")) {
      return predefinedResponses.pricing;
    }
    if (input.includes("demo") || input.includes("prezentacja") || input.includes("pokaz")) {
      return predefinedResponses.demo;
    }
    if (input.includes("muzyk") || input.includes("dystrybucja") || input.includes("streaming")) {
      return predefinedResponses.music;
    }
    if (input.includes("książ") || input.includes("ebook") || input.includes("audiobook") || input.includes("publikacja")) {
      return predefinedResponses.publishing;
    }
    if (input.includes("marketing") || input.includes("promoc") || input.includes("reklam")) {
      return predefinedResponses.marketing;
    }
    if (input.includes("ai") || input.includes("sztuczna inteligencja") || input.includes("generowanie")) {
      return predefinedResponses.ai;
    }
    
    return predefinedResponses.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: Message = { role: "bot", content: getResponse(input) };
      setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            Asystent Hardban Records
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass-dark"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-secondary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Input
            placeholder="Wpisz swoją wiadomość..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
