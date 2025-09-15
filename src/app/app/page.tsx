"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Settings, Upload, Target, Zap, Loader2, Eye, FileUp, AlertCircle, Sparkles, ChevronRight, Star } from "lucide-react";
import { toast } from "sonner";

type AppState = "upload" | "analyze" | "results";

export default function AppPage(): React.JSX.Element {
    const [appState, setAppState] = useState<AppState>("upload");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>("");
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            setCvFile(file);
            toast.success("CV uploadé avec succès");
            setAppState("analyze");
        }
    };

    const handleAnalyze = async (): Promise<void> => {
        if (!cvFile || !jobDescription.trim()) {
            toast.error("Veuillez uploader un CV et saisir une offre d'emploi");
            return;
        }

        setIsAnalyzing(true);
        // Simulation d'appel LLM
        setTimeout(() => {
            setIsAnalyzing(false);
            setAppState("results");
            toast.success("Analyse terminée !");
        }, 3000);
    };

    const resetApp = (): void => {
        setAppState("upload");
        setCvFile(null);
        setJobDescription("");
        setIsAnalyzing(false);
    };

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fafafa 0%, #ddca7d 100%)", color: "var(--earth-text)" }}>
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
                                    Assistant IA pour CV
                                </span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-6">
                            {/* Navigation breadcrumb */}
                            <div className="hidden md:flex items-center gap-2 text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                <span>Accueil</span>
                                <ChevronRight className="w-3 h-3" />
                                <span style={{ color: "var(--earth-text-secondary)" }}>Application</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "var(--earth-surface-elevated)", border: "1px solid var(--earth-gold)" }}>
                                    <Star className="w-3 h-3 icon-gold" />
                                    <span className="text-xs font-medium text-gradient">MVP</span>
                                </div>
                                <Button asChild variant="outline" className="hover:opacity-80 transition-all duration-300 focus-ring rounded-xl" style={{ borderColor: "var(--earth-gold)", color: "var(--earth-primary)" }}>
                                    <Link href="/settings">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Paramètres
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                {appState === "upload" && (
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12 animate-fade-in-up">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <Sparkles className="w-8 h-8 icon-gold animate-bounce-gentle" />
                                <h1 className="text-5xl font-bold heading-gradient" style={{ fontFamily: "var(--font-heading)" }}>
                                    CV Assistant
                                </h1>
                                <Sparkles className="w-8 h-8 icon-gold animate-bounce-gentle" style={{ animationDelay: "1s" }} />
                            </div>
                            <p className="text-xl mb-4" style={{ color: "var(--earth-text-secondary)", fontFamily: "var(--font-body)" }}>
                                Interface moderne pour l'analyse de CV
                            </p>
                            <p className="text-base" style={{ color: "var(--earth-text-muted)" }}>
                                Uploadez votre CV et commencez l'analyse
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            {/* Feature Cards */}
                            <div className="card-modern p-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "var(--earth-gold-gradient)" }}>
                                    <Target className="w-8 h-8" style={{ color: "var(--earth-primary)" }} />
                                </div>
                                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                    Analyse
                                </h3>
                                <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                    Analyse de votre CV
                                </p>
                            </div>
                            <div className="card-modern p-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "var(--earth-gold-gradient)" }}>
                                    <Zap className="w-8 h-8" style={{ color: "var(--earth-primary)" }} />
                                </div>
                                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                    Suggestions
                                </h3>
                                <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                    Améliorations suggérées
                                </p>
                            </div>
                            <div className="card-modern p-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "var(--earth-gold-gradient)" }}>
                                    <Eye className="w-8 h-8" style={{ color: "var(--earth-primary)" }} />
                                </div>
                                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                    Résultats
                                </h3>
                                <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                    Visualisation des résultats
                                </p>
                            </div>
                        </div>

                        <div className="card-elevated p-12">
                            <div className="upload-zone p-16 text-center cursor-pointer relative z-10"
                                onClick={() => fileInputRef.current?.click()}>
                                <div className="animate-bounce-gentle">
                                    <Upload className="w-20 h-20 mx-auto mb-8 icon-gold" />
                                </div>
                                <h3 className="text-3xl font-bold mb-6 heading-gradient" style={{ fontFamily: "var(--font-heading)" }}>
                                    Glissez votre CV ici
                                </h3>
                                <p className="text-lg mb-8" style={{ color: "var(--earth-text-secondary)" }}>
                                    ou cliquez pour sélectionner un fichier
                                </p>
                                <div className="flex items-center justify-center gap-6 text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                                        PDF
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                                        DOCX
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                                        TXT
                                    </span>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.docx,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    </div>
                )}

                {appState === "analyze" && (
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12 animate-fade-in-up">
                            <h1 className="text-4xl font-bold mb-6 heading-gradient" style={{ fontFamily: "var(--font-heading)" }}>
                                Configuration
                            </h1>
                            <p className="text-xl" style={{ color: "var(--earth-text-secondary)" }}>
                                Ajoutez l'offre d'emploi pour l'analyse
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Panel gauche - Offre d'emploi */}
                            <div className="card-modern p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--earth-gold-gradient)" }}>
                                        <Target className="w-6 h-6" style={{ color: "var(--earth-primary)" }} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                            Offre d'emploi
                                        </h2>
                                        <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                            Description du poste
                                        </p>
                                    </div>
                                </div>
                                <Textarea
                                    placeholder="Collez ici la description complète du poste...

Exemple :
• Intitulé du poste
• Missions principales
• Compétences requises
• Expérience demandée
• Technologies utilisées"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="min-h-[400px] resize-none focus-ring rounded-xl"
                                    style={{ backgroundColor: "var(--earth-surface-elevated)", borderColor: "var(--earth-border)", color: "var(--earth-text)", fontFamily: "var(--font-body)" }}
                                />
                                <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "var(--earth-surface-elevated)", border: "1px solid var(--earth-border)" }}>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 mt-0.5 icon-gold" />
                                        <div>
                                            <p className="text-sm font-medium mb-1" style={{ color: "var(--earth-text-secondary)" }}>
                                                Information
                                            </p>
                                            <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                                Plus la description est détaillée, plus l'analyse sera précise.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Panel droit - CV et bouton d'analyse */}
                            <div className="card-modern p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--earth-gold-gradient)" }}>
                                        <FileText className="w-6 h-6" style={{ color: "var(--earth-primary)" }} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                            Votre CV
                                        </h2>
                                        <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                            Document à analyser
                                        </p>
                                    </div>
                                </div>

                                {cvFile && (
                                    <div className="mb-8 p-6 rounded-2xl card-elevated">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--earth-surface)", border: "2px solid var(--earth-gold)" }}>
                                                <FileUp className="w-6 h-6 icon-gold" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-lg" style={{ color: "var(--earth-text)", fontFamily: "var(--font-heading)" }}>{cvFile.name}</p>
                                                <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                                    {(cvFile.size / 1024).toFixed(1)} KB • Prêt pour l'analyse
                                                </p>
                                            </div>
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={!jobDescription.trim() || isAnalyzing}
                                        size="lg"
                                        className="btn-primary w-full text-lg py-4 focus-ring"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                                Analyse en cours...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-6 h-6 mr-3" />
                                                Lancer l'analyse
                                                <ChevronRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        onClick={resetApp}
                                        variant="outline"
                                        className="w-full py-3 focus-ring rounded-xl transition-all duration-300"
                                        style={{ borderColor: "var(--earth-border-strong)", color: "var(--earth-text-secondary)" }}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Changer de CV
                                    </Button>
                                </div>

                                {/* Progress indicators */}
                                <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: "var(--earth-surface-elevated)" }}>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span style={{ color: "var(--earth-text-secondary)" }}>Progression</span>
                                        <span style={{ color: "var(--earth-text-muted)" }}>Étape 2/3</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--earth-border)" }}>
                                        <div className="h-2 rounded-full transition-all duration-500" style={{ backgroundColor: "var(--earth-gold)", width: "66%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {appState === "results" && (
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12 animate-fade-in-up">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--earth-gold-gradient)" }}>
                                    <Eye className="w-6 h-6" style={{ color: "var(--earth-primary)" }} />
                                </div>
                                <h1 className="text-4xl font-bold heading-gradient" style={{ fontFamily: "var(--font-heading)" }}>
                                    Analyse terminée
                                </h1>
                            </div>
                            <p className="text-xl mb-4" style={{ color: "var(--earth-text-secondary)" }}>
                                Votre CV avec annotations et suggestions
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "var(--earth-surface-elevated)", border: "1px solid var(--earth-gold)" }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                                <span className="text-sm font-medium text-gradient">Analyse terminée</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Légende des couleurs */}
                            <div className="card-modern p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--earth-gold-gradient)" }}>
                                        <Target className="w-5 h-5" style={{ color: "var(--earth-primary)" }} />
                                    </div>
                                    <h3 className="text-lg font-bold" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                        Légende
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--earth-surface-elevated)" }}>
                                        <div className="w-4 h-4 rounded-full annotation-red"></div>
                                        <div>
                                            <span className="text-sm font-medium" style={{ color: "var(--earth-text)" }}>À supprimer</span>
                                            <p className="text-xs" style={{ color: "var(--earth-text-muted)" }}>Éléments non pertinents</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--earth-surface-elevated)" }}>
                                        <div className="w-4 h-4 rounded-full annotation-yellow"></div>
                                        <div>
                                            <span className="text-sm font-medium" style={{ color: "var(--earth-text)" }}>Orthographe</span>
                                            <p className="text-xs" style={{ color: "var(--earth-text-muted)" }}>Erreurs à corriger</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--earth-surface-elevated)" }}>
                                        <div className="w-4 h-4 rounded-full annotation-orange"></div>
                                        <div>
                                            <span className="text-sm font-medium" style={{ color: "var(--earth-text)" }}>À améliorer</span>
                                            <p className="text-xs" style={{ color: "var(--earth-text-muted)" }}>Suggestions d'optimisation</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--earth-surface-elevated)" }}>
                                        <div className="w-4 h-4 rounded-full annotation-blue"></div>
                                        <div>
                                            <span className="text-sm font-medium" style={{ color: "var(--earth-text)" }}>À réécrire</span>
                                            <p className="text-xs" style={{ color: "var(--earth-text-muted)" }}>Reformulation nécessaire</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PDF annoté (simulation) */}
                            <div className="lg:col-span-3 card-modern p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--earth-gold-gradient)" }}>
                                            <FileText className="w-6 h-6" style={{ color: "var(--earth-primary)" }} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                                CV annoté
                                            </h2>
                                            <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>12 suggestions trouvées</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                                        Terminé • 3/3
                                    </div>
                                </div>

                                {/* Simulation du PDF avec annotations modernes */}
                                <div className="card-elevated p-10 min-h-[600px] relative">
                                    <div className="space-y-6">
                                        <div className="text-center border-b pb-6" style={{ borderColor: "var(--earth-border)" }}>
                                            <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Jean Dupont</h3>
                                            <p className="text-lg" style={{ color: "var(--earth-text-secondary)" }}>Développeur Full Stack</p>
                                            <p className="text-sm mt-2" style={{ color: "var(--earth-text-muted)" }}>jean.dupont@email.com • +33 6 12 34 56 78</p>
                                        </div>

                                        <div className="mt-8">
                                            <h4 className="font-bold text-lg mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--earth-primary)" }}>Expérience Professionnelle</h4>
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl annotation-orange relative">
                                                    <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "var(--earth-gold)", color: "var(--earth-primary)" }}>1</div>
                                                    <strong className="text-lg">Développeur Senior chez TechCorp</strong> <span style={{ color: "var(--earth-text-muted)" }}>• 2020-2023</span>
                                                    <p className="text-sm mt-2">Développement d'applications web avec React et Node.js, gestion d'équipe de 3 développeurs</p>
                                                </div>
                                                <div className="p-4 rounded-xl annotation-blue relative">
                                                    <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "var(--earth-gold)", color: "var(--earth-primary)" }}>2</div>
                                                    <strong className="text-lg">Stagiaire chez StartupXYZ</strong> <span style={{ color: "var(--earth-text-muted)" }}>• 2019</span>
                                                    <p className="text-sm mt-2">Apprentissage des technologies modernes et développement de features</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h4 className="font-bold text-lg mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--earth-primary)" }}>Compétences Techniques</h4>
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl annotation-yellow relative">
                                                    <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "var(--earth-gold)", color: "var(--earth-primary)" }}>3</div>
                                                    <span className="font-medium">Langages :</span> JavaScript, TypeScript, React, Node.js, Python
                                                </div>
                                                <div className="p-4 rounded-xl annotation-red relative">
                                                    <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "var(--earth-gold)", color: "var(--earth-primary)" }}>4</div>
                                                    <span className="font-medium">Bureautique :</span> Word, Excel, PowerPoint
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        onClick={resetApp}
                                        className="btn-primary py-4 text-lg focus-ring"
                                    >
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Nouvelle analyse
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="py-4 text-lg focus-ring rounded-xl transition-all duration-300"
                                        style={{ borderColor: "var(--earth-gold)", color: "var(--earth-primary)" }}
                                    >
                                        <FileText className="w-5 h-5 mr-2" />
                                        Exporter les suggestions
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="card-modern p-6 text-center">
                                <div className="text-2xl font-bold text-gradient mb-2">85%</div>
                                <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>Score de correspondance</p>
                            </div>
                            <div className="card-modern p-6 text-center">
                                <div className="text-2xl font-bold text-gradient mb-2">12</div>
                                <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>Suggestions trouvées</p>
                            </div>
                            <div className="card-modern p-6 text-center">
                                <div className="text-2xl font-bold text-gradient mb-2">4</div>
                                <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>Améliorations critiques</p>
                            </div>
                            <div className="card-modern p-6 text-center">
                                <div className="text-2xl font-bold text-gradient mb-2">+25%</div>
                                <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>Amélioration potentielle</p>
                            </div>
                        </div>
                    </div>
                )}
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