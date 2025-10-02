import { Music2, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  Produkt: ["Funkcje", "Moduły", "Cennik", "API", "Integracje"],
  Firma: ["O Nas", "Kariera", "Blog", "Prasa", "Partnerzy"],
  Wsparcie: ["Centrum Pomocy", "Dokumentacja", "Status", "Kontakt", "FAQ"],
  Prawne: ["Prywatność", "Warunki", "RODO", "Licencje", "Cookies"],
};

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Youtube, href: "#" },
];

export function Footer() {
  return (
    <footer className="py-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary p-2">
                <Music2 className="w-full h-full text-white" />
              </div>
              <span className="text-xl font-bold">
                HardbanRecords<span className="gradient-text">Lab</span>
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Rewolucyjna platforma SaaS dla niezależnych twórców. Jedna platforma, pełna kontrola.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 HardbanRecords Lab. Wszystkie prawa zastrzeżone.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Polityka Prywatności
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Warunki Użytkowania
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Ustawienia Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}