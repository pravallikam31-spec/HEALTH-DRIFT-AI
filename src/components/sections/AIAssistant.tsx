import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

function NeuralBackground() {
  // generate deterministic nodes
  const nodes = Array.from({ length: 28 }).map((_, i) => ({
    id: i,
    x: (i * 137.5) % 100,
    y: ((i * i) % 100),
  }));
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (dx * dx + dy * dy < 380) edges.push([i, j]);
    }
  }
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-50">
      <defs>
        <linearGradient id="edge" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.16 220)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.65 0.22 290)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#edge)" strokeWidth="0.08" />
      ))}
      {nodes.map((n) => (
        <circle key={n.id} cx={n.x} cy={n.y} r="0.5" fill="oklch(0.9 0.15 250)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${3 + (n.id % 4)}s`} repeatCount="indefinite" begin={`${n.id * 0.1}s`} />
        </circle>
      ))}
    </svg>
  );
}

const messages = [
  { role: "user", text: "Why is my resting HR up this week?" },
  {
    role: "ai",
    text: "Two factors. Your sleep dropped to 6.1h average (−18%) and cortisol was elevated. Cardiac rhythm itself is healthy. Suggestion: shift caffeine cutoff to 14:00.",
  },
  { role: "user", text: "Run a 6-month cardio forecast." },
  {
    role: "ai",
    text: "Projected ASCVD risk: 4.2% (low). Lead indicators stable. I'll flag any drift > 1.5σ.",
    badge: "Forecast",
  },
];

export function AIAssistant() {
  return (
    <section id="assistant" className="relative px-6 py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-60">
        <NeuralBackground />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/40 to-background/60" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-5 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.28em] text-primary">05 · AI Clinician</span>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">
              A second opinion, <br />
              <span className="text-aurora">always on.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground leading-relaxed">
              Trained on de-identified records from 3,400 specialists, Nexus reasons
              across cardiology, endocrinology, neurology, and oncology in a single
              conversation. Cite-able. Reviewable. Yours.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {["HIPAA", "SOC 2", "GDPR", "FDA 510(k) — pending"].map((t) => (
                <span key={t} className="glass rounded-full px-3 py-1.5">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard strong glow="violet" className="p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 rounded-full bg-pulse grid place-items-center">
                    <div className="absolute inset-0 rounded-full bg-pulse blur-md opacity-60" />
                    <span className="relative font-display text-xs text-primary-foreground">N</span>
                  </div>
                  <div>
                    <div className="text-sm text-foreground">Nexus Clinician</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Online · responding</div>
                  </div>
                </div>
                <span className="font-mono-display text-[10px] text-muted-foreground">SESSION · 0xA12F</span>
              </div>

              <div className="mt-6 space-y-4">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-pulse text-primary-foreground rounded-br-sm"
                          : "glass rounded-bl-sm text-foreground/90"
                      }`}
                    >
                      {m.badge && (
                        <div className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-primary">{m.badge}</div>
                      )}
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="flex justify-start"
                >
                  <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                        style={{ animation: "pulse-soft 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-full glass-strong px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 16 16" className="text-muted-foreground"><path fill="currentColor" d="M8 1a3 3 0 00-3 3v4a3 3 0 006 0V4a3 3 0 00-3-3zm5 7a5 5 0 01-10 0H2a6 6 0 005 5.9V15h2v-1.1A6 6 0 0014 8h-1z"/></svg>
                <span className="text-sm text-muted-foreground flex-1">Ask Nexus anything about your health…</span>
                <span className="font-mono-display text-[10px] text-muted-foreground">⌘K</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
