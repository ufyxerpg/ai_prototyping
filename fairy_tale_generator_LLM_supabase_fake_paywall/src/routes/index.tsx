import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/site/SiteNav";
import { useOnboardingStatus } from "@/lib/use-onboarding-status";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Pricing } from "@/components/site/Pricing";
import { CTASection } from "@/components/site/CTASection";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Magical Stories — AI Bedtime Tales for Your Child" },
      {
        name: "description",
        content:
          "Magical Stories uses AI to weave personalized fairy tales for your child in seconds. Beautiful bedtime stories made just for them.",
      },
      {
        property: "og:title",
        content: "Magical Stories — AI Bedtime Tales for Your Child",
      },
      {
        property: "og:description",
        content:
          "Personalized AI fairy tales for parents and children. Start free today.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { completed, loading } = useOnboardingStatus();

  useEffect(() => {
    if (!loading && completed === false) {
      navigate({ to: "/onboarding" });
    }
  }, [completed, loading, navigate]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Outfit:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <SiteNav />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}
