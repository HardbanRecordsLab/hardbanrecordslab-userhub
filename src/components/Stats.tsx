import { motion } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  {
    value: 10000,
    suffix: "+",
    label: "Aktywnych Twórców",
    description: "Artyści, autorzy i kreatywni przedsiębiorcy",
  },
  {
    value: 200,
    suffix: "+",
    label: "Platform Dystrybucji",
    description: "Spotify, Apple Music, Amazon i więcej",
  },
  {
    value: 1000000,
    suffix: "+",
    label: "Wydanych Utworów",
    description: "Muzyka, e-booki, audiobooki",
  },
  {
    value: 98,
    suffix: "%",
    label: "Satysfakcji Klientów",
    description: "Na podstawie ankiet użytkowników",
  },
];

export function Stats() {
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
            Liczby Mówią <span className="gradient-text">Same za Siebie</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dołącz do tysięcy twórców, którzy już zaufali HardbanRecords Lab
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="glass-dark p-8 rounded-2xl hover:shadow-glow transition-all duration-500">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  {stat.suffix}
                </div>
                <div className="text-lg font-semibold mb-2">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}