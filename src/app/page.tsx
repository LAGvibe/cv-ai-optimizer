import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Target, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">CV Optimizer</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Optimisation CV powered by IA
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Optimisez votre CV pour
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> chaque offre</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Notre IA analyse votre CV et l&apos;offre d&apos;emploi pour vous proposer des améliorations ciblées.
            Visualisez les changements recommandés directement sur votre document.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
              <Link href="/app" className="flex items-center gap-2">
                Essayer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Upload votre CV</h3>
              <p className="text-gray-600">Glissez-déposez votre CV (PDF, DOCX, TXT)</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">2. Collez l&apos;offre</h3>
              <p className="text-gray-600">Ajoutez la description du poste visé</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Analysez</h3>
              <p className="text-gray-600">Obtenez des suggestions ciblées avec annotations visuelles</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}