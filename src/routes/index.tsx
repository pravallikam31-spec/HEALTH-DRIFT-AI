import { createFileRoute } from "@tanstack/react-router";
import { AuroraBackground } from "@/components/fx/AuroraBackground";
import { BiotechParticles } from "@/components/fx/BiotechParticles";
import { DNASpineBackground } from "@/components/fx/DNASpineBackground";
import { TopNav } from "@/components/nav/TopNav";
import { Hero } from "@/components/hero/Hero";
import { PredictionShowcase } from "@/components/sections/PredictionShowcase";
import { HealthAnalytics } from "@/components/sections/HealthAnalytics";
import { ChronicMonitor } from "@/components/sections/ChronicMonitor";
import { AIAssistant } from "@/components/sections/AIAssistant";
import { WearableOrbit } from "@/components/sections/WearableOrbit";
import { DriftScore } from "@/components/sections/DriftScore";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus — Predict Your Future Health Before Symptoms Begin" },
      {
        name: "description",
        content:
          "Nexus is the predictive healthcare AI that forecasts chronic disease risk months before the first symptom — fusing genomic, wearable, and biometric signals in real time.",
      },
      { property: "og:title", content: "Nexus — Predictive Healthcare AI" },
      {
        property: "og:description",
        content:
          "Cinematic, AI-powered chronic disease prediction. The body whispers long before it screams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      <AuroraBackground />
      <DNASpineBackground />
      <BiotechParticles />
      <TopNav />
      <main>
        <Hero />
        <PredictionShowcase />
        <HealthAnalytics />
        <ChronicMonitor />
        <AIAssistant />
        <WearableOrbit />
        <DriftScore />
        <FinalCTA />
      </main>
    </div>
  );
}
