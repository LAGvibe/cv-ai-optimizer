"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Settings, Upload, Target, Zap, Loader2, Eye, FileUp, AlertCircle, Sparkles, ChevronRight, Star, PlusCircle, MinusCircle, TrendingUp, PenSquare, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { extractTextFromFile, analyzeCV } from "@/lib/cv-api";
import { CVAnalysis, CVSuggestion, TextExtractionResponse } from "@/types/cv-analysis";

const PRIORITY_ORDER: Record<CVSuggestion["priority"], number> = {
    critique: 0,
    important: 1,
    recommandé: 2,
    optionnel: 3,
};

const PRIORITY_META = {
    critique: {
        label: "Critique",
        border: "#dc2626",
        background: "linear-gradient(135deg, rgba(220,38,38,0.1), rgba(220,38,38,0.03))",
        shadow: "0 10px 24px rgba(220,38,38,0.12)",
        badgeClass: "priority-critical",
    },
    important: {
        label: "Important",
        border: "#ea580c",
        background: "linear-gradient(135deg, rgba(234,88,12,0.1), rgba(234,88,12,0.03))",
        shadow: "0 10px 24px rgba(234,88,12,0.12)",
        badgeClass: "priority-important",
    },
    recommandé: {
        label: "Recommandé",
        border: "#d97706",
        background: "linear-gradient(135deg, rgba(217,119,6,0.1), rgba(217,119,6,0.03))",
        shadow: "0 10px 24px rgba(217,119,6,0.12)",
        badgeClass: "priority-recommended",
    },
    optionnel: {
        label: "Optionnel",
        border: "#6b7280",
        background: "linear-gradient(135deg, rgba(107,114,128,0.08), rgba(107,114,128,0.02))",
        shadow: "0 8px 18px rgba(107,114,128,0.14)",
        badgeClass: "priority-optional",
    },
} satisfies Record<CVSuggestion["priority"], { label: string; border: string; background: string; shadow: string; badgeClass: string }>;

const SUGGESTION_TYPE_META = {
    add: {
        label: "Ajout",
        icon: PlusCircle,
        bg: "rgba(34,197,94,0.08)",
        text: "#15803d",
        border: "rgba(34,197,94,0.2)",
    },
    remove: {
        label: "Suppression",
        icon: MinusCircle,
        bg: "rgba(239,68,68,0.08)",
        text: "#b91c1c",
        border: "rgba(239,68,68,0.2)",
    },
    improve: {
        label: "Optimisation",
        icon: TrendingUp,
        bg: "rgba(37,99,235,0.08)",
        text: "#1d4ed8",
        border: "rgba(37,99,235,0.2)",
    },
    rewrite: {
        label: "Réécriture",
        icon: PenSquare,
        bg: "rgba(217,119,6,0.08)",
        text: "#b45309",
        border: "rgba(217,119,6,0.2)",
    },
    correct: {
        label: "Correction",
        icon: CheckCheck,
        bg: "rgba(14,165,233,0.08)",
        text: "#0ea5e9",
        border: "rgba(14,165,233,0.2)",
    },
} satisfies Record<CVSuggestion["type"], { label: string; icon: typeof PlusCircle; bg: string; text: string; border: string }>;

type AppState = "upload" | "analyze" | "results";

export default function AppPage(): React.JSX.Element {
    const [appState, setAppState] = useState<AppState>("upload");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [cvText, setCvText] = useState<string>("");
    const [jobDescription, setJobDescription] = useState<string>("");
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [isExtracting, setIsExtracting] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<CVAnalysis | null>(null);
    const [extractionResult, setExtractionResult] = useState<TextExtractionResponse | null>(null);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File): Promise<void> => {
        setCvFile(file);
        setIsExtracting(true);

        try {
            toast.loading("Extraction du texte en cours...", { id: "extract" });

            const result = await extractTextFromFile(file);
            setCvText(result.text);
            setExtractionResult(result);

            toast.success("CV importé avec succès !", { id: "extract" });
            setAppState("analyze");
        } catch (error) {
            console.error("Erreur extraction:", error);
            toast.error(error instanceof Error ? error.message : "Erreur lors de l'extraction", { id: "extract" });
            setCvFile(null);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = event.target.files?.[0];
        if (!file) return;
        await processFile(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        if (!isExtracting) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);

        if (isExtracting) return;

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            await processFile(files[0]);
        }
    };

    const handleAnalyze = async (): Promise<void> => {
        if (!cvText || !jobDescription.trim()) {
            toast.error("Veuillez uploader un CV et saisir une offre d'emploi");
            return;
        }

        setIsAnalyzing(true);

        try {
            toast.loading("Analyse en cours...", {
                id: "analyze",
                description: "Cela peut prendre jusqu'à une minute selon la longueur du CV."
            });

            const result = await analyzeCV(cvText, jobDescription);
            setAnalysisResult(result.analysis);

            if (process.env.NODE_ENV === 'development') {
                toast.success("Analyse terminée ! (Mode dev - Rate limiting désactivé)", {
                    id: "analyze",
                    duration: 3000
                });
            } else {
                toast.success("Analyse terminée !", { id: "analyze" });
            }

            setAppState("results");
        } catch (error) {
            console.error("Erreur analyse:", error);

            if (error instanceof Error && error.message.includes('Quota dépassé')) {
                toast.error(error.message, {
                    id: "analyze",
                    duration: 8000,
                    description: "Limite de 5 analyses par semaine atteinte"
                });
            } else {
                toast.error(error instanceof Error ? error.message : "Erreur lors de l'analyse", { id: "analyze" });
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetApp = (): void => {
        setAppState("upload");
        setCvFile(null);
        setCvText("");
        setJobDescription("");
        setIsAnalyzing(false);
        setIsExtracting(false);
        setAnalysisResult(null);
        setExtractionResult(null);
    };

    const sortedSuggestions = analysisResult
        ? [...analysisResult.suggestions].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
        : [];

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fafafa 0%, #ddca7d 100%)", color: "var(--earth-text)" }}>
            <header className="relative">
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
                            <p className="text-base mb-8" style={{ color: "var(--earth-text-muted)" }}>
                                Uploadez votre CV et commencez l'analyse
                            </p>

                            <div className="max-w-md mx-auto p-4 rounded-xl" style={{ backgroundColor: "var(--earth-surface-elevated)" }}>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span style={{ color: "var(--earth-text-secondary)" }}>Progression</span>
                                    <span style={{ color: "var(--earth-text-muted)" }}>Étape 1/3</span>
                                </div>
                                <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--earth-border)" }}>
                                    <div className="h-2 rounded-full transition-all duration-500" style={{ backgroundColor: "var(--earth-gold)", width: "33%" }}></div>
                                </div>
                            </div>
                        </div>


                        <div className="card-elevated p-12">
                            <div
                                className={`upload-zone p-16 text-center cursor-pointer relative z-10 transition-all duration-300 ${isDragOver ? 'border-gold bg-gold-light scale-105' : ''
                                    }`}
                                onClick={() => !isExtracting && fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {isExtracting ? (
                                    <div className="animate-bounce-gentle">
                                        <Loader2 className="w-20 h-20 mx-auto mb-8 icon-gold animate-spin" />
                                    </div>
                                ) : (
                                    <div className="animate-bounce-gentle">
                                        <Upload className="w-20 h-20 mx-auto mb-8 icon-gold" />
                                    </div>
                                )}
                                <h3 className="text-3xl font-bold mb-6 heading-gradient" style={{ fontFamily: "var(--font-heading)" }}>
                                    {isExtracting ? "Extraction en cours..." : "Glissez votre CV ici"}
                                </h3>
                                <p className="text-lg mb-8" style={{ color: "var(--earth-text-secondary)" }}>
                                    {isExtracting ? "Analyse du fichier..." : "ou cliquez pour sélectionner un fichier"}
                                </p>
                                <div className="flex items-center justify-center gap-6 text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                                        PDF uniquement
                                    </span>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                disabled={isExtracting}
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
                            <p className="text-xl mb-8" style={{ color: "var(--earth-text-secondary)" }}>
                                Ajoutez l'offre d'emploi pour l'analyse
                            </p>

                            <div className="max-w-md mx-auto p-4 rounded-xl" style={{ backgroundColor: "var(--earth-surface-elevated)" }}>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span style={{ color: "var(--earth-text-secondary)" }}>Progression</span>
                                    <span style={{ color: "var(--earth-text-muted)" }}>Étape 2/3</span>
                                </div>
                                <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--earth-border)" }}>
                                    <div className="h-2 rounded-full transition-all duration-500" style={{ backgroundColor: "var(--earth-gold)", width: "66%" }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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

                                {cvFile && extractionResult && (
                                    <div className="mb-8 p-6 rounded-2xl card-elevated">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--earth-surface)", border: "2px solid var(--earth-gold)" }}>
                                                <FileUp className="w-6 h-6 icon-gold" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-lg" style={{ color: "var(--earth-text)", fontFamily: "var(--font-heading)" }}>{extractionResult.fileName}</p>
                                                <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>
                                                    {(extractionResult.fileSize / 1024).toFixed(1)} KB • {extractionResult.textLength} caractères • Prêt pour l'analyse
                                                </p>
                                            </div>
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                                        </div>

                                        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: "var(--earth-surface-elevated)", border: "1px solid var(--earth-border)" }}>
                                            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                                Texte extrait du PDF :
                                            </h4>
                                            <div className="max-h-48 overflow-y-auto text-sm leading-relaxed" style={{ color: "var(--earth-text)" }}>
                                                {extractionResult.text}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {cvFile && extractionResult && (
                                    <div className="space-y-4 mb-8">
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
                                )}

                            </div>
                        </div>
                    </div>
                )}

                {appState === "results" && (
                    <div className="max-w-6xl mx-auto">
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
                                Voici les suggestions pour optimiser votre CV
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: "var(--earth-surface-elevated)", border: "1px solid var(--earth-gold)" }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--earth-gold)" }}></div>
                                <span className="text-sm font-medium text-gradient">Analyse terminée</span>
                            </div>

                            <div className="max-w-md mx-auto p-4 rounded-xl" style={{ backgroundColor: "var(--earth-surface-elevated)" }}>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span style={{ color: "var(--earth-text-secondary)" }}>Progression</span>
                                    <span style={{ color: "var(--earth-text-muted)" }}>Étape 3/3</span>
                                </div>
                                <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--earth-border)" }}>
                                    <div className="h-2 rounded-full transition-all duration-500" style={{ backgroundColor: "var(--earth-gold)", width: "100%" }}></div>
                                </div>
                            </div>
                        </div>

                        {analysisResult && (
                            <div className="mt-12 space-y-8">
                                <div className="card-modern p-8">
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                        Résumé de l'analyse
                                    </h3>
                                    <p className="text-lg leading-relaxed" style={{ color: "var(--earth-text)" }}>
                                        {analysisResult.summary}
                                    </p>
                                </div>

                                {analysisResult.detailedMetrics && (
                                    <div className="card-modern p-8">
                                        <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                            Évaluation détaillée
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {Object.entries(analysisResult.detailedMetrics).map(([key, metric]) => (
                                                <div key={key} className="p-4 rounded-xl" style={{ backgroundColor: "var(--earth-surface-elevated)", border: "1px solid var(--earth-border)" }}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-semibold capitalize" style={{ color: "var(--earth-text-secondary)" }}>
                                                            {key === 'experience' ? 'Expérience' :
                                                                key === 'education' ? 'Formation' :
                                                                    key === 'softSkills' ? 'Soft Skills' : 'Compétences Tech'}
                                                        </span>
                                                        <span className="text-lg font-bold" style={{ color: "var(--earth-primary)" }}>
                                                            {metric.score}/{metric.maxScore}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2 rounded-full mb-3" style={{ backgroundColor: "var(--earth-border)" }}>
                                                        <div
                                                            className="h-2 rounded-full transition-all duration-500"
                                                            style={{
                                                                backgroundColor: metric.score >= 8 ? "var(--earth-gold)" :
                                                                    metric.score >= 6 ? "var(--earth-accent)" : "#dc2626",
                                                                width: `${(metric.score / metric.maxScore) * 100}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-xs" style={{ color: "var(--earth-text-muted)" }}>
                                                        {metric.comment}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="card-modern p-6">
                                        <h4 className="text-xl font-bold mb-4" style={{ color: "var(--earth-secondary)", fontFamily: "var(--font-heading)" }}>
                                            Points forts
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysisResult.strengths.map((strength, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: "var(--earth-secondary)" }}></div>
                                                    <span style={{ color: "var(--earth-text)" }}>{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="card-modern p-6">
                                        <h4 className="text-xl font-bold mb-4" style={{ color: "var(--earth-accent)", fontFamily: "var(--font-heading)" }}>
                                            Points à améliorer
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysisResult.weaknesses.map((weakness, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: "var(--earth-accent)" }}></div>
                                                    <span style={{ color: "var(--earth-text)" }}>{weakness}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {analysisResult.missingSkills.length > 0 && (
                                    <div className="card-modern p-6">
                                        <h4 className="text-xl font-bold mb-4" style={{ color: "var(--earth-text)", fontFamily: "var(--font-heading)" }}>
                                            Compétences manquantes
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.missingSkills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 rounded-full text-sm" style={{
                                                    backgroundColor: "var(--earth-light)",
                                                    color: "var(--earth-accent)",
                                                    border: "1px solid var(--earth-accent)"
                                                }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="card-modern p-8">
                                    <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                        Suggestions détaillées
                                    </h3>
                                    <div className="space-y-4">
                                        {sortedSuggestions.map((suggestion, index) => {
                                            const typeMeta = SUGGESTION_TYPE_META[suggestion.type];
                                            const priorityMeta = PRIORITY_META[suggestion.priority];
                                            const TypeIcon = typeMeta.icon;

                                            return (
                                                <div
                                                    key={`${suggestion.section}-${index}`}
                                                    className="p-5 rounded-xl border-l-4 transition-transform duration-200 hover:-translate-y-1"
                                                    style={{
                                                        background: priorityMeta.background,
                                                        borderLeftColor: priorityMeta.border,
                                                        boxShadow: priorityMeta.shadow,
                                                    }}
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                                                                style={{
                                                                    backgroundColor: "var(--earth-surface)",
                                                                    color: priorityMeta.border,
                                                                    border: `1px solid ${priorityMeta.border}`
                                                                }}
                                                            >
                                                                {(index + 1).toString().padStart(2, "0")}
                                                            </span>
                                                            <span
                                                                className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border"
                                                                style={{
                                                                    backgroundColor: typeMeta.bg,
                                                                    color: typeMeta.text,
                                                                    borderColor: typeMeta.border
                                                                }}
                                                            >
                                                                <TypeIcon className="w-4 h-4" />
                                                                {typeMeta.label}
                                                            </span>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${priorityMeta.badgeClass}`}>
                                                            {priorityMeta.label}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>
                                                        {suggestion.suggestion}
                                                    </h4>
                                                    <p className="text-xs uppercase tracking-[0.16em] mb-3" style={{ color: "var(--earth-text-muted)" }}>
                                                        Zone ciblée&nbsp;: {suggestion.section}
                                                    </p>
                                                    {suggestion.text && (
                                                        <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: "var(--earth-surface)", border: "1px dashed var(--earth-border)" }}>
                                                            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--earth-text-muted)" }}>
                                                                Constat actuel
                                                            </p>
                                                            <p className="text-sm" style={{ color: "var(--earth-text)" }}>
                                                                {suggestion.text}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {suggestion.rationale && (
                                                        <p className="text-sm mb-2" style={{ color: "var(--earth-text-muted)" }}>
                                                            <strong>Pourquoi :</strong> {suggestion.rationale}
                                                        </p>
                                                    )}
                                                    {suggestion.impact && (
                                                        <p className="text-sm mb-2" style={{ color: "var(--earth-text-muted)" }}>
                                                            <strong>Impact :</strong> {suggestion.impact}
                                                        </p>
                                                    )}
                                                    {suggestion.exactReplacement && (
                                                        <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "var(--earth-surface)", border: "1px solid var(--earth-gold)" }}>
                                                            <p className="text-xs font-semibold mb-1" style={{ color: "var(--earth-primary)" }}>
                                                                Formulation exacte à copier
                                                            </p>
                                                            <p className="text-sm font-mono" style={{ color: "var(--earth-text)" }}>
                                                                "{suggestion.exactReplacement}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {analysisResult && (
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="card-modern p-6 text-center">
                                    <div className="text-2xl font-bold text-gradient mb-2">{analysisResult.score}%</div>
                                    <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>Score de correspondance</p>
                                </div>
                                <div className="card-modern p-6 text-center">
                                    <div className="text-2xl font-bold text-gradient mb-2">{analysisResult.suggestions.length}</div>
                                    <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>Suggestions trouvées</p>
                                </div>
                                <div className="card-modern p-6 text-center">
                                    <div className="text-2xl font-bold text-gradient mb-2">{analysisResult.suggestions.filter(s => s.priority === 'critique').length}</div>
                                    <p className="text-sm" style={{ color: "var(--earth-text-muted)" }}>Améliorations critiques</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="relative mt-20">
                <div className="absolute inset-0 border-t" style={{ borderColor: "var(--earth-border)", backgroundColor: "var(--earth-surface-elevated)" }}>
                    <div className="absolute inset-0 opacity-3" style={{
                        backgroundImage: `radial-gradient(circle at 10% 20%, var(--earth-gold) 0%, transparent 50%), 
                                         radial-gradient(circle at 90% 80%, var(--earth-accent) 0%, transparent 50%),
                                         radial-gradient(circle at 50% 50%, var(--earth-gold-light) 0%, transparent 50%)`
                    }}></div>
                </div>

                <div className="relative container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
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
