import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Target, Sparkles, Settings, Star, ChevronRight } from "lucide-react";

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen earth-theme" style={{ background: "linear-gradient(135deg, #fafafa 0%, #ddca7d 100%)" }}>
      {/* Enhanced Header */}
      <header className="relative">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 glass-effect border-b" style={{ borderColor: "var(--earth-border)" }}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, var(--earth-gold) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, var(--earth-accent) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, var(--earth-gold-light) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg" style={{ background: "var(--earth-gold-gradient)" }}>
                  <FileText className="w-6 h-6" style={{ color: "var(--earth-primary)" }} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: "var(--earth-gold)" }}></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl heading-gradient" style={{ fontFamily: "var(--font-heading)" }}>
                  CV Assist
                </span>
                <span className="text-xs" style={{ color: "var(--earth-text-muted)", fontFamily: "var(--font-body)" }}>
                  Assistant CV
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              {/* Navigation breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm" style={{ color: "var(--earth-text-muted)" }}>
                <span style={{ color: "var(--earth-text-secondary)" }}>Accueil</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "var(--earth-surface-elevated)", border: "1px solid var(--earth-gold)" }}>
                  <Star className="w-3 h-3 icon-gold" />
                  <span className="text-xs font-medium text-gradient">MVP</span>
                </div>
                <Button asChild variant="outline" className="hover:opacity-80 transition-all duration-300 focus-ring rounded-xl" style={{ borderColor: "var(--earth-gold)", color: "var(--earth-primary)" }}>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Infos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ backgroundColor: "var(--earth-light)", color: "var(--earth-primary)" }}>
            <Sparkles className="w-4 h-4" />
            MVP - Interface élégante et terreuse
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--earth-primary)" }}>
            Votre assistant
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(45deg, var(--earth-gold), var(--earth-accent))` }}> CV moderne</span>
          </h1>

          <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--earth-text-muted)" }}>
            Interface moderne et intuitive pour la gestion de vos CV.
            Développée avec les dernières technologies web pour une expérience optimale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button asChild size="lg" className="btn-primary px-8 py-6 text-lg font-semibold focus-ring">
              <Link href="/app" className="flex items-center gap-2">
                Voir la démo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--earth-light)" }}>
                <FileText className="w-6 h-6" style={{ color: "var(--earth-gold)" }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>Interface moderne</h3>
              <p style={{ color: "var(--earth-text-muted)" }}>Design épuré avec shadcn/ui et Tailwind CSS</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--earth-light)" }}>
                <Target className="w-6 h-6" style={{ color: "var(--earth-accent)" }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>Next.js 15</h3>
              <p style={{ color: "var(--earth-text-muted)" }}>App Router, TypeScript et optimisations modernes</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--earth-light)" }}>
                <Sparkles className="w-6 h-6" style={{ color: "var(--earth-secondary)" }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>Extensible</h3>
              <p style={{ color: "var(--earth-text-muted)" }}>Architecture prête pour futures fonctionnalités</p>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative mt-20">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 border-t" style={{ borderColor: "var(--earth-border)", backgroundColor: "var(--earth-surface-elevated)" }}>
          <div className="absolute inset-0 opacity-3" style={{
            backgroundImage: `radial-gradient(circle at 10% 20%, var(--earth-gold) 0%, transparent 50%), 
                             radial-gradient(circle at 90% 80%, var(--earth-accent) 0%, transparent 50%),
                             radial-gradient(circle at 50% 50%, var(--earth-gold-light) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "var(--earth-gold-gradient)" }}>
                  <FileText className="w-6 h-6" style={{ color: "var(--earth-primary)" }} />
                </div>
                <div>
                  <span className="font-bold text-xl heading-gradient" style={{ fontFamily: "var(--font-heading)" }}>
                    CV Assist
                  </span>
                  <p className="text-xs" style={{ color: "var(--earth-text-muted)" }}>Version 0.1.0</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--earth-text-muted)" }}>
                Interface moderne pour l'analyse de CV. Développée avec les dernières technologies web.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="font-semibold mb-6" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                Navigation
              </h4>
              <div className="space-y-3">
                <Link href="/" className="block text-sm hover:text-gradient transition-colors" style={{ color: "var(--earth-text-muted)" }}>
                  Accueil
                </Link>
                <Link href="/app" className="block text-sm hover:text-gradient transition-colors" style={{ color: "var(--earth-text-muted)" }}>
                  Application
                </Link>
                <Link href="/settings" className="block text-sm hover:text-gradient transition-colors" style={{ color: "var(--earth-text-muted)" }}>
                  Paramètres
                </Link>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="text-center md:text-right">
              <h4 className="font-semibold mb-6" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                Technologies
              </h4>
              <div className="space-y-2 text-sm" style={{ color: "var(--earth-text-muted)" }}>
                <div>Next.js 15 • TypeScript</div>
                <div>Tailwind CSS • shadcn/ui</div>
                <div>Inter • Outfit Fonts</div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t pt-8" style={{ borderColor: "var(--earth-border)" }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--earth-text-muted)" }}>
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>• MVP Portfolio Project</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--earth-text-muted)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                  <span>Status: Développement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}